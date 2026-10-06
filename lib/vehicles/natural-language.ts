import { formatPounds } from "@/lib/format/money";
import type { SearchQuery } from "@/lib/validation/search";
import { listVehicles } from "@/lib/vehicles/query";
import type { Vehicle } from "@/types/vehicle";

const BODY_TYPES = [
  "Hatchback",
  "SUV",
  "Saloon",
  "Estate",
  "Coupe",
  "MPV",
  "Convertible",
] as const;

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
const TRANSMISSIONS = ["Automatic", "Manual"] as const;

export interface NaturalLanguageTerm {
  id: string;
  key: keyof SearchQuery;
  label: string;
  value: string;
  matched: string;
  start: number;
  end: number;
}

export interface NaturalLanguageResult {
  query: Partial<SearchQuery>;
  terms: NaturalLanguageTerm[];
  remainder: string;
}

interface Span {
  start: number;
  end: number;
}

const STOP_WORDS = new Set([
  "try",
  "a",
  "an",
  "the",
  "with",
  "and",
  "or",
  "for",
  "me",
  "my",
  "i",
  "want",
  "looking",
  "car",
  "cars",
  "please",
  "in",
]);

const TRANSMISSION_ALIASES: Array<{ phrase: string; value: string }> = [
  { phrase: "automatic", value: "Automatic" },
  { phrase: "manual", value: "Manual" },
  { phrase: "auto", value: "Automatic" },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phrasePattern(phrase: string): string {
  return escapeRegex(phrase.trim()).replace(/[-\s]+/g, "[-\\s]+");
}

function overlaps(spans: Span[], start: number, end: number): boolean {
  return spans.some((span) => start < span.end && end > span.start);
}

function findPhrase(
  lower: string,
  phrase: string,
  spans: Span[],
): Span & { matched: string } | null {
  if (!phrase.trim()) {
    return null;
  }

  const pattern = new RegExp(`\\b${phrasePattern(phrase)}\\b`, "gi");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(lower)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (!overlaps(spans, start, end)) {
      return { start, end, matched: match[0] };
    }
  }

  return null;
}

function uniqueByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function catalogMakes(catalog: Vehicle[]) {
  return uniqueByName(
    Array.from(
      new Map(
        catalog.map((vehicle) => [vehicle.makeSlug, { slug: vehicle.makeSlug, name: vehicle.make }]),
      ).values(),
    ),
  ).sort((a, b) => b.name.length - a.name.length);
}

function catalogModels(catalog: Vehicle[], makeSlug?: string) {
  return uniqueByName(
    catalog
      .filter((vehicle) => !makeSlug || vehicle.makeSlug === makeSlug)
      .map((vehicle) => ({ slug: vehicle.modelSlug, name: vehicle.model })),
  ).sort((a, b) => b.name.length - a.name.length);
}

function catalogColours(catalog: Vehicle[]) {
  return Array.from(new Set(catalog.map((vehicle) => vehicle.colour))).sort(
    (a, b) => b.length - a.length,
  );
}

function catalogLocations(catalog: Vehicle[]) {
  return Array.from(
    new Map(
      catalog.map((vehicle) => [
        vehicle.locationSlug,
        { slug: vehicle.locationSlug, name: vehicle.locationName },
      ]),
    ).values(),
  ).sort((a, b) => b.name.length - a.name.length);
}

function addTerm(
  terms: NaturalLanguageTerm[],
  spans: Span[],
  query: Partial<SearchQuery>,
  term: Omit<NaturalLanguageTerm, "id"> & { id?: string },
) {
  spans.push({ start: term.start, end: term.end });
  terms.push({
    id: term.id ?? `${term.key}-${term.start}`,
    key: term.key,
    label: term.label,
    value: term.value,
    matched: term.matched,
    start: term.start,
    end: term.end,
  });
  query[term.key] = term.value;
}

