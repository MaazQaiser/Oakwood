import {
  applyLockedFilters,
  getSearchSort,
  splitFilterValues,
  type LockedFilters,
  type SearchQuery,
  type SearchSort,
} from "@/lib/validation/search";
import {
  getLocationName,
  getMakeName,
  getModelName,
} from "@/lib/vehicles/labels";
import { listVehicles } from "@/lib/vehicles/query";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export const SEARCH_PAGE_SIZE = 8;
export const FEW_RESULTS_THRESHOLD = 4;
export const CURRENT_YEAR = 2026;

export const BODY_TYPES = [
  "Hatchback",
  "SUV",
  "Saloon",
  "Estate",
  "Coupe",
  "MPV",
  "Convertible",
] as const;

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Automatic", "Manual"] as const;

export interface SearchResultSet {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface AlternativeSearch {
  label: string;
  href: string;
}

function matchesAny(value: string, selected: string[]): boolean {
  if (selected.length === 0) {
    return true;
  }

  const normalised = value.toLowerCase();
  return selected.some((item) => item.toLowerCase() === normalised);
}

function toNumber(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function matchesNeed(vehicle: Vehicle, need?: string): boolean {
  if (!need) {
    return true;
  }

  if (need === "small") {
    return vehicle.bodyStyle.toLowerCase() === "hatchback";
  }

  if (need === "family") {
    return (
      (vehicle.seats ?? 0) >= 5 &&
      ["suv", "estate", "mpv", "hatchback"].includes(
        vehicle.bodyStyle.toLowerCase(),
      )
    );
  }

  if (need === "hybrid-electric") {
    return ["hybrid", "electric"].includes(vehicle.fuelType.toLowerCase());
  }

  return true;
}

export function parseNaturalLanguage(
  q: string,
  catalog: Vehicle[] = listVehicles("car"),
): Partial<SearchQuery> {
  const text = q.toLowerCase();
  const result: Partial<SearchQuery> = { q };

  const makes = Array.from(
    new Map(catalog.map((vehicle) => [vehicle.makeSlug, vehicle.make])).entries(),
  ).sort((a, b) => b[1].length - a[1].length);

  for (const [slug, name] of makes) {
    if (
      text.includes(name.toLowerCase()) ||
      text.includes(slug.replace(/-/g, " "))
    ) {
      result.make = slug;
      break;
    }
  }

  const models = catalog
    .filter((vehicle) => !result.make || vehicle.makeSlug === result.make)
    .map((vehicle) => ({ slug: vehicle.modelSlug, name: vehicle.model }))
    .sort((a, b) => b.name.length - a.name.length);

  for (const model of models) {
    const needle = model.name.toLowerCase();
    if (needle.length > 1 && text.includes(needle)) {
      result.model = model.slug;
      break;
    }
  }

  const locations = Array.from(
    new Map(
      catalog.map((vehicle) => [vehicle.locationSlug, vehicle.locationName]),
    ).entries(),
  );

  for (const [slug, name] of locations) {
    if (text.includes(name.toLowerCase()) || text.includes(slug)) {
      result.location = slug;
      break;
    }
  }

  if (/\bautomatic\b/.test(text)) {
    result.transmission = "Automatic";
  } else if (/\bmanual\b/.test(text)) {
    result.transmission = "Manual";
  }

  if (/\belectric\b/.test(text)) {
    result.fuel = "Electric";
  } else if (/\bhybrid\b/.test(text)) {
    result.fuel = "Hybrid";
  } else if (/\bdiesel\b/.test(text)) {
    result.fuel = "Diesel";
  } else if (/\bpetrol\b/.test(text)) {
    result.fuel = "Petrol";
  }

  const catalogBodies = Array.from(
    new Set(catalog.map((vehicle) => vehicle.bodyStyle)),
  );
  const bodyMatch = [...catalogBodies, ...BODY_TYPES].find((body) =>
    text.includes(body.toLowerCase()),
  );
  if (bodyMatch) {
    result.body_style = bodyMatch;
  }

  const monthlyMatch = text.match(
    /(?:under|below|up to)\s*£?\s*([\d,]+)\s*(?:a\s*month|per\s*month|\/month|pcm|monthly)/i,
  );
  const priceMatch = text.match(/(?:under|below|up to)\s*£\s*([\d,]+)/i);

  if (monthlyMatch) {
    result.monthly_max = monthlyMatch[1].replace(/,/g, "");
  } else if (priceMatch) {
    const amount = Number(priceMatch[1].replace(/,/g, ""));
    if (amount <= 1500) {
      result.monthly_max = String(amount);
    } else {
      result.max_price = String(amount);
    }
  }

  if (/\bfamily\b/.test(text)) {
    result.need = "family";
  }

  return result;
}

export function resolveSearchQuery(
  query: SearchQuery,
  catalog: Vehicle[] = listVehicles("car"),
): SearchQuery {
  if (!query.q) {
    return query;
  }

  const parsed = parseNaturalLanguage(query.q, catalog);
  const next: SearchQuery = { ...parsed };

  (Object.keys(query) as Array<keyof SearchQuery>).forEach((key) => {
    const value = query[key];
    if (value) {
      next[key] = value;
    }
  });

  next.q = query.q;
  return next;
}

export function filterVehicles(
  vehicles: Vehicle[],
  query: SearchQuery,
  options?: { maxAdvance?: number; deposit?: number },
): Vehicle[] {
  const monthlyMax = toNumber(query.monthly_max ?? query.monthly);
  const monthlyMin = toNumber(query.monthly_min);
  const minPrice = toNumber(query.min_price);
  const maxPrice = toNumber(query.max_price);
  const minMileage = toNumber(query.min_mileage);
  const maxMileage = toNumber(query.max_mileage);
  const minYear = toNumber(query.min_year);
  const maxYear = toNumber(query.max_year);
  const doors = toNumber(query.doors);
  const seats = toNumber(query.seats);
  const fuels = splitFilterValues(query.fuel);
  const transmissions = splitFilterValues(query.transmission);
  const bodyStyles = splitFilterValues(query.body_style);
  const locations = splitFilterValues(query.location);
  const colours = splitFilterValues(query.colour);
  const affordable = query.affordable === "1";

  return vehicles.filter((vehicle) => {
    if (vehicle.availability === "sold" || vehicle.availability === "expired") {
      return false;
    }
    if (query.make && vehicle.makeSlug !== query.make.toLowerCase()) {
      return false;
    }
    if (query.model && vehicle.modelSlug !== query.model.toLowerCase()) {
      return false;
    }
    if (!matchesAny(vehicle.fuelType, fuels)) {
      return false;
    }
    if (!matchesAny(vehicle.transmission, transmissions)) {
      return false;
    }
    if (!matchesAny(vehicle.bodyStyle, bodyStyles)) {
      return false;
    }
    if (!matchesAny(vehicle.locationSlug, locations) && !matchesAny(vehicle.locationName, locations)) {
      return false;
    }
    if (!matchesAny(vehicle.colour, colours)) {
      return false;
    }
    if (minPrice !== undefined && vehicle.cashPrice < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && vehicle.cashPrice > maxPrice) {
      return false;
    }
    if (monthlyMin !== undefined && vehicle.monthlyPayment < monthlyMin) {
      return false;
    }
    if (monthlyMax !== undefined && vehicle.monthlyPayment > monthlyMax) {
      return false;
    }
    if (minMileage !== undefined && vehicle.mileage < minMileage) {
      return false;
    }
    if (maxMileage !== undefined && vehicle.mileage > maxMileage) {
      return false;
    }
    if (minYear !== undefined && vehicle.year < minYear) {
      return false;
    }
    if (maxYear !== undefined && vehicle.year > maxYear) {
      return false;
    }
    if (doors !== undefined && vehicle.doors !== doors) {
      return false;
    }
    if (seats !== undefined && vehicle.seats !== seats) {
      return false;
    }
    if (!matchesNeed(vehicle, query.need)) {
      return false;
    }
    if (
      affordable &&
      options?.maxAdvance !== undefined &&
      vehicle.cashPrice - (options.deposit ?? 0) > options.maxAdvance
    ) {
      return false;
    }
    return true;
  });
}

export function sortVehicles(
  vehicles: Vehicle[],
  sort: SearchSort,
  options?: { preferAffordable?: boolean; maxAdvance?: number; deposit?: number },
): Vehicle[] {
  const ranked = [...vehicles];

  ranked.sort((a, b) => {
    if (options?.preferAffordable && options.maxAdvance !== undefined) {
      const deposit = options.deposit ?? 0;
      const aOk = a.cashPrice - deposit <= options.maxAdvance ? 0 : 1;
      const bOk = b.cashPrice - deposit <= options.maxAdvance ? 0 : 1;
      if (aOk !== bOk) {
        return aOk - bOk;
      }
    }

    switch (sort) {
      case "monthly_asc":
        return a.monthlyPayment - b.monthlyPayment;
      case "monthly_desc":
        return b.monthlyPayment - a.monthlyPayment;
      case "price_asc":
        return a.cashPrice - b.cashPrice;
      case "price_desc":
        return b.cashPrice - a.cashPrice;
      case "mileage":
        return a.mileage - b.mileage;
      case "newest":
        return b.year - a.year || a.mileage - b.mileage;
      case "recent":
        return b.listedAt.localeCompare(a.listedAt);
      case "recommended":
      default:
        return a.monthlyPayment - b.monthlyPayment;
    }
  });

  return ranked;
}

export function searchCatalog(
  query: SearchQuery,
  locked: LockedFilters = {},
  options?: {
    category?: VehicleCategory;
    maxAdvance?: number;
    deposit?: number;
    preferAffordable?: boolean;
    pageSize?: number;
  },
): SearchResultSet {
  const category = options?.category ?? "car";
  const pageSize = options?.pageSize ?? SEARCH_PAGE_SIZE;
  const catalog = listVehicles(category);
  const resolved = resolveSearchQuery(
    applyLockedFilters(query, locked),
    catalog,
  );
  const sort = getSearchSort(resolved);
  const filtered = filterVehicles(catalog, resolved, {
    maxAdvance: options?.maxAdvance,
    deposit: options?.deposit,
  });
  const vehicles = sortVehicles(filtered, sort, {
    preferAffordable: options?.preferAffordable,
    maxAdvance: options?.maxAdvance,
    deposit: options?.deposit,
  });
  const page = Math.max(1, toNumber(resolved.page) ?? 1);
  const pageCount = Math.max(1, Math.ceil(vehicles.length / pageSize));
  const safePage = Math.min(page, pageCount);

  return {
    vehicles,
    total: vehicles.length,
    page: safePage,
    pageSize,
    pageCount,
  };
}

export function listMatchingVehicles(
  query: SearchQuery,
  locked: LockedFilters = {},
  options?: {
    category?: VehicleCategory;
    maxAdvance?: number;
    deposit?: number;
    preferAffordable?: boolean;
  },
): Vehicle[] {
  const catalog = listVehicles(options?.category ?? "car");
  const resolved = resolveSearchQuery(
    applyLockedFilters(query, locked),
    catalog,
  );
  return sortVehicles(
    filterVehicles(catalog, resolved, {
      maxAdvance: options?.maxAdvance,
      deposit: options?.deposit,
    }),
    getSearchSort(resolved),
    {
      preferAffordable: options?.preferAffordable,
      maxAdvance: options?.maxAdvance,
      deposit: options?.deposit,
    },
  );
}

export function describeSearch(
  query: SearchQuery,
  category: VehicleCategory = "car",
): string | undefined {
  const make = getMakeName(query.make, category);
  const model = getModelName(query.make, query.model, category);
  const monthlyMax = query.monthly_max ?? query.monthly;
  const parts: string[] = [];

  if (make && model) {
    parts.push(`${make} ${model}s`);
  } else if (make) {
    parts.push(`${make}s`);
  } else if (query.body_style) {
    parts.push(`${query.body_style}s`);
  } else {
    parts.push(category === "van" ? "vans" : "cars");
  }

  if (monthlyMax) {
    return `No ${parts[0]} under £${monthlyMax}/month`;
  }
  if (query.max_price) {
    return `No ${parts[0]} under £${query.max_price}`;
  }
  if (query.location) {
    return `No ${parts[0]} in ${getLocationName(query.location)}`;
  }
  return undefined;
}

export function getAlternativeSearches(
  query: SearchQuery,
  locked: LockedFilters = {},
  options?: { category?: VehicleCategory; basePath?: string },
): AlternativeSearch[] {
  const category = options?.category ?? "car";
  const catalog = listVehicles(category);
  const hubPath =
    options?.basePath?.split("/").slice(0, 2).join("/") ||
    (category === "van" ? "/used-vans" : "/used-cars");
  const searchPath = category === "van" ? hubPath : "/search";
  const resolved = resolveSearchQuery(
    applyLockedFilters(query, locked),
    catalog,
  );
  const make = getMakeName(resolved.make, category);
  const model = getModelName(resolved.make, resolved.model, category);
  const monthlyMax = toNumber(resolved.monthly_max ?? resolved.monthly);
  const alternatives: AlternativeSearch[] = [];

  if (resolved.make && resolved.model && monthlyMax) {
    alternatives.push({
      label: `${make} ${model} up to £${monthlyMax + 50}/month`,
      href: `${searchPath}?make=${resolved.make}&model=${resolved.model}&monthly_max=${monthlyMax + 50}`,
    });
  }

  if (resolved.make) {
    alternatives.push({
      label: `Similar ${make} models`,
      href:
        category === "van"
          ? `${hubPath}/${resolved.make}`
          : `${searchPath}?make=${resolved.make}`,
    });
  }

  if (resolved.body_style && monthlyMax) {
    alternatives.push({
      label: `Other ${resolved.body_style}s under £${monthlyMax}/month`,
      href: `${searchPath}?body_style=${encodeURIComponent(resolved.body_style)}&monthly_max=${monthlyMax}`,
    });
  } else if (resolved.body_style) {
    alternatives.push({
      label: `Other ${resolved.body_style}s`,
      href: `${searchPath}?body_style=${encodeURIComponent(resolved.body_style)}`,
    });
  }

  const location = locked.location ?? resolved.location;
  if (category === "van") {
    if (location) {
      alternatives.push({
        label: "Browse all vans",
        href: hubPath,
      });
    } else {
      alternatives.push({
        label: "Vans available at Bury and Chorley",
        href: hubPath,
      });
    }
  } else if (location) {
    alternatives.push({
      label: `Cars available near ${getLocationName(location)}`,
      href: `/used-cars/location/${location}`,
    });
  } else {
    alternatives.push({
      label: "Cars available near you",
      href: hubPath,
    });
  }

  return alternatives.slice(0, 4);
}

export function paginateVehicles(
  vehicles: Vehicle[],
  page = 1,
  pageSize = SEARCH_PAGE_SIZE,
): SearchResultSet {
  const pageCount = Math.max(1, Math.ceil(vehicles.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    vehicles: vehicles.slice(start, start + pageSize),
    total: vehicles.length,
    page: safePage,
    pageSize,
    pageCount,
  };
}
