export type FinanceProductType = "hp" | "pcp";

/**
 * Session-scoped eligibility result. Must never appear in URLs or browser storage.
 * Drives personalised monthly pricing, eligible stock, deposit requirements,
 * deal builder, and the CRM lead payload once integrations are live.
 */
export interface FinanceProfile {
  apr: number;
  maximumAdvance: number;
  maximumTerm: number;
  productType: FinanceProductType;
  decisionIdentifier: string;
  decisionDate: string;
  expiry: string;
}

export type FinanceIntentSlug =
  | "bad-credit"
  | "no-deposit"
  | "ccj"
  | "self-employed"
  | "first-time-buyer"
  | "hp"
  | "pcp";

export interface FinanceIntent {
  slug: FinanceIntentSlug;
  title: string;
}