function matchBudget(lower: string, spans: Span[], original: string): NaturalLanguageTerm | null {
  const patterns: Array<{ regex: RegExp; forceMonthly?: boolean }> = [
    {
      regex:
        /(?:under|below|up to|less than)\s*£?\s*([\d,]+)\s*(k)?\s*(?:a\s*month|per\s*month|\/month|pcm|monthly)/gi,
      forceMonthly: true,
    },
    {
      regex: /(?:under|below|up to|less than)\s*£\s*([\d,]+)\s*(k)?/gi,
    },
    {
      regex: /(?:under|below|up to|less than)\s*([\d,]+)\s*(k)?/gi,
    },
  ];

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.regex.exec(lower)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (overlaps(spans, start, end)) {
        continue;
      }

      let amount = Number(match[1].replace(/,/g, ""));
      if (!Number.isFinite(amount) || amount <= 0) {
        continue;
      }
      if (match[2]) {
        amount *= 1000;
      }

      const monthly = Boolean(pattern.forceMonthly) || amount <= 1500;
      const key: keyof SearchQuery = monthly ? "monthly_max" : "max_price";
      const label = monthly
        ? `Under ${formatPounds(amount)} a month`
        : `Under ${formatPounds(amount)}`;

      return {
        id: key,
        key,
        label,
        value: String(amount),
        matched: original.slice(start, end),
        start,
        end,
      };
    }
  }

  return null;
}

function remainderFrom(original: string, spans: Span[]): string {
  const sorted = [...spans].sort((a, b) => b.start - a.start);
  let next = original;
  for (const span of sorted) {
    next = `${next.slice(0, span.start)} ${next.slice(span.end)}`;
  }

  return next
    .replace(/[£,]/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part && !STOP_WORDS.has(part.toLowerCase()))
    .join(" ")
    .trim();
}

