import { buildMockValuation, type VeMockValuation } from "@/lib/valuation-entry/mock";
import {
  DEAL_PROVIDER_CONFIG,
  type DealProviderConfig,
} from "@/lib/deal/provider-config";
import { getMockValuation } from "@/lib/mock/vehicle-detail";
import type {
  DealPxCondition,
  DealPxExtraId,
  DealPxServiceHistory,
} from "@/types/deal";

export type PartExchangeValuationResult =
  | { ok: true; value: number }
  | { ok: false; reason: "unavailable" };

/**
 * Mock PX valuation. Registration FAIL or UNKNOWN simulates provider failure.
 * Does not collect name or email.
 */
export function valuePartExchange(
  registration: string,
  mileage: number,
): PartExchangeValuationResult {
  const cleaned = registration.replace(/\s+/g, "").toUpperCase();
  if (!cleaned || !Number.isFinite(mileage) || mileage <= 0) {
    return { ok: false, reason: "unavailable" };
  }
  if (cleaned === "FAIL" || cleaned === "UNKNOWN") {
    return { ok: false, reason: "unavailable" };
  }
  return { ok: true, value: getMockValuation(cleaned, mileage) };
}

export function quotePartExchange(input: {
  registration: string;
  mileage: number;
  condition?: DealPxCondition;
  serviceHistory?: DealPxServiceHistory;
  extras?: DealPxExtraId[];
}): { ok: true; valuation: VeMockValuation } | { ok: false; reason: "unavailable" } {
  const base = valuePartExchange(input.registration, input.mileage);
  if (!base.ok) {
    return base;
  }
  return { ok: true, valuation: buildMockValuation(input) };
}

/** Equity from a returned valuation and the settlement the customer entered. */
export function partExchangePosition(value: number, settlement = 0) {
  const cleanValue = Math.round(value);
  const cleanSettlement = Math.max(0, Math.round(settlement));
  const difference = cleanValue - cleanSettlement;
  return {
    value: cleanValue,
    settlement: cleanSettlement,
    equity: Math.max(0, difference),
    negativeEquity: Math.max(0, -difference),
    depositContribution: Math.max(0, difference),
  };
}

/**
 * Lender negative-equity rule. A missing cap is not treated as zero —
 * the shortfall can be included only when the provider config allows it.
 */
export function negativeEquityBlocksDeal(
  negativeEquity: number,
  config: DealProviderConfig = DEAL_PROVIDER_CONFIG,
): boolean {
  if (negativeEquity <= 0) {
    return false;
  }
  if (!config.includeNegativeEquityInAdvance) {
    return true;
  }
  return (
    config.maxNegativeEquityInAdvance !== undefined &&
    negativeEquity > config.maxNegativeEquityInAdvance
  );
}
