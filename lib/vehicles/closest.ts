import { formatPounds } from "@/lib/format/money";
import {
  getSearchSort,
  type LockedFilters,
  type SearchQuery,
} from "@/lib/validation/search";
import {
  getLocationName,
  getMakeName,
  getModelName,
} from "@/lib/vehicles/labels";
import { interpretNaturalLanguage } from "@/lib/vehicles/natural-language";
import { filterVehicles, sortVehicles } from "@/lib/vehicles/search";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export type RelaxAction = "removed" | "widened";

export interface RelaxedConstraint {
  id: string;
  keys: Array<keyof SearchQuery>;
  label: string;
  action: RelaxAction;
  widenedTo?: string;
}

export interface ClosestSearchResult {
  exact: Vehicle[];
  closest: Vehicle[];
  relaxedQuery: SearchQuery;
  constraints: RelaxedConstraint[];
}

interface RelaxStep {
  id: string;
  keys: Array<keyof SearchQuery>;
  family?: "budget";
  label: (query: SearchQuery, category: VehicleCategory) => string;
  apply: (query: SearchQuery) => SearchQuery;
  action: RelaxAction;
  widenedTo?: (query: SearchQuery) => string | undefined;
}

interface FilterOptions {
  maxAdvance?: number;
  deposit?: number;
}

function cloneQuery(query: SearchQuery): SearchQuery {
  return { ...query };
}

function omitKeys(query: SearchQuery, keys: Array<keyof SearchQuery>): SearchQuery {
  const next = cloneQuery(query);
  keys.forEach((key) => {
    delete next[key];
  });
  return next;
}