export function interpretNaturalLanguage(
  q: string,
  catalog: Vehicle[] = listVehicles("car"),
): NaturalLanguageResult {
  const original = q.trim();
  const terms: NaturalLanguageTerm[] = [];
  const spans: Span[] = [];
  const query: Partial<SearchQuery> = {};

  if (!original) {
    return { query, terms, remainder: "" };
  }

  const lower = original.toLowerCase();

  const budget = matchBudget(lower, spans, original);
  if (budget) {
    addTerm(terms, spans, query, budget);
  }

  for (const make of catalogMakes(catalog)) {
    const phrases = [make.name, make.slug.replace(/-/g, " ")];
    if (make.name.includes("-")) {
      const first = make.name.split(/[-\s]/)[0];
      if (first.length >= 5) {
        phrases.push(first);
      }
    }

    const found = phrases
      .map((phrase) => findPhrase(lower, phrase, spans))
      .find(Boolean);

    if (found) {
      addTerm(terms, spans, query, {
        key: "make",
        label: make.name,
        value: make.slug,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  for (const model of catalogModels(catalog, query.make)) {
    const found = findPhrase(lower, model.name, spans);
    if (found) {
      addTerm(terms, spans, query, {
        key: "model",
        label: model.name,
        value: model.slug,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  for (const colour of catalogColours(catalog)) {
    const found = findPhrase(lower, colour, spans);
    if (found) {
      addTerm(terms, spans, query, {
        key: "colour",
        label: colour,
        value: colour,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  for (const alias of [...TRANSMISSION_ALIASES].sort(
    (a, b) => b.phrase.length - a.phrase.length,
  )) {
    const found = findPhrase(lower, alias.phrase, spans);
    if (found) {
      addTerm(terms, spans, query, {
        key: "transmission",
        label: alias.value,
        value: alias.value,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  for (const fuel of [...FUEL_TYPES].sort((a, b) => b.length - a.length)) {
    const found = findPhrase(lower, fuel, spans);
    if (found) {
      addTerm(terms, spans, query, {
        key: "fuel",
        label: fuel,
        value: fuel,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  const bodies = Array.from(
    new Set([...catalog.map((vehicle) => vehicle.bodyStyle), ...BODY_TYPES]),
  ).sort((a, b) => b.length - a.length);

  for (const body of bodies) {
    const found =
      findPhrase(lower, body, spans) ??
      findPhrase(lower, `${body}s`, spans);
    if (found) {
      addTerm(terms, spans, query, {
        key: "body_style",
        label: body,
        value: body,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  const family = findPhrase(lower, "family", spans);
  if (family) {
    addTerm(terms, spans, query, {
      key: "need",
      label: "Family",
      value: "family",
      matched: original.slice(family.start, family.end),
      start: family.start,
      end: family.end,
    });
  }

  for (const location of catalogLocations(catalog)) {
    const found =
      findPhrase(lower, location.name, spans) ??
      findPhrase(lower, location.slug.replace(/-/g, " "), spans);
    if (found) {
      addTerm(terms, spans, query, {
        key: "location",
        label: location.name,
        value: location.slug,
        matched: original.slice(found.start, found.end),
        start: found.start,
        end: found.end,
      });
      break;
    }
  }

  terms.sort((a, b) => a.start - b.start);

  return {
    query,
    terms,
    remainder: remainderFrom(original, spans),
  };
}

export function suggestNaturalLanguage(
  q: string,
  catalog: Vehicle[] = listVehicles("car"),
  limit = 3,
): Array<{ label: string; completion: string }> {
  const trailing = q.match(/(\S+)$/);
  if (!trailing) {
    return [];
  }

  const prefix = trailing[1].toLowerCase();
  if (prefix.length < 2) {
    return [];
  }

  const interpreted = interpretNaturalLanguage(q, catalog);
  if (
    interpreted.terms.some(
      (term) => term.end === q.trim().length && term.matched.toLowerCase() === prefix,
    )
  ) {
    return [];
  }

  const taken = new Set(interpreted.terms.map((term) => term.label.toLowerCase()));
  const candidates: Array<{ label: string; completion: string; rank: number }> = [];

  function consider(label: string, rank: number) {
    const lower = label.toLowerCase();
    if (taken.has(lower) || !lower.startsWith(prefix) || lower === prefix) {
      return;
    }
    candidates.push({ label, completion: label, rank });
  }

  catalogMakes(catalog).forEach((make) => {
    if (interpreted.query.make && interpreted.query.make !== make.slug) {
      return;
    }
    consider(make.name, make.name.length);
  });
  catalogModels(catalog, interpreted.query.make).forEach((model) =>
    consider(model.name, model.name.length + 8),
  );
  catalogColours(catalog).forEach((colour) => consider(colour, colour.length + 4));
  FUEL_TYPES.forEach((fuel) => consider(fuel, fuel.length + 6));
  TRANSMISSIONS.forEach((item) => consider(item, item.length + 6));
  BODY_TYPES.forEach((body) => consider(body, body.length + 4));

  return candidates
    .sort((a, b) => b.rank - a.rank || a.label.localeCompare(b.label))
    .filter(
      (item, index, list) =>
        list.findIndex((entry) => entry.label.toLowerCase() === item.label.toLowerCase()) ===
        index,
    )
    .slice(0, limit)
    .map(({ label, completion }) => ({ label, completion }));
}

export function removeNaturalLanguageTerm(q: string, term: NaturalLanguageTerm): string {
  const trimmed = q.trim();
  const before = trimmed.slice(0, term.start);
  const after = trimmed.slice(term.end);
  return `${before} ${after}`.replace(/\s+/g, " ").trim();
}

export function applyNaturalLanguageSuggestion(
  q: string,
  completion: string,
): string {
  if (!q.trim()) {
    return completion;
  }

  if (/\s$/.test(q)) {
    return `${q}${completion}`;
  }

  return q.replace(/\S+$/, completion);
}
