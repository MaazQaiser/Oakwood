import { cookies } from "next/headers";
import {
  RESERVATION_SESSION_COOKIE,
  RESERVATION_SESSION_TTL_MS,
  createReservationOpaqueId,
  createReservationRecord,
  getReservationRecord,
  restoreReservationRecord,
  type ReservationRecord,
} from "@/features/reservation/store";
import {
  isRecordWithId,
  readStateCookie,
  writeStateCookie,
} from "@/lib/session/state-cookie";

const RESERVATION_STATE_COOKIE = "oakwood_reservation_state";
import type { ReservationDealSnapshot } from "@/types/reservation";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(RESERVATION_SESSION_TTL_MS / 1000),
  };
}

export async function writeReservationCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(RESERVATION_SESSION_COOKIE, id, cookieOptions());
}

export async function readReservationCookieId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(RESERVATION_SESSION_COOKIE)?.value;
}

async function hydrateReservation(id: string): Promise<void> {
  const saved = await readStateCookie(RESERVATION_STATE_COOKIE);
  if (isRecordWithId(saved) && saved.id === id) {
    restoreReservationRecord(saved as ReservationRecord);
  }
}

/** Copy the bound reservation to its state cookie. Server Functions only. */
export async function persistReservation(): Promise<void> {
  const id = await readReservationCookieId();
  if (!id) {
    return;
  }
  await hydrateReservation(id);
  await writeStateCookie(
    RESERVATION_STATE_COOKIE,
    getReservationRecord(id),
    RESERVATION_SESSION_TTL_MS,
  );
}

export async function getBoundReservation(): Promise<ReservationRecord | null> {
  const id = await readReservationCookieId();
  if (!id) {
    return null;
  }
  await hydrateReservation(id);
  return getReservationRecord(id);
}

export async function createBoundReservation(input: {
  vehicleStockId: string;
  dealId?: string;
  dealSnapshot?: ReservationDealSnapshot;
  locationSlug?: string;
  registration?: string;
}): Promise<ReservationRecord> {
  const id = createReservationOpaqueId();
  const record = createReservationRecord({
    id,
    vehicleStockId: input.vehicleStockId,
    dealId: input.dealId,
    dealSnapshot: input.dealSnapshot,
    locationSlug: input.locationSlug,
    registration: input.registration,
  });
  await writeReservationCookie(id);
  return record;
}
