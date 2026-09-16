import type { FinanceType } from "@/types/vehicle-detail";

export const ILLUSTRATION_BASE_DEPOSIT = 1000;
export const ILLUSTRATION_BASE_TERM = 48;

export function illustrateFinance({
  cashPrice,
  representativeMonthly,
  deposit,
  term,
  financeType,
  negativeEquity = 0,
}: {
  cashPrice: number;
  representativeMonthly: number;
  deposit: number;
  term: number;
  financeType: FinanceType;
  negativeEquity?: number;
}): {
  monthlyPayment: number;
  totalPayable: number;
  amountFinanced: number;
  deposit: number;
  term: number;
  financeType: FinanceType;
} {
  const safeDeposit = Math.min(Math.max(0, Math.round(deposit)), cashPrice);
  const amountFinanced =
    Math.max(0, cashPrice - safeDeposit) + Math.max(0, negativeEquity);
  const baseFinanced = Math.max(1, cashPrice - ILLUSTRATION_BASE_DEPOSIT);
  const termFactor = ILLUSTRATION_BASE_TERM / Math.max(12, term);
  const typeFactor = financeType === "pcp" ? 0.86 : 1;
  const monthlyPayment = Math.max(
    1,
    Math.round(
      representativeMonthly * (amountFinanced / baseFinanced) * termFactor * typeFactor,
    ),
  );

  return {
    monthlyPayment,
    totalPayable: monthlyPayment * term + safeDeposit,
    amountFinanced,
    deposit: safeDeposit,
    term,
    financeType,
  };
}

export function getIllustratedMonthly(
  vehicle: { cashPrice: number; monthlyPayment: number },
  deposit: number,
  term: number,
  financeType: FinanceType = "hp",
): number {
  return illustrateFinance({
    cashPrice: vehicle.cashPrice,
    representativeMonthly: vehicle.monthlyPayment,
    deposit,
    term,
    financeType,
  }).monthlyPayment;
}
