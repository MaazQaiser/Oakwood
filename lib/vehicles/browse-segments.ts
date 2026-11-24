import {
  type CashBudgetBand,
  CASH_BUDGET_BANDS,
  type MonthlyBudgetBand,
  MONTHLY_BUDGET_BANDS,
  getBodyTypeUrl,
  getCashBudgetUrl,
  getFuelTypeUrl,
  getMonthlyBudgetUrl,
  routes,
} from "@/config/routes";
import type { SearchQuery } from "@/lib/validation/search";
import { BODY_TYPES, FUEL_TYPES } from "@/lib/vehicles/search";

export interface BrowseSegmentMeta {
  title: string;
  description: string;
  breadcrumbLabel: string;
  canonicalPath: string;
}

function parseBandAmount(band: string): number | undefined {
  const match = band.match(/^(?:under|over)-(\d+)$/);
  if (!match) {
    return undefined;
  }
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

export function monthlyBandToQuery(band: MonthlyBudgetBand): Partial<SearchQuery> {
  const amount = parseBandAmount(band);
  if (amount === undefined) {
    return {};
  }
  if (band.startsWith("under-")) {
    return { monthly_max: String(amount) };
  }
  return { monthly_min: String(amount) };
}

export function cashBandToQuery(band: CashBudgetBand): Partial<SearchQuery> {
  const amount = parseBandAmount(band);
  if (amount === undefined) {
    return {};
  }
  if (band.startsWith("under-")) {
    return { max_price: String(amount) };
  }
  return { min_price: String(amount) };
}

export function monthlyBandMeta(band: MonthlyBudgetBand): BrowseSegmentMeta {
  const amount = parseBandAmount(band);
  const formatted =
    amount !== undefined
      ? new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          maximumFractionDigits: 0,
        }).format(amount)
      : band;

  const title =
    band.startsWith("under-")
      ? `Used cars under ${formatted} per month`
      : `Used cars over ${formatted} per month`;

  return {
    title,
    breadcrumbLabel: band.startsWith("under-")
      ? `Under ${formatted}/month`
      : `Over ${formatted}/month`,
    description: `Browse Oakwood used cars ${band.startsWith("under-") ? "under" : "over"} ${formatted} per month. Monthly payments are shown first with finance-first search.`,
    canonicalPath: getMonthlyBudgetUrl(band),
  };
}

export function cashBandMeta(band: CashBudgetBand): BrowseSegmentMeta {
  const amount = parseBandAmount(band);
  const formatted =
    amount !== undefined
      ? new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          maximumFractionDigits: 0,
        }).format(amount)
      : band;

  const title =
    band.startsWith("under-")
      ? `Used cars under ${formatted}`
      : `Used cars over ${formatted}`;

  return {
    title,
    breadcrumbLabel: band.startsWith("under-")
      ? `Under ${formatted}`
      : `Over ${formatted}`,
    description: `Browse Oakwood used cars ${band.startsWith("under-") ? "under" : "over"} ${formatted} cash price, with monthly finance figures alongside.`,
    canonicalPath: getCashBudgetUrl(band),
  };
}

export function bodySlugToStyle(slug: string): string | undefined {
  const normalised = slug.trim().toLowerCase();
  const match = BODY_TYPES.find(
    (body) => body.toLowerCase() === normalised,
  );
  return match;
}

export function bodySegmentMeta(style: string): BrowseSegmentMeta {
  const title = `Used ${style} cars for sale`;
  return {
    title,
    breadcrumbLabel: style,
    description: `Browse used ${style.toLowerCase()} cars at Oakwood with monthly payments shown first.`,
    canonicalPath: getBodyTypeUrl(style),
  };
}

export function fuelSlugToType(slug: string): string | undefined {
  const normalised = slug.trim().toLowerCase();
  return FUEL_TYPES.find((fuel) => fuel.toLowerCase() === normalised);
}

export function fuelSegmentMeta(fuel: string): BrowseSegmentMeta {
  const title = `Used ${fuel.toLowerCase()} cars for sale`;
  return {
    title,
    breadcrumbLabel: fuel,
    description: `Browse used ${fuel.toLowerCase()} cars at Oakwood. Compare monthly payments, specification and location.`,
    canonicalPath: getFuelTypeUrl(fuel),
  };
}

export const automaticSegmentMeta: BrowseSegmentMeta = {
  title: "Used automatic cars for sale",
  breadcrumbLabel: "Automatic",
  description:
    "Browse used automatic cars at Oakwood. Monthly payments are shown first so you can see what fits your budget.",
  canonicalPath: routes.usedCarsAutomatic,
};

export const priceDropsSegmentMeta: BrowseSegmentMeta = {
  title: "Used cars with price drops",
  breadcrumbLabel: "Price drops",
  description:
    "See Oakwood used cars where the price has recently been reduced. Monthly and cash prices are shown together.",
  canonicalPath: routes.priceDrops,
};

export function listBodyBrowseSlugs(): string[] {
  return BODY_TYPES.map((body) => body.toLowerCase());
}

export function listFuelBrowseSlugs(): string[] {
  return FUEL_TYPES.map((fuel) => fuel.toLowerCase());
}

export function isMonthlyBudgetBand(value: string): value is MonthlyBudgetBand {
  return (MONTHLY_BUDGET_BANDS as readonly string[]).includes(value);
}

export function isCashBudgetBand(value: string): value is CashBudgetBand {
  return (CASH_BUDGET_BANDS as readonly string[]).includes(value);
}

export function vehiclePriceDropAmount(vehicle: {
  cashPrice: number;
  previousPrice?: number;
}): number {
  if (
    vehicle.previousPrice === undefined ||
    vehicle.previousPrice <= vehicle.cashPrice
  ) {
    return 0;
  }
  return vehicle.previousPrice - vehicle.cashPrice;
}

export function hasVehiclePriceDrop(vehicle: {
  cashPrice: number;
  previousPrice?: number;
}): boolean {
  return vehiclePriceDropAmount(vehicle) > 0;
}