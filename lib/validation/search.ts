export const SEARCH_SORTS = [
  "recommended",
  "monthly_asc",
  "monthly_desc",
  "price_asc",
  "price_desc",
  "price_drop",
  "mileage",
  "newest",
  "recent",
] as const;

export type SearchSort = (typeof SEARCH_SORTS)[number];

export interface SearchQuery {
  q?: string;
  body_style?: string;
  make?: string;
  model?: string;
  fuel?: string;
  transmission?: string;
  location?: string;
  colour?: string;
  doors?: string;
  seats?: string;
  min_price?: string;
  max_price?: string;
  monthly?: string;
  monthly_min?: string;
  monthly_max?: string;
  min_mileage?: string;
  max_mileage?: string;
  min_year?: string;
  max_year?: string;
  deposit?: string;
  term?: string;
  affordable?: string;
  sort?: string;
  page?: string;
  need?: string;
  price_drops?: string;
  min_range?: string;
  max_charge?: string;
  road_tax?: string;
  error?: string;
}

export interface LockedFilters {
  make?: string;
  model?: string;
  location?: string;
  fuel?: string;
  body_style?: string;
  transmission?: string;
  /** Always applied segment filters (monthly/cash bands, price drops). */
  lockedQuery?: Partial<SearchQuery>;
  browse?: {
    title: string;
    description?: string;
    breadcrumbLabel: string;
  };
}

const SEARCH_KEYS: Array<keyof SearchQuery> = [
  "q",
  "body_style",
  "make",
  "model",
  "fuel",
  "transmission",
  "location",
  "colour",
  "doors",
  "seats",
  "min_price",
  "max_price",
  "monthly",
  "monthly_min",
  "monthly_max",
  "min_mileage",
  "max_mileage",
  "min_year",
  "max_year",
  "deposit",
  "term",
  "affordable",
  "sort",
  "page",
  "need",
  "price_drops",
  "min_range",
  "max_charge",
  "road_tax",
  "error",
];

export function parseSearchQuery(
  searchParams: Record<string, string | string[] | undefined>,
): SearchQuery {
  const read = (key: string): string | undefined => {
    const value = searchParams[key];

    if (Array.isArray(value)) {
      return value.filter(Boolean).join(",") || undefined;
    }

    return value || undefined;
  };

  const query: SearchQuery = {};

  SEARCH_KEYS.forEach((key) => {
    const value = read(key);
    if (value) {
      query[key] = value;
    }
  });

  return query;
}

export function splitFilterValues(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isSearchSort(value?: string): value is SearchSort {
  return SEARCH_SORTS.includes(value as SearchSort);
}

export function getSearchSort(query: SearchQuery): SearchSort {
  return isSearchSort(query.sort) ? query.sort : "recommended";
}

export function mergeSearchQuery(
  base: SearchQuery,
  patch: Partial<SearchQuery>,
): SearchQuery {
  const next: SearchQuery = { ...base };

  Object.entries(patch).forEach(([key, value]) => {
    const field = key as keyof SearchQuery;
    if (value === undefined || value === "") {
      delete next[field];
      return;
    }
    next[field] = value;
  });

  if (patch.make !== undefined && patch.make !== base.make) {
    delete next.model;
  }

  if (next.page === "1") {
    delete next.page;
  }

  if (next.sort === "recommended") {
    delete next.sort;
  }

  return next;
}

const LOCKED_QUERY_KEYS = new Set<keyof SearchQuery>([
  "monthly_min",
  "monthly_max",
  "monthly",
  "min_price",
  "max_price",
  "price_drops",
  "body_style",
  "transmission",
  "fuel",
]);

export function isLockedSearchKey(
  key: keyof SearchQuery,
  locked: LockedFilters = {},
): boolean {
  if (key === "make" && locked.make) {
    return true;
  }
  if (key === "model" && locked.model) {
    return true;
  }
  if (key === "location" && locked.location) {
    return true;
  }
  if (key === "fuel" && locked.fuel) {
    return true;
  }
  if (key === "body_style" && locked.body_style) {
    return true;
  }
  if (key === "transmission" && locked.transmission) {
    return true;
  }
  if (!locked.lockedQuery) {
    return false;
  }
  return LOCKED_QUERY_KEYS.has(key) && locked.lockedQuery[key] !== undefined;
}

export function applyLockedFilters(
  query: SearchQuery,
  locked: LockedFilters,
): SearchQuery {
  return {
    ...query,
    ...(locked.lockedQuery ?? {}),
    ...(locked.make ? { make: locked.make } : {}),
    ...(locked.model ? { model: locked.model } : {}),
    ...(locked.location ? { location: locked.location } : {}),
    ...(locked.fuel ? { fuel: locked.fuel } : {}),
    ...(locked.body_style ? { body_style: locked.body_style } : {}),
    ...(locked.transmission ? { transmission: locked.transmission } : {}),
  };
}

export function buildSearchHref(
  basePath: string,
  query: SearchQuery,
  locked: LockedFilters = {},
): string {
  const params = new URLSearchParams();

  SEARCH_KEYS.forEach((key) => {
    if (key === "error") {
      return;
    }

    if (key === "make" && locked.make) {
      return;
    }
    if (key === "model" && locked.model) {
      return;
    }
    if (key === "location" && locked.location) {
      return;
    }
    if (key === "fuel" && locked.fuel) {
      return;
    }
    if (key === "body_style" && locked.body_style) {
      return;
    }
    if (key === "transmission" && locked.transmission) {
      return;
    }
    if (isLockedSearchKey(key, locked)) {
      return;
    }

    const value = query[key];
    if (!value) {
      return;
    }
    if (key === "page" && value === "1") {
      return;
    }
    if (key === "sort" && value === "recommended") {
      return;
    }

    params.set(key, value);
  });

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
