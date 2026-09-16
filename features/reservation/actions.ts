"use server";

import { randomBytes } from "crypto";
import { reservationConfig } from "@/config/reservation";
import { calculateDeal } from "@/lib/deal/calculate";
import { DEAL_PROVIDER_CONFIG } from "@/lib/deal/provider-config";
import { mockPaymentIntent } from "@/lib/payments/stripe";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import { getDealRecord } from "@/features/deal/store";
import { readDealCookieId } from "@/features/deal/session";
import {
  applyDueTransitions,
  applyMockWebhook,
  getIdempotentReservation,
  findReservationByReference,
  getReservationRecord,
  isActiveReservation,
  isStockLockedByOther,
  patchReservation,
  rememberIdempotency,
  releaseStock,
  type ReservationRecord,
} from "@/features/reservation/store";
import {
  createBoundReservation,
  getBoundReservation,
  writeReservationCookie,
} from "@/features/reservation/session";
import type { ReservationDealSnapshot } from "@/types/reservation";
import type { MockPaymentOutcome, RefundReasonCode } from "@/types/reservation";
import type { Vehicle } from "@/types/vehicle";
import {
  toStatusSnapshot,
  type ReservationStatusSnapshot,
} from "@/features/reservation/status";

function snapshotFromDeal(
  dealId: string,
  vehicle: Vehicle,
): ReservationDealSnapshot | undefined {
  const deal = getDealRecord(dealId);
  if (!deal || deal.vehicleStockId !== vehicle.stockId) {
    return undefined;
  }
  const calculation = calculateDeal(
    {
      vehiclePrice: vehicle.cashPrice,
      vehicleYear: vehicle.year,
      vehicleMileage: vehicle.mileage,
      representativeMonthly: vehicle.monthlyPayment,
      cashDeposit: deal.cashDeposit,
      pxValue: deal.px?.value,
      pxSettlement: deal.px?.settlement,
      financeType: deal.financeType,
      term: deal.term,
      annualMileage: deal.annualMileage,
      productIds: deal.productIds,
    },
    undefined,
    DEAL_PROVIDER_CONFIG,
  );
  const pxEquity = Math.max(0, (deal.px?.value ?? 0) - (deal.px?.settlement ?? 0));
  return {
    dealId,
    vehiclePrice: vehicle.cashPrice,
    cashDeposit: deal.cashDeposit,
    pxEquity,
    financeType: deal.financeType,
    term: deal.term,
    annualMileage: deal.annualMileage,
    monthlyPayment: calculation.monthlyPayment,
  };
}

function mockOutcomeFromEmail(email: string): MockPaymentOutcome {
  const local = email.trim().toLowerCase().split("@")[0] ?? "";
  if (local.startsWith("fail")) {
    return "fail";
  }
  if (local.startsWith("conflict")) {
    return "conflict";
  }
  if (local.startsWith("reconcile")) {
    return "reconcile";
  }
  if (local.startsWith("pending")) {
    return "pending";
  }
  if (local.startsWith("expire")) {
    return "expire";
  }
  if (local.startsWith("sold")) {
    return "sold";
  }
  if (local.startsWith("finance")) {
    return "finance_unavailable";
  }
  return "succeed";
}

function createIdempotencyKey(): string {
  return randomBytes(16).toString("hex");
}

export async function startReservationAction(input: {
  stockId: string;
  dealId?: string;
}): Promise<
  | { ok: true; stockId: string }
  | {
      ok: false;
      reason: "not_found" | "unavailable" | "existing_reservation";
      existingStockId?: string;
    }
> {
  const vehicle = findVehicleByStockId(input.stockId);
  if (!vehicle) {
    return { ok: false, reason: "not_found" };
  }
  if (!isReservable(vehicle)) {
    return { ok: false, reason: "unavailable" };
  }

  const bound = await getBoundReservation();
  if (bound) {
    const current = applyDueTransitions(bound);
    if (isActiveReservation(current) && current.vehicleStockId !== input.stockId) {
      return {
        ok: false,
        reason: "existing_reservation",
        existingStockId: current.vehicleStockId,
      };
    }
    if (current.vehicleStockId === input.stockId) {
      const dealId = input.dealId ?? (await readDealCookieId());
      const snapshot = dealId ? snapshotFromDeal(dealId, vehicle) : undefined;
      if (snapshot && !current.dealSnapshot) {
        patchReservation(current.id, {
          dealSnapshot: snapshot,
          dealId: snapshot.dealId,
        });
      }
      return { ok: true, stockId: input.stockId };
    }
  }

  const dealId = input.dealId ?? (await readDealCookieId());
  const snapshot =
    dealId && vehicle ? snapshotFromDeal(dealId, vehicle) : undefined;

  await createBoundReservation({
    vehicleStockId: vehicle.stockId,
    dealId: snapshot?.dealId,
    dealSnapshot: snapshot,
    locationSlug: vehicle.locationSlug,
    registration: vehicle.registration,
  });

  return { ok: true, stockId: vehicle.stockId };
}

export async function submitReservationPaymentAction(input: {
  email: string;
  idempotencyKey?: string;
}): Promise<
  | { ok: true; status: ReservationStatusSnapshot }
  | {
      ok: false;
      reason:
        | "session"
        | "unavailable"
        | "conflict"
        | "invalid_email"
        | "already_requested";
      status?: ReservationStatusSnapshot;
    }
> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@") || email.length < 5) {
    return { ok: false, reason: "invalid_email" };
  }

  const bound = await getBoundReservation();
  if (!bound) {
    return { ok: false, reason: "session" };
  }

  const record = applyDueTransitions(bound);
  const vehicle = findVehicleByStockId(record.vehicleStockId);

  if (record.stockState === "reserved" && record.paymentState === "paid") {
    return { ok: true, status: toStatusSnapshot(record) };
  }

  const idempotencyKey =
    input.idempotencyKey || record.idempotencyKey || createIdempotencyKey();
  const existingId = getIdempotentReservation(idempotencyKey);
  if (existingId && existingId !== record.id) {
    const existing = getReservationRecord(existingId);
    if (existing) {
      return { ok: true, status: toStatusSnapshot(applyDueTransitions(existing)) };
    }
  }
  rememberIdempotency(idempotencyKey, record.id);

  if (record.idempotencyKey === idempotencyKey && record.paymentIntentId) {
    return { ok: true, status: toStatusSnapshot(record) };
  }

  if (!vehicle || !isReservable(vehicle)) {
    return { ok: false, reason: "unavailable", status: toStatusSnapshot(record) };
  }

  if (isStockLockedByOther(record.vehicleStockId, record.id)) {
    return { ok: false, reason: "conflict", status: toStatusSnapshot(record) };
  }

  const outcome = mockOutcomeFromEmail(email);

  if (outcome === "conflict") {
    const next =
      patchReservation(record.id, {
        email,
        mockOutcome: outcome,
        paymentState: "pending",
        stockState: "available",
        webhookApplied: true,
      }) ?? record;
    return { ok: false, reason: "conflict", status: toStatusSnapshot(next) };
  }

  const intent = mockPaymentIntent({
    reservationId: record.id,
    amount: record.amount,
    currency: record.currency,
    idempotencyKey,
    metadata: {
      stockId: record.vehicleStockId,
      location: record.locationSlug,
      registration: record.registration,
    },
    outcome,
  });

  const delay =
    outcome === "pending"
      ? Math.max(reservationConfig.mockWebhookDelayMs, 8000)
      : reservationConfig.mockWebhookDelayMs;

  const next =
    patchReservation(record.id, {
      email,
      mockOutcome: outcome,
      idempotencyKey,
      paymentIntentId: intent.paymentIntentId,
      paymentState: outcome === "fail" ? "failed" : "pending",
      webhookApplied: outcome === "fail",
      webhookDueAt:
        outcome === "fail" ? undefined : Date.now() + delay,
    }) ?? record;

  if (outcome === "fail") {
    return { ok: true, status: toStatusSnapshot(next) };
  }

  return { ok: true, status: toStatusSnapshot(next) };
}

export async function pollReservationAction(): Promise<
  ReservationStatusSnapshot | { ok: false; reason: "session" }
> {
  const bound = await getBoundReservation();
  if (!bound) {
    return { ok: false, reason: "session" };
  }
  const record = applyDueTransitions(bound);
  return toStatusSnapshot(record);
}

export async function requestReservationRefundAction(input: {
  reason: RefundReasonCode;
}): Promise<
  | { ok: true; status: ReservationStatusSnapshot; already?: boolean }
  | { ok: false; reason: "session" | "not_reserved" | "invalid_reason" }
> {
  const allowed: RefundReasonCode[] = [
    "cheaper_elsewhere",
    "finance_elsewhere",
    "changed_mind",
    "unable_to_attend",
    "px_offer_too_low",
    "other",
  ];
  if (!allowed.includes(input.reason)) {
    return { ok: false, reason: "invalid_reason" };
  }

  const bound = await getBoundReservation();
  if (!bound) {
    return { ok: false, reason: "session" };
  }

  let record: ReservationRecord = applyDueTransitions(bound);

  if (record.stockState === "refund_requested" || record.stockState === "refunded") {
    return { ok: true, already: true, status: toStatusSnapshot(record) };
  }

  if (record.stockState !== "reserved" && record.stockState !== "reconciliation") {
    return { ok: false, reason: "not_reserved" };
  }

  if (reservationConfig.releaseStockOnRefundRequest) {
    releaseStock(record.vehicleStockId, record.id);
  }

  record =
    patchReservation(record.id, {
      stockState: "refund_requested",
      paymentState: "refund_pending",
      refund: {
        reason: input.reason,
        requestedAtIso: new Date().toISOString(),
      },
    }) ?? record;

  return { ok: true, status: toStatusSnapshot(record) };
}

export async function lookupReservationAction(input: {
  email: string;
  reference: string;
}): Promise<{ ok: true } | { ok: false; reason: "not_found" | "invalid" }> {
  const email = input.email.trim().toLowerCase();
  const reference = input.reference.trim();
  if (!email.includes("@") || reference.length < 3) {
    return { ok: false, reason: "invalid" };
  }
  const record = findReservationByReference(reference, email);
  if (!record) {
    return { ok: false, reason: "not_found" };
  }
  await writeReservationCookie(record.id);
  return { ok: true };
}

export async function confirmReservationWebhookAction(): Promise<
  ReservationStatusSnapshot | { ok: false; reason: "session" }
> {
  const bound = await getBoundReservation();
  if (!bound) {
    return { ok: false, reason: "session" };
  }
  const applied = applyMockWebhook(bound.id) ?? bound;
  return toStatusSnapshot(applyDueTransitions(applied));
}
