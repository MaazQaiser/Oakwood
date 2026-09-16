"use client";

import { Button } from "@/components/ui/Button";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import {
  getEligibilityUrl,
  getFinanceCalculatorUrl,
  getSearchUrl,
  getUsedCarsUrl,
} from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  FINANCE_INTENT_BROWSE_CARS,
  FINANCE_INTENT_ELIGIBILITY_CTA,
  FINANCE_INTENT_PERSONALISED_CTA,
} from "@/lib/finance/intent/copy";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceHeroActions({
  intent,
  secondary,
}: {
  intent: FinanceIntentSlug | "hub";
  secondary?: { href: string; label: string; event: "calculator" | "browse" | "px" };
}) {
  const { mode } = useCustomerFinance();
  const personalised = mode === "personalised";
  const ineligible = mode === "ineligible";

  const primaryHref = personalised
    ? getSearchUrl({ affordable: 1 })
    : ineligible
      ? getUsedCarsUrl()
      : getEligibilityUrl();
  const primaryLabel = personalised
    ? FINANCE_INTENT_PERSONALISED_CTA
    : ineligible
      ? FINANCE_INTENT_BROWSE_CARS
      : FINANCE_INTENT_ELIGIBILITY_CTA;

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        href={primaryHref}
        size="lg"
        onClick={() => {
          trackEvent(analyticsEvents.financeIntentCtaClicked, {
            intent,
            action: personalised || ineligible ? "browse" : "eligibility",
            source: "hero",
          });
          if (personalised || ineligible) {
            trackEvent(analyticsEvents.financeIntentVehicleBrowseClicked, {
              intent,
            });
          } else {
            trackEvent(analyticsEvents.financeIntentEligibilityStarted, {
              intent,
            });
          }
        }}
      >
        {primaryLabel}
      </Button>
      <Button
        href={secondary?.href ?? getFinanceCalculatorUrl()}
        variant="secondary"
        size="lg"
        onClick={() => {
          const event = secondary?.event ?? "calculator";
          trackEvent(analyticsEvents.financeIntentCtaClicked, {
            intent,
            action: event,
            source: "hero",
          });
          if (event === "calculator") {
            trackEvent(analyticsEvents.financeIntentCalculatorClicked, {
              intent,
            });
          }
          if (event === "browse") {
            trackEvent(analyticsEvents.financeIntentVehicleBrowseClicked, {
              intent,
            });
          }
        }}
      >
        {secondary?.label ?? "Finance calculator"}
      </Button>
    </div>
  );
}
