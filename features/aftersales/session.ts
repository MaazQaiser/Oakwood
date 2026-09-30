import { cookies } from "next/headers";
import {
  AFTERSALES_SESSION_TTL_MS,
  BOOKING_HISTORY_COOKIE,
  BOOKING_SESSION_COOKIE,
  CLAIM_SESSION_COOKIE,
  createAftersalesOpaqueId,
  createBookingRecord,
  createClaimRecord,
  getBookingRecord,
  getClaimRecord,
  hydrateBookingHistory,
  isBookingExpired,
  isClaimExpired,
  listRememberedBookings,
  rememberBooking,
  toBookingListEntry,
  type BookingSessionRecord,
  type WarrantyClaimRecord,
} from "@/features/aftersales/store";
import type { AftersalesBookingSource } from "@/types/aftersales";
import type { BookingListEntry } from "@/types/booking";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(AFTERSALES_SESSION_TTL_MS / 1000),
  };
}

export async function writeBookingCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(BOOKING_SESSION_COOKIE, id, cookieOptions());
}

function parseHistory(value?: string): BookingListEntry[] {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is BookingListEntry => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof (item as BookingListEntry).reference === "string" &&
        typeof (item as BookingListEntry).serviceType === "string" &&
        typeof (item as BookingListEntry).locationName === "string"
      );
    });
  } catch {
    return [];
  }
}

export async function readBookingHistory(): Promise<BookingListEntry[]> {
  const jar = await cookies();
  const stored = parseHistory(jar.get(BOOKING_HISTORY_COOKIE)?.value);
  hydrateBookingHistory(stored.slice().reverse());
  return listRememberedBookings();
}

export async function writeBookingHistory(entries: BookingListEntry[]): Promise<void> {
  const jar = await cookies();
  jar.set(BOOKING_HISTORY_COOKIE, JSON.stringify(entries), cookieOptions());
}

export async function archiveBooking(record: BookingSessionRecord): Promise<BookingListEntry[]> {
  const entry = toBookingListEntry(record);
  if (!entry) {
    return readBookingHistory();
  }
  await readBookingHistory();
  const next = rememberBooking(entry);
  await writeBookingHistory(next);
  return next;
}

export async function readBookingCookieId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(BOOKING_SESSION_COOKIE)?.value;
}

export async function getBookingSession(): Promise<BookingSessionRecord | null> {
  const id = await readBookingCookieId();
  if (!id) {
    return null;
  }
  return getBookingRecord(id);
}

export async function getOrCreateBookingSession(
  source: AftersalesBookingSource,
): Promise<BookingSessionRecord> {
  const existing = await getBookingSession();
  if (existing && !isBookingExpired(existing) && existing.status !== "requested") {
    return existing;
  }

  const id = createAftersalesOpaqueId();
  const record = createBookingRecord(id, source);
  await writeBookingCookie(id);
  return record;
}

export async function writeClaimCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(CLAIM_SESSION_COOKIE, id, cookieOptions());
}

export async function readClaimCookieId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(CLAIM_SESSION_COOKIE)?.value;
}

export async function getClaimSession(): Promise<WarrantyClaimRecord | null> {
  const id = await readClaimCookieId();
  if (!id) {
    return null;
  }
  return getClaimRecord(id);
}

export async function getOrCreateClaimSession(): Promise<WarrantyClaimRecord> {
  const existing = await getClaimSession();
  if (existing && !isClaimExpired(existing) && existing.status !== "submitted") {
    return existing;
  }

  const id = createAftersalesOpaqueId();
  const record = createClaimRecord(id);
  await writeClaimCookie(id);
  return record;
}
