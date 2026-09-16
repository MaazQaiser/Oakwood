import type { FinanceDisplayState } from "@/components/finance/FinancePrimitives";
import type { CustomerFinanceMode } from "@/features/eligibility/CustomerFinanceProvider";

export function getFinanceDisplayState(
  mode: CustomerFinanceMode,
  cashPrice?: number,
  maxAdvance?: number,
  deposit = 0,
): FinanceDisplayState {
  if (mode === "anonymous") {
    return "representative";
  }

  if (
    cashPrice !== undefined &&
    maxAdvance !== undefined &&
    cashPrice - deposit > maxAdvance
  ) {
    return "ineligible";
  }

  if (mode === "ineligible") {
    return cashPrice !== undefined && maxAdvance !== undefined
      ? "personalised"
      : "ineligible";
  }

  return "personalised";
}

export function getDepositGap(
  cashPrice: number,
  maxAdvance: number,
  deposit = 0,
): number | undefined {
  const gap = cashPrice - deposit - maxAdvance;
  return gap > 0 ? Math.round(gap) : undefined;
}
