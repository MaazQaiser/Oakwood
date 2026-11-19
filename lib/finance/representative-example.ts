import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { formatApr } from "@/lib/format/money";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import type { FinanceType } from "@/types/vehicle-detail";

export interface RepresentativeFinanceExample {
  stockId: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  derivative?: string;
  cashPrice: number;
  monthlyPayment: number;
  deposit: number;
  term: number;
  totalPayable: number;
  amountFinanced: number;
  financeType: FinanceType;
  ratesFromApr?: number;
  representativeApr?: number;
  zeroPercentOnSelectedCars: boolean;
}

export type RepresentativeExampleIssue =
  | "missing_vehicle"
  | "missing_cash_price"
  | "missing_deposit"
  | "missing_term"
  | "missing_monthly"
  | "missing_apr"
  | "missing_amount_of_credit"
  | "missing_total_payable"
  | "amount_of_credit_mismatch"
  | "total_payable_mismatch"
  | "total_payable_below_cash";

/**
 * Catalogue HP illustration figures for the Polo representative example.
 * Cash price is set so deposit + 48 × monthly reconciles at the published
 * rates-from APR (~9.4%) — not the raw stock cash price alone.
 */
export const CATALOGUE_REPRESENTATIVE_FIGURES = {
  deposit: 1000,
  term: 48,
  monthlyPayment: 179,
  cashPrice: 8138,
  financeType: "hp" as const,
};

function amountOfCredit(cashPrice: number, deposit: number): number {
  return Math.max(0, cashPrice - deposit);
}

function totalPayable(
  deposit: number,
  monthlyPayment: number,
  term: number,
): number {
  return deposit + monthlyPayment * term;
}

/**
 * Fail-closed guard: every legally required field must be present and the
 * arithmetic must reconcile. Callers must not render a "Representative
 * example" label when this returns an issue.
 */
export function assertRepresentativeExample(
  example: RepresentativeFinanceExample | null | undefined,
): RepresentativeExampleIssue | null {
  if (!example) {
    return "missing_vehicle";
  }
  if (!(example.cashPrice > 0)) {
    return "missing_cash_price";
  }
  if (!(example.deposit >= 0)) {
    return "missing_deposit";
  }
  if (!(example.term > 0)) {
    return "missing_term";
  }
  if (!(example.monthlyPayment > 0)) {
    return "missing_monthly";
  }
  const apr = getExampleApr(example);
  if (apr === undefined || !(apr > 0)) {
    return "missing_apr";
  }
  if (!(example.amountFinanced > 0)) {
    return "missing_amount_of_credit";
  }
  if (!(example.totalPayable > 0)) {
    return "missing_total_payable";
  }
  if (example.amountFinanced !== amountOfCredit(example.cashPrice, example.deposit)) {
    return "amount_of_credit_mismatch";
  }
  if (
    example.totalPayable !==
    totalPayable(example.deposit, example.monthlyPayment, example.term)
  ) {
    return "total_payable_mismatch";
  }
  if (example.totalPayable < example.cashPrice) {
    return "total_payable_below_cash";
  }
  return null;
}

/**
 * Catalogue representative example used across the homepage and finance hub.
 * Returns undefined when required figures are missing or do not reconcile.
 */
export function getRepresentativeFinanceExample():
  | RepresentativeFinanceExample
  | undefined {
  const config = FINANCE_CALCULATOR_CONFIG;
  const vehicle = findVehicleByStockId(config.catalogueExampleStockId);
  if (!vehicle) {
    return undefined;
  }

  const figures = CATALOGUE_REPRESENTATIVE_FIGURES;
  const deposit = figures.deposit;
  const cashPrice = figures.cashPrice;
  const monthlyPayment = figures.monthlyPayment;
  const term = figures.term;
  const example: RepresentativeFinanceExample = {
    stockId: vehicle.stockId,
    slug: vehicle.slug,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    derivative: vehicle.derivative,
    cashPrice,
    monthlyPayment,
    deposit,
    term,
    totalPayable: totalPayable(deposit, monthlyPayment, term),
    amountFinanced: amountOfCredit(cashPrice, deposit),
    financeType: figures.financeType,
    ratesFromApr: config.ratesFromApr,
    representativeApr: config.representativeApr,
    zeroPercentOnSelectedCars: config.zeroPercentOnSelectedCars === true,
  };

  if (assertRepresentativeExample(example) !== null) {
    return undefined;
  }

  return example;
}

export function getExampleApr(
  example: RepresentativeFinanceExample,
): number | undefined {
  return example.representativeApr ?? example.ratesFromApr;
}

export function getRatesFromLabel(apr?: number): string | undefined {
  if (apr === undefined) {
    return undefined;
  }
  return `Rates from ${formatApr(apr)}`;
}

export function getZeroPercentLabel(
  available: boolean,
  variant: "full" | "short" = "full",
): string | undefined {
  if (!available) {
    return undefined;
  }
  return variant === "short"
    ? "0% selected cars"
    : "0% available on selected cars";
}
