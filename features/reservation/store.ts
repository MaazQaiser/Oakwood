import { randomBytes } from "crypto";
import { reservationConfig } from "@/config/reservation";
import { mockVehicleId } from "@/lib/mock/data";
import type {
  MockPaymentOutcome,
  RefundReasonCode,
  ReservationDealSnapshot,
  ReservationPaymentState,
  ReservationStockState,
} from "@/types/reservation";

export const RESERVATION_SESSION_COOKIE = "oakwood_reservation_session";
export const RESERVATION_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export interface ReservationRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  vehicleStockId: string;
  dealId?: string;
  dealSnapshot?: ReservationDealSnapshot;
  email?: string;
  stockState: ReservationStockState;
  paymentState: ReservationPaymentState;
  amount: number;
  currency: string;
  holdDurationDays: number;
  createdAtIso: string;
  expiresAtIso?: string;
  reservedAtIso?: string;
  reference?: string;
  paymentIntentId?: string;
  idempotencyKey?: string;
  webhookDueAt?: number;
  webhookApplied?: boolean;
  mockOutcome?: MockPaymentOutcome;
  refund?: {
    reason: RefundReasonCode;
    requestedAtIso: string;
  };
  financeAllRoutesUnavailable?: boolean;
  locationSlug?: string;
  registration?: string;
}

const reservations = new Map<string, ReservationRecord>();
const stockLocks = new Map<string, Set<string>>();
const idempotencyIndex = new Map<string, string>();
const referenceIndex = new Map<string, string>();

export function createReservationOpaqueId(): string {
  return randomBytes(16).toString("hex");
}

function createMockReference(now = Date.now()): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }
  const numeric = String(now).slice(-5);
  return `OAK-${numeric}`;
}

export function createReservationRecord(input: {
  id: string;
  vehicleStockId: string;
  dealId?: string;
  dealSnapshot?: ReservationDealSnapshot;
  locationSlug?: string;
  registration?: string;
  now?: number;
}): ReservationRecord {
  const now = input.now ?? Date.now();
  const record: ReservationRecord = {
    id: input.id,
    createdAt: now,
    updatedAt: now,
    vehicleStockId: input.vehicleStockId,
    dealId: input.dealId,
    dealSnapshot: input.dealSnapshot,
    stockState: "available",
    paymentState: "pending",
    amount: reservationConfig.amount,
    currency: reservationConfig.currency,
    holdDurationDays: reservationConfig.holdDurationDays,
    createdAtIso: new Date(now).toISOString(),
    locationSlug: input.locationSlug,
    registration: input.registration,
  };
  reservations.set(input.id, record);
  return record;
}

export function getReservationRecord(id: string): ReservationRecord | null {
  return reservations.get(id) ?? null;
}

export function findReservationByReference(
  reference: string,
  email: string,
): ReservationRecord | null {
  const id = referenceIndex.get(reference.trim().toUpperCase());
  if (!id) {
    return null;
  }
  const record = reservations.get(id);
  if (!record?.email || record.email !== email.trim().toLowerCase()) {
    return null;
  }
  return record;
}

export function lockCount(stockId: string): number {
  return stockLocks.get(stockId)?.size ?? 0;
}

export function isStockLockedByOther(
  stockId: string,
  reservationId: string,
): boolean {
  const holders = stockLocks.get(stockId);
  if (!holders || holders.size === 0) {
    return false;
  }
  if (holders.has(reservationId)) {
    return holders.size > reservationConfig.maxConcurrentReservations;
  }
  return holders.size >= reservationConfig.maxConcurrentReservations;
}

export function canLockStock(stockId: string, reservationId: string): boolean {
  const holders = stockLocks.get(stockId);
  if (!holders || holders.size === 0) {
    return true;
  }
  if (holders.has(reservationId)) {
    return true;
  }
  return holders.size < reservationConfig.maxConcurrentReservations;
}

function addLock(stockId: string, reservationId: string): void {
  const holders = stockLocks.get(stockId) ?? new Set<string>();
  holders.add(reservationId);
  stockLocks.set(stockId, holders);
}

export function releaseStock(stockId: string, reservationId: string): void {
  const holders = stockLocks.get(stockId);
  if (!holders) {
    return;
  }
  holders.delete(reservationId);
  if (holders.size === 0) {
    stockLocks.delete(stockId);
  }
}

export function isActiveReservation(record: ReservationRecord): boolean {
  if (record.stockState === "reserved" || record.stockState === "reconciliation") {
    return true;
  }
  return Boolean(record.paymentIntentId && record.paymentState === "pending");
}

