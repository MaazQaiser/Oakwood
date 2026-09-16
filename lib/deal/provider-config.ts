/**
 * Lender / finance-provider configuration boundary.
 *
 * Do not treat these values as live Autoconvert rules. Fields that the
 * addendum still marks open (OD3 vehicle eligibility, LTV, age/mileage at
 * end of term, product financeability, negative-equity treatment) are
 * either mock-labelled or left undefined so the UI cannot invent a rule.
 */
export interface DealProviderConfig {
  source: "mock";
  minDeposit: number;
  maxDepositCap: number;
  depositStep: number;
  termOptions: readonly number[];
  pcpEnabled: boolean;
  pcpMileageOptions: readonly number[];
  /**
   * Mock PCP balloon basis. Replaced when the lender returns a Guaranteed
   * Minimum Future Value / final payment.
   */
  pcpBaseResidualRate: number;
  pcpMileageResidualStep: number;
  includeNegativeEquityInAdvance: boolean;
  /** OD3 — unset until the lender returns a vehicle-age rule. */
  maxVehicleAgeAtTermEndYears?: number;
  /** OD3 — unset until the lender returns an end-of-term mileage cap. */
  maxMileageAtTermEnd?: number;
  minAdvance?: number;
  maxLtv?: number;
}

export const DEAL_PROVIDER_CONFIG: DealProviderConfig = {
  source: "mock",
  minDeposit: 0,
  maxDepositCap: 20000,
  depositStep: 250,
  termOptions: [24, 36, 48, 60],
  pcpEnabled: true,
  pcpMileageOptions: [8000, 10000, 12000, 15000],
  pcpBaseResidualRate: 0.4,
  pcpMileageResidualStep: 0.012,
  includeNegativeEquityInAdvance: true,
};
