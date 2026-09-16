import { cookies } from "next/headers";
import {
  RESERVATION_SESSION_COOKIE,
  RESERVATION_SESSION_TTL_MS,
  createReservationOpaqueId,
  createReservationRecord,
  getReservationRecord,
  type ReservationRecord,
} from "@/features/reservation/store";
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

export async function getBoundReservation(): Promise<ReservationRecord | null> {
  const id = await readReservationCookieId();
  if (!id) {
    return null;
  }
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
