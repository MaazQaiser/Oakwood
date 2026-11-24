import type { GuaranteeSaleFixture } from "@/types/guarantee";

function placeholderPhoto(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="100%" height="100%" fill="#E7EEF4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#002852" font-family="Arial" font-size="14">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function photoSet(prefix: string) {
  return {
    front_left: placeholderPhoto(`${prefix} FL`),
    front_right: placeholderPhoto(`${prefix} FR`),
    rear_left: placeholderPhoto(`${prefix} RL`),
    rear_right: placeholderPhoto(`${prefix} RR`),
    interior: placeholderPhoto(`${prefix} INT`),
    dashboard: placeholderPhoto(`${prefix} DASH`),
  };
}

/** Days before today, as an ISO date string (local calendar day). */
function daysAgoIso(days: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * Fixture handovers for the guarantee request form.
 * Registrations are the values customers type in during demos.
 */
export const GUARANTEE_HANDOVERS: GuaranteeSaleFixture[] = [
  {
    registration: "AB21CDE",
    customerName: "Alex Morgan",
    email: "alex.morgan@example.com",
    mobile: "07700900123",
    stockId: "7848117",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    handoverDateIso: daysAgoIso(10),
    handoverMileage: 28450,
    sellingSiteSlug: "bury",
    sellingSiteName: "Bury",
    saleType: "retail",
    guaranteeEligible: true,
    salesperson: "Sam Patel",
    leadSource: "website",
    handoverPhotos: photoSet("Handover"),
  },
  {
    registration: "FN22XYZ",
    customerName: "Jordan Lee",
    email: "jordan.lee@example.com",
    mobile: "07700900456",
    stockId: "1000001",
    make: "Audi",
    model: "A3",
    year: 2020,
    handoverDateIso: daysAgoIso(18),
    handoverMileage: 31200,
    sellingSiteSlug: "bury",
    sellingSiteName: "Bury",
    saleType: "retail",
    guaranteeEligible: true,
    finance: {
      lender: "Hero",
      agreementDateIso: daysAgoIso(20),
    },
    partExchangeValue: 4500,
    salesperson: "Olivia Khan",
    leadSource: "AutoTrader",
    handoverPhotos: photoSet("Handover"),
  },
  {
    registration: "OLD19CAR",
    customerName: "Casey Wright",
    email: "casey.wright@example.com",
    mobile: "07700900789",
    stockId: "1000002",
    make: "Audi",
    model: "Q4 e-tron",
    year: 2022,
    handoverDateIso: daysAgoIso(45),
    handoverMileage: 18500,
    sellingSiteSlug: "chorley",
    sellingSiteName: "Chorley",
    saleType: "retail",
    guaranteeEligible: true,
    salesperson: "Sam Patel",
    leadSource: "Hero",
    handoverPhotos: photoSet("Handover"),
  },
  {
    registration: "TR19ADE",
    customerName: "Trade Buyer",
    email: "trade@example.com",
    mobile: "07700900111",
    stockId: "1000201",
    make: "Vauxhall",
    model: "Corsa",
    year: 2019,
    handoverDateIso: daysAgoIso(5),
    handoverMileage: 42000,
    sellingSiteSlug: "bury",
    sellingSiteName: "Bury",
    saleType: "trade",
    guaranteeEligible: false,
    salesperson: "Olivia Khan",
    leadSource: "website",
    handoverPhotos: photoSet("Handover"),
  },
  {
    registration: "SA18SEE",
    customerName: "Seen Buyer",
    email: "seen@example.com",
    mobile: "07700900222",
    stockId: "1000202",
    make: "Nissan",
    model: "Qashqai",
    year: 2018,
    handoverDateIso: daysAgoIso(8),
    handoverMileage: 68000,
    sellingSiteSlug: "chorley",
    sellingSiteName: "Chorley",
    saleType: "sold_as_seen",
    guaranteeEligible: false,
    salesperson: "Sam Patel",
    leadSource: "website",
    handoverPhotos: photoSet("Handover"),
  },
  {
    registration: "RF21ONE",
    customerName: "Riley Prior",
    email: "riley.prior@example.com",
    mobile: "07700900333",
    stockId: "1000005",
    make: "BMW",
    model: "1 Series",
    year: 2020,
    handoverDateIso: daysAgoIso(12),
    handoverMileage: 30000,
    sellingSiteSlug: "bury",
    sellingSiteName: "Bury",
    saleType: "retail",
    guaranteeEligible: true,
    salesperson: "Olivia Khan",
    leadSource: "Hero",
    previousGuaranteeRefundAtIso: daysAgoIso(90),
    handoverPhotos: photoSet("Handover"),
  },
];

/** Miles from selling site for demo postcodes. */
export const COLLECTION_POSTCODE_DISTANCES: Record<string, number> = {
  BL81AA: 3,
  BL91BB: 8,
  M11AE: 12,
  PR71CD: 18,
  L11DE: 28,
  WA11EF: 35,
  SK11GH: 42,
  BD11IJ: 55,
};

export function normaliseRegistration(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function findHandoverByRegistration(
  registration: string,
): GuaranteeSaleFixture | undefined {
  const key = normaliseRegistration(registration);
  return GUARANTEE_HANDOVERS.find(
    (sale) => normaliseRegistration(sale.registration) === key,
  );
}

export function lookupCollectionDistance(postcode: string): number | undefined {
  const key = postcode.replace(/\s+/g, "").toUpperCase();
  return COLLECTION_POSTCODE_DISTANCES[key];
}
