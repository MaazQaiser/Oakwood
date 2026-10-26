"use server";

import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import { getPxSession } from "@/features/part-exchange/session";
import { isPxExpired, snapshotToDealPx } from "@/features/part-exchange/store";
import {
  consumeDealResumeToken,
  createDealOpaqueId,
  dealResumeStep,
  findDealByResumeToken,
  getDealRecord,
  isDealExpired,
  isDealResumeStep,
  peekDealResumeToken,
  saveDealResumeToken,
  saveDealShareToken,
  saveExpiredDealResumeToken,
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
import { getDealResumeUrl } from "@/config/routes";
import { emailError, telephoneError } from "@/lib/aftersales/validation";
import type { DealDraft, DealShareSnapshot, DealStepName } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

/**
 * Spec Step 2: cash deposit defaults to ~10% of the vehicle price.
 * Part-exchange equity is added separately in calculateDeal.
 */
const DEPOSIT_STEP = 250;

function defaultDeposit(fallback: number): number {
  return Math.max(0, Math.round(fallback));
}

function tenPercentCashDeposit(cashPrice: number): number {
  const raw = cashPrice * 0.1;
  return Math.max(0, Math.round(raw / DEPOSIT_STEP) * DEPOSIT_STEP);
}

export async function createDealAction(input: {
  stockId: string;
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
  annualMileage?: number;
  /** When provided (e.g. VDP valuation entry hook), preferred over PX session. */
  px?: DealDraft["px"];
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

  // Every "Build your deal" from a car starts a new deal; an earlier deal on
  // the same car is not resumed. Deal URLs (refresh, resume links) still are.
  const eligibility = await getEligibilitySession();
  const pxSession = await getPxSession();
  const pendingPx =
    input.px ??
    (pxSession && !isPxExpired(pxSession)
      ? snapshotToDealPx(pxSession.snapshot)
      : undefined);
  const financeType: FinanceProductType | undefined =
    input.financeType === "pcp" || input.financeType === "hp"
      ? input.financeType
      : "hp";
  const deposit =
    input.cashDeposit !== undefined
      ? defaultDeposit(input.cashDeposit)
      : eligibility && !isSessionExpired(eligibility)
        ? defaultDeposit(
            eligibility.display?.deposit ??
              eligibility.answers.deposit ??
              tenPercentCashDeposit(vehicle.cashPrice),
          )
        : tenPercentCashDeposit(vehicle.cashPrice);
  const term =
    input.term !== undefined
      ? Math.max(12, Math.round(input.term))
      : eligibility && !isSessionExpired(eligibility)
        ? eligibility.display?.term ?? (financeType === "pcp" ? 60 : 84)
        : financeType === "pcp"
          ? 60
          : 84;

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
  phone?: string;
  step?: DealStepName;
  /** QA helper — creates an already-expired token for the expired-link screen. */
  forceExpired?: boolean;
}): Promise<
  | { ok: true; token: string; resumePath: string }
  | { ok: false; reason: "expired" | "invalid" }
> {
  await hydrateDealsFromCookie();
  const record = getDealRecord(input.dealId);
  if (!record || isDealExpired(record)) {
    return { ok: false, reason: "expired" };
  }
  const email = input.email.trim().toLowerCase();
  if (emailError(email)) {
    return { ok: false, reason: "invalid" };
  }
  if (input.phone?.trim() && telephoneError(input.phone)) {
    return { ok: false, reason: "invalid" };
  }
  const phoneDigits = input.phone?.replace(/\D/g, "") ?? "";
  const step = isDealResumeStep(input.step) ? input.step : undefined;
  const token = createDealOpaqueId();
  const saved = input.forceExpired
    ? saveExpiredDealResumeToken(record.id, token, email)
    : saveDealResumeToken(
        record.id,
        token,
        email,
        phoneDigits || undefined,
        step,
      );
  if (!saved) {
    return { ok: false, reason: "expired" };
  }
  await persistDeal(saved);
  return {
    ok: true,
    token,
    resumePath: getDealResumeUrl(token),
  };
}

export async function inspectDealResumeToken(input: {
  token: string;
}): Promise<{ status: "ok" | "expired" | "invalid" | "used" }> {
  await hydrateDealsFromCookie();
  return { status: peekDealResumeToken(input.token).status };
}

export async function resumeDealSession(input: {
  token: string;
  email: string;
}): Promise<
  | { ok: true; dealId: string; step: DealStepName }
  | { ok: false; reason: "invalid" | "expired" | "used" }
> {
  if (input.token === "mock-expired") {
    return { ok: false, reason: "expired" };
  }
  await hydrateDealsFromCookie();
  const pending = findDealByResumeToken(input.token);
  if (!pending?.resume) {
    return { ok: false, reason: "invalid" };
  }
  if (pending.resume.used) {
    return { ok: false, reason: "used" };
  }
  if (pending.resume.expiresAt <= Date.now()) {
    return { ok: false, reason: "expired" };
  }
  const record = consumeDealResumeToken(input.token, input.email);
  if (!record) {
    return { ok: false, reason: "invalid" };
  }
  await writeDealCookie(record.id);
  await persistDeal(record);
  return { ok: true, dealId: record.id, step: dealResumeStep(record) };
}

/**
 * A redeemed link stays single-use. Matching the saved email reopens the
 * same deal. An expired link is confirmed, not reopened.
 */
export async function reopenUsedDealSession(input: {
  token: string;
  email: string;
}): Promise<
  | { ok: true; dealId: string; step: DealStepName; status: "used" }
  | { ok: true; status: "expired" }
  | { ok: false; reason: "invalid" | "mismatch" }
> {
  await hydrateDealsFromCookie();
  const pending = peekDealResumeToken(input.token);
  if (pending.status === "invalid" || !pending.dealId || !pending.email) {
    return { ok: false, reason: "invalid" };
  }
  if (pending.email !== input.email.trim().toLowerCase()) {
    return { ok: false, reason: "mismatch" };
  }
  if (pending.status === "expired") {
    return { ok: true, status: "expired" };
  }
  if (pending.status !== "used") {
    return { ok: false, reason: "invalid" };
  }
  await hydrateDealsFromCookie();
  const record = getDealRecord(pending.dealId);
  if (!record) {
    return { ok: false, reason: "invalid" };
  }
  await writeDealCookie(record.id);
  await persistDeal(record);
  return {
    ok: true,
    dealId: record.id,
    step: dealResumeStep(record),
    status: "used",
  };
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
