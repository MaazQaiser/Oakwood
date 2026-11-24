const ALIAS: Record<string, string> = {
  vw: "volkswagen",
  merc: "mercedes",
  mercs: "mercedes",
  beemer: "bmw",
  bimmer: "bmw",
  bm: "bmw",
  hatch: "hatchback",
  "4x4": "suv",
  crossover: "suv",
};

const BODYW: Record<string, string> = {
  suv: "SUV",
  "4x4": "SUV",
  crossover: "SUV",
  hatchback: "Hatchback",
  hatch: "Hatchback",
  estate: "Estate",
  saloon: "Saloon",
  sedan: "Saloon",
};

const TRANSW: Record<string, string> = {
  automatic: "Automatic",
  auto: "Automatic",
  autos: "Automatic",
  manual: "Manual",
  manuals: "Manual",
  stick: "Manual",
};

const FUELW: Record<string, string> = {
  electric: "Electric",
  ev: "Electric",
  evs: "Electric",
  petrol: "Petrol",
  petrols: "Petrol",
  diesel: "Diesel",
  diesels: "Diesel",
  hybrid: "Hybrid",
  hybrids: "Hybrid",
};

export interface ParsedQuery {
  budget: number | null;
  deposit: number | null;
  transmission: string;
  body: string;
  fuel: string;
  tokens: string[];
}

/**
 * Reads a plain English query and pulls out the hard filters, leaving the rest
 * as tokens that must each match the car somewhere.
 */
export function parseQuery(raw: string): ParsedQuery {
  const found: ParsedQuery = {
    budget: null,
    deposit: null,
    transmission: "",
    body: "",
    fuel: "",
    tokens: [],
  };

  let s = ` ${raw.toLowerCase().replace(/[,]/g, " ").replace(/\s+/g, " ")} `;

  const budgetMatch = s.match(
    /(?:under|below|max|upto|up to)?\s*£?\s*(\d{2,4})\s*(?:a month|pm|per month|p\/m|\/m|month|monthly|mth)/,
  );
  if (budgetMatch) {
    found.budget = Number(budgetMatch[1]);
    s = s.replace(budgetMatch[0], " ");
  }

  const depositMatch =
    s.match(/£?\s*(\d{1,3})\s*k\s*(?:deposit|down)/) ||
    s.match(/£?\s*(\d{3,6})\s*(?:deposit|down)/);
  if (depositMatch) {
    found.deposit =
      depositMatch[0].indexOf("k") > -1
        ? Number(depositMatch[1]) * 1000
        : Number(depositMatch[1]);
    s = s.replace(depositMatch[0], " ");
  }

  for (const word of s.trim().split(" ").filter(Boolean)) {
    const w = word.replace(/^£/, "");
    if (TRANSW[w] && !found.transmission) {
      found.transmission = TRANSW[w];
      continue;
    }
    if (BODYW[w] && !found.body) {
      found.body = BODYW[w];
      continue;
    }
    if (FUELW[w] && !found.fuel) {
      found.fuel = FUELW[w];
      continue;
    }
    found.tokens.push(ALIAS[w] || w);
  }

  return found;
}
