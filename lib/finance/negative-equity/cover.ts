import {
  COVER_PRODUCTS,
  type CoverProductId,
  type CoverYear,
} from "@/lib/finance/negative-equity/constants";
import {
  PACKAGE_SUPAGARD,
  PREMIUM_BRANDS,
} from "@/lib/finance/interest-free/constants";
import {
  warrantyBand,
  serviceBand,
} from "@/lib/finance/interest-free/package";

/** Per-year ratios against the 3-year band used on the interest free page. */
const WARRANTY_YEAR: Record<CoverYear, number> = {
  1: 0.4,
  2: 0.68,
  3: 1,
};
const SERVICE_YEAR: Record<CoverYear, number> = {
  1: 0.37,
  2: 0.7,
  3: 1,
};
const MOT_YEAR: Record<CoverYear, number> = {
  1: 125,
  2: 240,
  3: 350,
};

export type CoverSelection = Record<CoverProductId, 0 | CoverYear | 1>;

export const EMPTY_COVER: CoverSelection = {
  w: 0,
  s: 0,
  m: 0,
  g: 0,
};

export function priceCoverItem(
  vehicle: { cashPrice: number; fuelType: string; make: string },
  id: CoverProductId,
  years: number,
): number {
  const yrs = Math.max(1, Math.min(3, years)) as CoverYear;
  if (id === "w") {
    return Math.round(warrantyBand(vehicle.cashPrice) * WARRANTY_YEAR[yrs] / 10) * 10;
  }
  if (id === "s") {
    return (
      Math.round(serviceBand(vehicle.fuelType, vehicle.make) * SERVICE_YEAR[yrs] / 10) *
      10
    );
  }
  if (id === "m") {
    return MOT_YEAR[yrs];
  }
  return PACKAGE_SUPAGARD;
}

export function coverTotal(
  vehicle: { cashPrice: number; fuelType: string; make: string },
  cover: CoverSelection,
): number {
  let total = 0;
  for (const product of COVER_PRODUCTS) {
    const years = cover[product.id];
    if (years) {
      total += priceCoverItem(vehicle, product.id, years);
    }
  }
  return total;
}

export function isPremiumBrand(make: string): boolean {
  return (PREMIUM_BRANDS as readonly string[]).includes(make);
}

export { COVER_PRODUCTS };
