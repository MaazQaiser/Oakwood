import { getMockValuation } from "@/lib/mock/vehicle-detail";

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
