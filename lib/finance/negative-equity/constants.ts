/**
 * Negative equity page rules.
 * MIN_ADVANCE and PCP_GFV_MAX need confirming with Dan before launch.
 */

export const CAR_APR = 0.129;
export const SETTLEMENT_APR = 0.099;
export const MAX_LTV = 1.5;

/** No lender writes an agreement below this. Needs confirming with Dan. */
export const MIN_ADVANCE = 3_000;

/** Balloon must sit under this share of the advance. Needs confirming with Dan. */
export const PCP_GFV_MAX = 0.75;

export const MAX_AGE_END = 15;
export const MAX_MILES_END = 150_000;
export const STANDARD_TERMS = [24, 36, 48, 60, 72, 84] as const;
export const PCP_ANNUAL_MILES = 8_000;
export const SETTLEMENT_TERM_CAP = 60;

/**
 * Settlement estimator. Assumed rate is deliberately low so the present value
 * overstates; understating builds a deal that collapses in the showroom.
 * Needs testing against twenty real Eskimo figures (Dan).
 */
export const ESTIMATE_APR = 0.109;
export const ESTIMATE_DEFERMENT = 1.0125;

/** Illustrative proof claims — replace with evidenced figures before launch. */
export const PROOF = {
  typLo: 2_000,
  typHi: 6_000,
  most: 17_400,
} as const;

export const COVER_YEAR_OPTIONS = [1, 2, 3] as const;
export type CoverYear = (typeof COVER_YEAR_OPTIONS)[number];

export const COVER_PRODUCTS = [
  {
    id: "w",
    name: "AA Warranty",
    description:
      "Mechanical cover backed by the AA, with AA breakdown included",
    hasTerm: true,
  },
  {
    id: "s",
    name: "Service Plan",
    description: "Manufacturer schedule, at our own workshops",
    hasTerm: true,
  },
  {
    id: "m",
    name: "MOT Plan",
    description:
      "Test fee covered each year, with a reminder three weeks before",
    hasTerm: true,
  },
  {
    id: "g",
    name: "Supagard",
    description:
      "Paint and interior protection, applied before you collect",
    hasTerm: false,
  },
] as const;

export type CoverProductId = (typeof COVER_PRODUCTS)[number]["id"];

export type QuoteProduct = "hp" | "pcp";
export type QuoteReason = "ok" | "ltv" | "small" | "pcp";

export const BLOCKED_COPY: Record<
  Exclude<QuoteReason, "ok">,
  { eyebrow: string; heading: string }
> = {
  ltv: { eyebrow: "Over the limit", heading: "This car cannot carry it" },
  small: {
    eyebrow: "Too little to finance",
    heading: "You barely need finance here",
  },
  pcp: { eyebrow: "Wrong product", heading: "PCP does not work on this one" },
};

export const REASON_LABEL: Record<Exclude<QuoteReason, "ok">, string> = {
  ltv: "over 150%",
  small: "too little to finance",
  pcp: "HP only",
};
