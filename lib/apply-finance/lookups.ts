import { normalisePostcode } from "@/lib/apply-finance/validators";

export interface AddressHit {
  id: string;
  label: string;
}

const SAMPLE_ROADS = [
  "1 Oakwood Drive",
  "14 High Street",
  "22 Station Road",
  "8 Church Lane",
  "31 Park Avenue",
];

function townFromPostcode(postcode: string): string {
  const outward = postcode.split(" ")[0] ?? "";
  if (outward.startsWith("BL")) return "Bury";
  if (outward.startsWith("M")) return "Manchester";
  if (outward.startsWith("B")) return "Birmingham";
  if (outward.startsWith("L")) return "Liverpool";
  if (outward.startsWith("LS")) return "Leeds";
  if (outward.startsWith("G")) return "Glasgow";
  if (outward.startsWith("EH")) return "Edinburgh";
  if (outward.startsWith("CF")) return "Cardiff";
  if (outward.startsWith("BT")) return "Belfast";
  if (/^(E|N|W|SW|SE|NW|EC|WC)/.test(outward)) return "London";
  return "United Kingdom";
}

/** Preview lookup until a live address service is connected. */
export function lookupPostcode(postcode: string): AddressHit[] | null {
  const normalised = normalisePostcode(postcode);
  if (!normalised) return null;
  const town = townFromPostcode(normalised);
  return SAMPLE_ROADS.map((road) => ({
    id: `${normalised}-${road}`,
    label: `${road}, ${town}, ${normalised}`,
  }));
}

export const FINANCE_LENDERS = [
  "Advantage Finance",
  "Black Horse",
  "Blue Motor Finance",
  "Close Brothers Motor Finance",
  "Motonovo Finance",
  "Moneybarn",
  "Oodle Car Finance",
  "Santander Consumer Finance",
  "Specialist Motor Finance",
  "Tandem Bank",
  "Zopa",
];
