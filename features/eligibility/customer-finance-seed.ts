import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import type { CustomerFinanceSeed } from "@/features/eligibility/finance-seed-types";

export type { CustomerFinanceSeed };

export async function loadCustomerFinanceSeed(): Promise<CustomerFinanceSeed | null> {
  const eligibility = await getEligibilitySession();
  if (!eligibility || isSessionExpired(eligibility) || !eligibility.display) {
    return null;
  }
  if (
    eligibility.profile?.expiry &&
    Date.parse(eligibility.profile.expiry) <= Date.now()
  ) {
    return null;
  }
  if (eligibility.outcome !== "accepted" && eligibility.outcome !== "conditional") {
    return null;
  }
  return {
    mode: "personalised",
    apr: eligibility.display.apr,
    maxAdvance: eligibility.display.maxAdvance,
    deposit: eligibility.display.deposit,
    term: eligibility.display.term,
  };
}
