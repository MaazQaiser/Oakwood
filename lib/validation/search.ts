export const SEARCH_SORTS = [
  "recommended",
  "monthly_asc",
  "monthly_desc",
  "price_asc",
  "price_desc",
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
  error?: string;
}

export interface LockedFilters {
  make?: string;
  model?: string;
  location?: string;
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

export function applyLockedFilters(
  query: SearchQuery,
  locked: LockedFilters,
): SearchQuery {
  return {
    ...query,
    ...(locked.make ? { make: locked.make } : {}),
    ...(locked.model ? { model: locked.model } : {}),
    ...(locked.location ? { location: locked.location } : {}),
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
