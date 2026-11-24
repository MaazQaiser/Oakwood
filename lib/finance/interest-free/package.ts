import {
  PACKAGE_MOT,
  PACKAGE_SUPAGARD,
  PREMIUM_BRANDS,
} from "@/lib/finance/interest-free/constants";

export interface InterestFreePackage {
  warranty: number;
  service: number;
  mot: number;
  supagard: number;
  total: number;
}

export type CoverYears = 1 | 2 | 3;

/** Per-year ratios against the 3-year band. Supagard has no term. */
export const WARRANTY_YEAR_RATIO: Record<CoverYears, number> = {
  1: 0.4,
  2: 0.68,
  3: 1,
};
export const SERVICE_YEAR_RATIO: Record<CoverYears, number> = {
  1: 0.37,
  2: 0.7,
  3: 1,
};
export const MOT_YEAR_PRICE: Record<CoverYears, number> = {
  1: 125,
  2: 240,
  3: 350,
};

export function warrantyBand(cashPrice: number): number {
  if (cashPrice < 10_000) return 1_600;
  if (cashPrice < 15_000) return 2_100;
  if (cashPrice < 20_000) return 2_500;
  if (cashPrice < 25_000) return 2_800;
  return 3_400;
}

export function serviceBand(fuelType: string, make: string): number {
  if (fuelType.toLowerCase() === "electric") return 900;
  if ((PREMIUM_BRANDS as readonly string[]).includes(make)) return 1_650;
  return 1_200;
}

export function warrantyForYears(cashPrice: number, years: CoverYears = 3): number {
  return Math.round((warrantyBand(cashPrice) * WARRANTY_YEAR_RATIO[years]) / 10) * 10;
}

export function serviceForYears(
  fuelType: string,
  make: string,
  years: CoverYears = 3,
): number {
  return Math.round((serviceBand(fuelType, make) * SERVICE_YEAR_RATIO[years]) / 10) * 10;
}

export function motForYears(years: CoverYears = 3): number {
  return MOT_YEAR_PRICE[years];
}

/** Full three-year package, matching the interest free page default. */
export function pricePackage(vehicle: {
  cashPrice: number;
  fuelType: string;
  make: string;
}): InterestFreePackage {
  const warranty = warrantyForYears(vehicle.cashPrice, 3);
  const service = serviceForYears(vehicle.fuelType, vehicle.make, 3);
  const mot = PACKAGE_MOT;
  const supagard = PACKAGE_SUPAGARD;
  return {
    warranty,
    service,
    mot,
    supagard,
    total: warranty + service + mot + supagard,
  };
}

/** Price a single optional cover product for 1–3 years (Supagard ignores years). */
export function priceCoverProduct(
  vehicle: { cashPrice: number; fuelType: string; make: string },
  id: "warranty" | "service" | "mot" | "supagard",
  years: CoverYears = 3,
): number {
  if (id === "warranty") return warrantyForYears(vehicle.cashPrice, years);
  if (id === "service") return serviceForYears(vehicle.fuelType, vehicle.make, years);
  if (id === "mot") return motForYears(years);
  return PACKAGE_SUPAGARD;
}
