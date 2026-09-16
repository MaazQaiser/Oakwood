import { CALCULATOR_ELIGIBILITY_CTA } from "@/lib/finance/calculator-copy";
import {
  DEAL_APPLICATION_BOUNDARY,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  DEAL_SOFT_SEARCH,
} from "@/lib/deal/copy";
import { INDICATIVE_DISCLAIMER, SOFT_SEARCH_DISCLAIMER } from "@/lib/eligibility/copy";

export const FINANCE_INTENT_ELIGIBILITY_CTA = CALCULATOR_ELIGIBILITY_CTA;

export const FINANCE_INTENT_ELIGIBILITY_SUPPORTING =
  "Get a personalised finance profile with no impact on your credit score.";

export const FINANCE_INTENT_PERSONALISED_HEADING =
  "You're already eligible to browse.";

export const FINANCE_INTENT_PERSONALISED_BODY =
  "Your finance profile is ready. Browse cars within your budget, or use the calculator to plan a deal.";

export const FINANCE_INTENT_PERSONALISED_CTA = "Browse cars within my budget";

export const FINANCE_INTENT_EXPIRED_HEADING = "Your finance eligibility has expired.";

export const FINANCE_INTENT_EXPIRED_CTA = "Check eligibility again";

export const FINANCE_INTENT_INELIGIBLE_HEADING =
  "Some cars may be outside your current finance profile.";

export const FINANCE_INTENT_INELIGIBLE_BODY =
  "You can browse lower-priced cars, change your deposit later in the deal, or check eligibility again.";

export const FINANCE_INTENT_BROWSE_CARS = "Browse cars";

export const FINANCE_INTENT_BROWSE_VANS = "Browse vans";

export const FINANCE_INTENT_CONTACT = "Contact Oakwood";

export const FINANCE_INTENT_CALCULATOR = "Finance calculator";

export const CMS_FINANCE_INTENT_NOTICE =
  "Long-form finance education, FAQs and SEO fields will be editable in the finance content source when it is connected. These pages currently use typed Oakwood journey copy only.";

export const FINANCE_INTENT_DISCLAIMERS = [
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  INDICATIVE_DISCLAIMER,
  DEAL_APPLICATION_BOUNDARY,
  DEAL_SOFT_SEARCH,
  SOFT_SEARCH_DISCLAIMER,
] as const;

export const FINANCE_BROKER_STATUS =
  "Oakwood Motor Company is a credit broker, not a lender. Finance is subject to status.";
