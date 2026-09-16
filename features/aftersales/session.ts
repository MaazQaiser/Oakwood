import { cookies } from "next/headers";
import {
  AFTERSALES_SESSION_TTL_MS,
  BOOKING_SESSION_COOKIE,
  CLAIM_SESSION_COOKIE,
  createAftersalesOpaqueId,
  createBookingRecord,
  createClaimRecord,
  getBookingRecord,
  getClaimRecord,
  isBookingExpired,
  isClaimExpired,
  type BookingSessionRecord,
  type WarrantyClaimRecord,
} from "@/features/aftersales/store";
import type { AftersalesBookingSource } from "@/types/aftersales";

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
