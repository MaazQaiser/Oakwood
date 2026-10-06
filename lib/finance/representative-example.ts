import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { illustrateFinance } from "@/lib/finance/illustration";
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

/**
 * Catalogue representative example used across the homepage.
 * Figures come from the calculator config and illustrateFinance —
 * the same illustration bound as Deal Builder / calculator, not a
 * second hardcoded example.
 */
export function getRepresentativeFinanceExample():
  | RepresentativeFinanceExample
  | undefined {
  const config = FINANCE_CALCULATOR_CONFIG;
  const vehicle = findVehicleByStockId(config.catalogueExampleStockId);
  if (!vehicle) {
    return undefined;
  }

  const illustration = illustrateFinance({
    cashPrice: vehicle.cashPrice,
    representativeMonthly: vehicle.monthlyPayment,
    deposit: config.defaultDeposit,
    term: config.defaultTerm,
    financeType: "hp",
  });

  return {
    stockId: vehicle.stockId,
    slug: vehicle.slug,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    derivative: vehicle.derivative,
    cashPrice: vehicle.cashPrice,
    monthlyPayment: illustration.monthlyPayment,
    deposit: illustration.deposit,
    term: illustration.term,
    totalPayable: illustration.totalPayable,
    amountFinanced: illustration.amountFinanced,
    financeType: illustration.financeType,
    ratesFromApr: config.ratesFromApr,
    representativeApr: config.representativeApr,
    zeroPercentOnSelectedCars: config.zeroPercentOnSelectedCars === true,
  };
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