export function applyDueTransitions(
  record: ReservationRecord,
  now = Date.now(),
): ReservationRecord {
  let next = record;

  if (
    !next.webhookApplied &&
    next.webhookDueAt !== undefined &&
    next.webhookDueAt <= now &&
    next.paymentState === "pending"
  ) {
    next = applyMockWebhook(next.id, now) ?? next;
  }

  if (
    next.stockState === "reserved" &&
    next.expiresAtIso &&
    Date.parse(next.expiresAtIso) <= now &&
    reservationConfig.automaticRefundOnExpiry
  ) {
    releaseStock(next.vehicleStockId, next.id);
    next =
      patchReservation(
        next.id,
        {
          stockState: "expired",
          paymentState: "refunded",
        },
        now,
      ) ?? next;
  }

  return next;
}

export function applyMockWebhook(
  id: string,
  now = Date.now(),
): ReservationRecord | null {
  const current = reservations.get(id);
  if (!current || current.webhookApplied) {
    return current ?? null;
  }

  const outcome = current.mockOutcome ?? "succeed";

  if (outcome === "fail") {
    return patchReservation(
      id,
      {
        paymentState: "failed",
        webhookApplied: true,
      },
      now,
    );
  }

  if (outcome === "conflict") {
    return patchReservation(
      id,
      {
        paymentState: "pending",
        stockState: "available",
        webhookApplied: true,
      },
      now,
    );
  }

  if (outcome === "reconcile" || !canLockStock(current.vehicleStockId, id)) {
    return patchReservation(
      id,
      {
        paymentState: "paid",
        stockState: "reconciliation",
        webhookApplied: true,
      },
      now,
    );
  }

  addLock(current.vehicleStockId, id);
  const expires = new Date(
    now + current.holdDurationDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const reference = current.reference ?? createMockReference(now);
  if (reference) {
    referenceIndex.set(reference.toUpperCase(), id);
  }

  let next = patchReservation(
    id,
    {
      paymentState: "paid",
      stockState: "reserved",
      webhookApplied: true,
      reservedAtIso: new Date(now).toISOString(),
      expiresAtIso: expires,
      reference,
    },
    now,
  );

  if (!next) {
    return null;
  }

  if (outcome === "expire") {
    releaseStock(next.vehicleStockId, next.id);
    next = patchReservation(
      next.id,
      {
        stockState: "expired",
        paymentState: "refunded",
        expiresAtIso: new Date(now).toISOString(),
      },
      now,
    );
  }

  if (next && outcome === "sold") {
    releaseStock(next.vehicleStockId, next.id);
    next = patchReservation(
      next.id,
      {
        stockState: "sold",
        paymentState: reservationConfig.sameDayRefundOnVehicleUnavailable
          ? "refunded"
          : "refund_pending",
      },
      now,
    );
  }

  if (next && outcome === "finance_unavailable") {
    next = patchReservation(
      next.id,
      {
        financeAllRoutesUnavailable: true,
        stockState: "refund_requested",
        paymentState: reservationConfig.sameDayRefundOnFinanceUnavailable
          ? "refunded"
          : "refund_pending",
      },
      now,
    );
    if (next && reservationConfig.releaseStockOnRefundRequest) {
      releaseStock(next.vehicleStockId, next.id);
    }
  }

  return next;
}

export function patchReservation(
  id: string,
  patch: Partial<Omit<ReservationRecord, "id" | "createdAt" | "createdAtIso">>,
  now = Date.now(),
): ReservationRecord | null {
  const current = reservations.get(id);
  if (!current) {
    return null;
  }
  const next: ReservationRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    createdAtIso: current.createdAtIso,
    updatedAt: now,
  };
  reservations.set(id, next);
  return next;
}

export function rememberIdempotency(
  key: string,
  reservationId: string,
): string | undefined {
  const existing = idempotencyIndex.get(key);
  if (existing) {
    return existing;
  }
  idempotencyIndex.set(key, reservationId);
  return undefined;
}

export function getIdempotentReservation(key: string): string | undefined {
  return idempotencyIndex.get(key);
}

export function ensureDemoReservation(now = Date.now()): ReservationRecord {
  const existing = [...reservations.values()].find(
    (item) =>
      item.vehicleStockId === mockVehicleId && item.stockState === "available",
  );
  if (existing) {
    return existing;
  }
  return createReservationRecord({
    id: createReservationOpaqueId(),
    vehicleStockId: mockVehicleId,
    now,
  });
}
