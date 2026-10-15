"use server";

import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import { getPxSession } from "@/features/part-exchange/session";
import { isPxExpired, snapshotToDealPx } from "@/features/part-exchange/store";
import {
  consumeDealResumeToken,
  createDealOpaqueId,
  findDealByResumeToken,
  findLiveDealForStock,
  getDealRecord,
  isDealExpired,
  saveDealResumeToken,
  saveDealShareToken,
  toDealDraft,
} from "@/features/deal/store";
import {
  createBoundDeal,
  hydrateDealsFromCookie,
  persistDeal,
  writeDealCookie,
} from "@/features/deal/session";
import { listSelectedProducts } from "@/lib/deal/products";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import type { DealShareSnapshot } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

/**
 * Spec Step 2: deposit is prefilled with PX equity plus a £500 cash default.
 * Equity is added by calculateDeal, so the cash part stays £500.
 */
const DEFAULT_CASH_DEPOSIT = 500;

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

  await hydrateDealsFromCookie();
  const existing = findLiveDealForStock(vehicle.stockId);
  if (existing) {
    await writeDealCookie(existing.id);
    await persistDeal(existing);
    return { ok: true, dealId: existing.id };
  }

  const eligibility = await getEligibilitySession();
  const pxSession = await getPxSession();
  const pendingPx =
    pxSession && !isPxExpired(pxSession)
      ? snapshotToDealPx(pxSession.snapshot)
      : undefined;
  const deposit =
    input.cashDeposit !== undefined
      ? defaultDeposit(input.cashDeposit)
      : eligibility && !isSessionExpired(eligibility)
        ? defaultDeposit(
            eligibility.display?.deposit ??
              eligibility.answers.deposit ??
              DEFAULT_CASH_DEPOSIT,
          )
        : DEFAULT_CASH_DEPOSIT;
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

export async function createDealResumeLink(input: {
  dealId: string;
  email: string;
}): Promise<{ ok: true } | { ok: false; expired: true }> {
  await hydrateDealsFromCookie();
  const record = getDealRecord(input.dealId);
  if (!record || isDealExpired(record)) {
    return { ok: false, expired: true };
  }
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, expired: true };
  }
  await persistDeal(
    saveDealResumeToken(record.id, createDealOpaqueId(), email),
  );
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
  await persistDeal(record);
  return { ok: true, dealId: record.id };
}

export async function createDealShareLink(input: {
  dealId: string;
}): Promise<{ ok: true; token: string } | { ok: false; expired: true }> {
  await hydrateDealsFromCookie();
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
  await persistDeal(saveDealShareToken(record.id, token, snapshot));
  return { ok: true, token };
}
