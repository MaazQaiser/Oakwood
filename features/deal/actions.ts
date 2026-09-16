"use server";

import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import { getPxSession } from "@/features/part-exchange/session";
import { isPxExpired, snapshotToDealPx } from "@/features/part-exchange/store";
import {
  consumeDealResumeToken,
  createDealOpaqueId,
  ensureDemoDeal,
  findDealByResumeToken,
  getDealRecord,
  isDealExpired,
  saveDealResumeToken,
  saveDealShareToken,
  toDealDraft,
  touchDeal,
} from "@/features/deal/store";
import {
  createBoundDeal,
  writeDealCookie,
} from "@/features/deal/session";
import { listSelectedProducts } from "@/lib/deal/products";
import { mockDealId } from "@/lib/mock/data";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import type { DealDraft, DealShareSnapshot } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

function defaultDeposit(fallback: number): number {
  return Math.max(0, Math.round(fallback));
}

export async function createDealAction(input: {
  stockId: string;
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
  annualMileage?: number;
}): Promise<
  | { ok: true; dealId: string }
  | { ok: false; reason: "not_found" | "unavailable" }
> {
  const vehicle = findVehicleByStockId(input.stockId);
  if (!vehicle) {
    return { ok: false, reason: "not_found" };
  }
  if (!isReservable(vehicle)) {
    return { ok: false, reason: "unavailable" };
  }

  const eligibility = await getEligibilitySession();
  const deposit =
    input.cashDeposit !== undefined
      ? defaultDeposit(input.cashDeposit)
      : eligibility && !isSessionExpired(eligibility)
        ? defaultDeposit(
            eligibility.display?.deposit ?? eligibility.answers.deposit ?? 1000,
          )
        : 1000;
  const term =
    input.term !== undefined
      ? Math.max(12, Math.round(input.term))
      : eligibility && !isSessionExpired(eligibility)
        ? eligibility.display?.term ?? 48
        : 48;
  const financeType: FinanceProductType | undefined =
    input.financeType === "pcp" || input.financeType === "hp"
      ? input.financeType
      : undefined;

  const pxSession = await getPxSession();
  const pendingPx =
    pxSession && !isPxExpired(pxSession)
      ? snapshotToDealPx(pxSession.snapshot)
      : undefined;

  const record = await createBoundDeal({
    vehicleStockId: vehicle.stockId,
    cashDeposit: Math.min(deposit, vehicle.cashPrice),
    term,
    financeType,
    annualMileage:
      financeType === "pcp" ? input.annualMileage : undefined,
    px: pendingPx,
  });
  return { ok: true, dealId: record.id };
}

export async function saveDealDraftAction(input: {
  dealId: string;
  draft: DealDraft;
}): Promise<{ ok: true } | { ok: false; expired: true }> {
  const record =
    getDealRecord(input.dealId) ??
    (input.dealId === mockDealId ? ensureDemoDeal() : null);
  if (!record || isDealExpired(record)) {
    return { ok: false, expired: true };
  }

  const financeType: FinanceProductType =
    input.draft.financeType === "pcp" ? "pcp" : "hp";
  const productIds = Array.from(new Set(input.draft.productIds)).filter(
    (id) => listSelectedProducts([id]).length > 0,
  );

  touchDeal(input.dealId, {
    financeType,
    cashDeposit: Math.max(0, Math.round(input.draft.cashDeposit)),
    term: Math.max(12, Math.round(input.draft.term)),
    annualMileage: input.draft.annualMileage,
    px: input.draft.px,
    productIds,
  });
  return { ok: true };
}

export async function createDealResumeLink(input: {
  dealId: string;
  email: string;
}): Promise<{ ok: true } | { ok: false; expired: true }> {
  const record = getDealRecord(input.dealId);
  if (!record || isDealExpired(record)) {
    return { ok: false, expired: true };
  }
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, expired: true };
  }
  saveDealResumeToken(record.id, createDealOpaqueId(), email);
  return { ok: true };
}

export async function resumeDealSession(input: {
  token: string;
  email: string;
}): Promise<{ ok: true; dealId: string } | { ok: false; reason: "invalid" | "expired" }> {
  const pending = findDealByResumeToken(input.token);
  if (!pending?.resume) {
    return { ok: false, reason: "invalid" };
  }
  if (pending.resume.expiresAt <= Date.now() || pending.resume.used) {
    return { ok: false, reason: "expired" };
  }
  const record = consumeDealResumeToken(input.token, input.email);
  if (!record) {
    return { ok: false, reason: "invalid" };
  }
  await writeDealCookie(record.id);
  return { ok: true, dealId: record.id };
}

export async function createDealShareLink(input: {
  dealId: string;
}): Promise<{ ok: true; token: string } | { ok: false; expired: true }> {
  const record = getDealRecord(input.dealId);
  if (!record || isDealExpired(record)) {
    return { ok: false, expired: true };
  }
  const vehicle = findVehicleByStockId(record.vehicleStockId);
  if (!vehicle) {
    return { ok: false, expired: true };
  }

  const draft = toDealDraft(record);
  const snapshot: DealShareSnapshot = {
    vehicle: {
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      derivative: vehicle.derivative,
      cashPrice: vehicle.cashPrice,
      locationName: vehicle.locationName,
    },
    configuration: {
      financeType: draft.financeType,
      term: draft.term,
      annualMileage:
        draft.financeType === "pcp" ? draft.annualMileage : undefined,
      cashDeposit: draft.cashDeposit,
      productNames: listSelectedProducts(draft.productIds).map(
        (product) => product.name,
      ),
    },
  };

  const token = createDealOpaqueId();
  saveDealShareToken(record.id, token, snapshot);
  return { ok: true, token };
}