function toAmount(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function roundPrice(value: number): number {
  return Math.round(value / 500) * 500;
}

function hasValue(query: SearchQuery, keys: Array<keyof SearchQuery>): boolean {
  return keys.some((key) => Boolean(query[key]));
}

function hasIntentAnchor(query: SearchQuery): boolean {
  return Boolean(query.make || query.model || query.body_style || query.need);
}

function colourLabel(query: SearchQuery): string {
  return query.colour?.split(",")[0]?.trim() || "colour";
}

function budgetLabel(query: SearchQuery): string {
  const monthly = toAmount(query.monthly_max ?? query.monthly);
  if (monthly !== undefined) {
    return `the exact ${formatPounds(monthly)} a month budget`;
  }
  const price = toAmount(query.max_price);
  if (price !== undefined) {
    return `the exact ${formatPounds(price)} budget`;
  }
  return "the exact budget";
}

function widenBudget(
  query: SearchQuery,
  priceFactor: number,
  monthlyBump: number,
): SearchQuery {
  const next = cloneQuery(query);
  const price = toAmount(next.max_price);
  if (price !== undefined) {
    next.max_price = String(Math.max(price + 500, roundPrice(price * priceFactor)));
  }
  const monthly = toAmount(next.monthly_max ?? next.monthly);
  if (monthly !== undefined) {
    next.monthly_max = String(monthly + monthlyBump);
    delete next.monthly;
  }
  return next;
}

function budgetWidenedTo(query: SearchQuery, relaxed: SearchQuery): string | undefined {
  const monthly = toAmount(relaxed.monthly_max ?? relaxed.monthly);
  const originalMonthly = toAmount(query.monthly_max ?? query.monthly);
  if (monthly !== undefined && monthly !== originalMonthly) {
    return `${formatPounds(monthly)} a month`;
  }
  const price = toAmount(relaxed.max_price);
  const originalPrice = toAmount(query.max_price);
  if (price !== undefined && price !== originalPrice) {
    return formatPounds(price);
  }
  return undefined;
}

function buildSteps(
  query: SearchQuery,
  locked: LockedFilters,
): RelaxStep[] {
  const steps: RelaxStep[] = [
    {
      id: "colour",
      keys: ["colour"],
      label: colourLabel,
      apply: (current) => omitKeys(current, ["colour"]),
      action: "removed",
    },
    {
      id: "doors",
      keys: ["doors"],
      label: () => `${query.doors} doors`,
      apply: (current) => omitKeys(current, ["doors"]),
      action: "removed",
    },
    {
      id: "seats",
      keys: ["seats"],
      label: () => `${query.seats} seats`,
      apply: (current) => omitKeys(current, ["seats"]),
      action: "removed",
    },
    {
      id: "need",
      keys: ["need"],
      label: () => query.need?.replace("-", " ") || "need",
      apply: (current) => omitKeys(current, ["need"]),
      action: "removed",
    },
    {
      id: "year",
      keys: ["min_year", "max_year"],
      label: () => "the age filter",
      apply: (current) => omitKeys(current, ["min_year", "max_year"]),
      action: "removed",
    },
    {
      id: "mileage",
      keys: ["min_mileage", "max_mileage"],
      label: () => "the mileage filter",
      apply: (current) => omitKeys(current, ["min_mileage", "max_mileage"]),
      action: "removed",
    },
  ];

  if (!locked.location) {
    steps.push({
      id: "location",
      keys: ["location"],
      label: () => getLocationName(query.location) ?? "location",
      apply: (current) => omitKeys(current, ["location"]),
      action: "removed",
    });
  }

  steps.push(
    {
      id: "budget-widen-20",
      keys: ["max_price", "monthly_max", "monthly"],
      family: "budget",
      label: budgetLabel,
      apply: (current) => widenBudget(current, 1.2, 50),
      action: "widened",
      widenedTo: (original) =>
        budgetWidenedTo(original, widenBudget(original, 1.2, 50)),
    },
    {
      id: "fuel",
      keys: ["fuel"],
      label: () => query.fuel?.split(",")[0]?.trim() || "fuel type",
      apply: (current) => omitKeys(current, ["fuel"]),
      action: "removed",
    },
    {
      id: "transmission",
      keys: ["transmission"],
      label: () =>
        query.transmission?.split(",")[0]?.trim() || "transmission",
      apply: (current) => omitKeys(current, ["transmission"]),
      action: "removed",
    },
    {
      id: "body",
      keys: ["body_style"],
      label: () => query.body_style?.split(",")[0]?.trim() || "body type",
      apply: (current) => omitKeys(current, ["body_style"]),
      action: "removed",
    },
    {
      id: "budget-widen-50",
      keys: ["max_price", "monthly_max", "monthly"],
      family: "budget",
      label: budgetLabel,
      apply: (current) => widenBudget(current, 1.5, 100),
      action: "widened",
      widenedTo: (original) =>
        budgetWidenedTo(original, widenBudget(original, 1.5, 100)),
    },
    {
      id: "budget-remove",
      keys: ["max_price", "min_price", "monthly_max", "monthly", "monthly_min"],
      family: "budget",
      label: budgetLabel,
      apply: (current) =>
        omitKeys(current, [
          "max_price",
          "min_price",
          "monthly_max",
          "monthly",
          "monthly_min",
        ]),
      action: "removed",
    },
    {
      id: "affordable",
      keys: ["affordable"],
      label: () => "Affordable to me",
      apply: (current) => omitKeys(current, ["affordable"]),
      action: "removed",
    },
  );

  if (!locked.model) {
    steps.push({
      id: "model",
      keys: ["model"],
      label: (current, category) =>
        getModelName(current.make, query.model, category) ?? "model",
      apply: (current) => omitKeys(current, ["model"]),
      action: "removed",
    });
  }

  if (!locked.make) {
    steps.push({
      id: "make",
      keys: ["make"],
      label: (current, category) => getMakeName(query.make, category) ?? "make",
      apply: (current) => omitKeys(current, ["make"]),
      action: "removed",
    });
  }

  return steps.filter((step) => {
    if (!hasValue(query, step.keys)) {
      return false;
    }
    if (step.action === "widened") {
      const next = step.apply(query);
      return (
        next.max_price !== query.max_price ||
        next.monthly_max !== query.monthly_max ||
        next.monthly !== query.monthly
      );
    }
    return true;
  });
}

function combinations<T>(items: T[], size: number): T[][] {
  const results: T[][] = [];

  function walk(start: number, chosen: T[]) {
    if (chosen.length === size) {
      results.push([...chosen]);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      chosen.push(items[index]);
      walk(index + 1, chosen);
      chosen.pop();
    }
  }

  walk(0, []);
  return results;
}

function applySteps(query: SearchQuery, steps: RelaxStep[]): SearchQuery {
  const budgetSteps = steps.filter((step) => step.family === "budget");
  const otherSteps = steps.filter((step) => step.family !== "budget");
  const selected =
    budgetSteps.length > 1
      ? [...otherSteps, budgetSteps[budgetSteps.length - 1]]
      : steps;

  return selected.reduce((current, step) => step.apply(current), cloneQuery(query));
}

function toConstraint(
  step: RelaxStep,
  query: SearchQuery,
  category: VehicleCategory,
): RelaxedConstraint {
  return {
    id: step.id,
    keys: step.keys,
    label: step.label(query, category),
    action: step.action,
    widenedTo: step.widenedTo?.(query),
  };
}

export function unmatchedRemainderFrom(
  query: SearchQuery,
  catalog: Vehicle[],
): string {
  if (!query.q || query.make || query.model) {
    return "";
  }
  return interpretNaturalLanguage(query.q, catalog).remainder;
}

export function applyUnmatchedRemainder(
  vehicles: Vehicle[],
  remainder: string,
): Vehicle[] {
  if (!remainder.trim()) {
    return vehicles;
  }

  const tokens = remainder
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return vehicles;
  }

  return vehicles.filter((vehicle) => {
    const hay = [
      vehicle.make,
      vehicle.model,
      vehicle.derivative,
      vehicle.colour,
      String(vehicle.year),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return tokens.every((token) => hay.includes(token));
  });
}

function matchVehicles(
  catalog: Vehicle[],
  query: SearchQuery,
  filterOptions?: FilterOptions,
  sortOptions?: FilterOptions & { preferAffordable?: boolean },
): Vehicle[] {
  const remainder = unmatchedRemainderFrom(query, catalog);
  return sortVehicles(
    applyUnmatchedRemainder(
      filterVehicles(catalog, query, filterOptions),
      remainder,
    ),
    getSearchSort(query),
    sortOptions,
  );
}

export function getClosestSearchResults(
  query: SearchQuery,
  catalog: Vehicle[],
  options?: FilterOptions & {
    locked?: LockedFilters;
    category?: VehicleCategory;
    preferAffordable?: boolean;
  },
): ClosestSearchResult {
  const locked = options?.locked ?? {};
  const category = options?.category ?? "car";
  const filterOptions = {
    maxAdvance: options?.maxAdvance,
    deposit: options?.deposit,
  };
  const sortOptions = {
    preferAffordable: options?.preferAffordable,
    maxAdvance: options?.maxAdvance,
    deposit: options?.deposit,
  };
  const exact = matchVehicles(catalog, query, filterOptions, sortOptions);
  const empty: ClosestSearchResult = {
    exact,
    closest: [],
    relaxedQuery: query,
    constraints: [],
  };

  if (exact.length > 0) {
    return empty;
  }

  const steps = buildSteps(query, locked);
  const anchored = hasIntentAnchor(query);

  for (let size = 1; size <= steps.length; size += 1) {
    for (const combo of combinations(steps, size)) {
      const budgetCount = combo.filter((step) => step.family === "budget").length;
      if (budgetCount > 1) {
        continue;
      }

      const relaxedQuery = applySteps(query, combo);
      if (anchored && !hasIntentAnchor(relaxedQuery)) {
        continue;
      }

      const closest = matchVehicles(
        catalog,
        relaxedQuery,
        filterOptions,
        sortOptions,
      );
      if (closest.length === 0) {
        continue;
      }

      const applied =
        budgetCount > 1
          ? combo.filter((step) => step.family !== "budget").concat(combo.filter((step) => step.family === "budget").slice(-1))
          : combo;

      return {
        exact,
        closest,
        relaxedQuery,
        constraints: applied.map((step) => toConstraint(step, query, category)),
      };
    }
  }

  return empty;
}

function articleFor(name: string): "a" | "an" {
  return /^[aeiou]/i.test(name) ? "an" : "a";
}

export function describeUnmatchedSearch(
  query: SearchQuery,
  category: VehicleCategory = "car",
  unmatchedRemainder?: string,
): string {
  const make = getMakeName(query.make, category);
  const model = getModelName(query.make, query.model, category);
  const noun = category === "van" ? "van" : "car";
  const colour = query.colour?.split(",")[0]?.trim().toLowerCase();
  const remainder = unmatchedRemainder?.trim();

  if (!make && !model && remainder) {
    const coloured = colour ? `${colour} ${remainder}` : remainder;
    return `We couldn't find ${articleFor(coloured)} ${coloured}.`;
  }

  const subject = make && model ? `${make} ${model}` : make ? make : query.body_style || noun;
  const fuel = query.fuel?.split(",")[0]?.trim().toLowerCase();
  const transmission = query.transmission?.split(",")[0]?.trim().toLowerCase();
  const specs = [fuel, transmission].filter(Boolean).join(", ");
  const monthly = toAmount(query.monthly_max ?? query.monthly);
  const price = toAmount(query.max_price);
  const budget =
    monthly !== undefined
      ? `under ${formatPounds(monthly)} a month`
      : price !== undefined
        ? `under ${formatPounds(price)}`
        : undefined;
  const location = query.location
    ? `in ${getLocationName(query.location) ?? query.location}`
    : undefined;

  const prefix = `We couldn't find ${articleFor(subject)} ${subject}`;
  const colourBit = colour ? ` in ${colour}` : "";
  const specBit = specs ? `, ${specs}` : "";
  const budgetBit = budget ? ` ${budget}` : "";
  const locationBit = location ? ` ${location}` : "";

  if (!colourBit && !specBit && !budgetBit && !locationBit) {
    return `${prefix}.`;
  }
  return `${prefix}${colourBit}${specBit}${budgetBit}${locationBit}.`;
}

export function describeClosestMatches(
  query: SearchQuery,
  category: VehicleCategory = "car",
): string {
  const make = getMakeName(query.make, category);
  const model = getModelName(query.make, query.model, category);
  const noun = category === "van" ? "van" : "car";

  if (make && model) {
    return `Here are the closest ${make} ${model} matches.`;
  }
  if (make) {
    return `Here are the closest ${make} matches.`;
  }
  if (query.body_style) {
    return `Here are the closest ${query.body_style} matches.`;
  }
  return `Here are the closest ${noun} matches.`;
}

export function describeRelaxation(constraints: RelaxedConstraint[]): string {
  if (constraints.length === 0) {
    return "We adjusted the search to show you the closest matches.";
  }

  const parts = constraints.map((constraint) => {
    if (constraint.action === "widened" && constraint.widenedTo) {
      return `widened ${constraint.label} to ${constraint.widenedTo}`;
    }
    if (constraint.action === "widened") {
      return `widened ${constraint.label}`;
    }
    return constraint.label;
  });

  const removed = constraints.filter((constraint) => constraint.action === "removed");
  const widened = constraints.filter((constraint) => constraint.action === "widened");

  if (removed.length > 0 && widened.length > 0) {
    const removedText = joinList(removed.map((item) => item.label));
    const widenedText = joinList(
      widened.map((item) =>
        item.widenedTo
          ? `${item.label} to ${item.widenedTo}`
          : item.label,
      ),
    );
    return `We removed ${removedText} and widened ${widenedText} to show you the closest matches.`;
  }

  if (widened.length > 0) {
    return `We ${joinList(parts)} to show you the closest matches.`;
  }

  return `We removed ${joinList(parts)} to show you the closest matches.`;
}

export function describeShowingWithout(constraints: RelaxedConstraint[]): string {
  if (constraints.length === 0) {
    return "Showing closest matches.";
  }
  return `Showing closest matches without ${joinList(constraints.map((item) => item.label))}.`;
}

function joinList(items: string[]): string {
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function relaxedKeysFrom(
  constraints: RelaxedConstraint[],
): Array<keyof SearchQuery> {
  return Array.from(new Set(constraints.flatMap((constraint) => constraint.keys)));
}
