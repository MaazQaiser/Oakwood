import {
  DEAL_PROVIDER_CONFIG,
  type DealProviderConfig,
} from "@/lib/deal/provider-config";
import {
  ILLUSTRATION_BASE_DEPOSIT,
  ILLUSTRATION_BASE_TERM,
} from "@/lib/finance/illustration";

/**
 * Calculator defaults are the same provider / illustration bounds used by
 * Deal Builder. Do not add production APR, GMFV, or representative-rate
 * figures here until the finance provider supplies them.
 */
export interface FinanceCalculatorConfig {
  source: "deal-provider";
  provider: DealProviderConfig;
  defaultDeposit: number;
  defaultTerm: number;
  /**
   * Catalogue stock used only to scale a representative monthly figure when
   * the customer has not chosen a vehicle. Not a lender quotation.
   */
  catalogueExampleStockId: string;
  /**
   * Unset until approved representative APR content exists.
   * Do not display MOCK_APR_BASE as a representative rate.
   */
  representativeApr?: number;
}

export const FINANCE_CALCULATOR_CONFIG: FinanceCalculatorConfig = {
  source: "deal-provider",
  provider: DEAL_PROVIDER_CONFIG,
  defaultDeposit: ILLUSTRATION_BASE_DEPOSIT,
  defaultTerm: ILLUSTRATION_BASE_TERM,
  catalogueExampleStockId: "1000020",
};
