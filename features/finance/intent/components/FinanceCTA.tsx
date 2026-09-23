"use client";

import { PromoPanel } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { Container, Section } from "@/components/layout/Container";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import {
  getEligibilityUrl,
  getFinanceCalculatorUrl,
  getSearchUrl,
  getUsedCarsUrl,
  supportRoutes,
} from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  FINANCE_INTENT_BROWSE_CARS,
  FINANCE_INTENT_CONTACT,
  FINANCE_INTENT_ELIGIBILITY_CTA,
  FINANCE_INTENT_ELIGIBILITY_SUPPORTING,
  FINANCE_INTENT_EXPIRED_CTA,
  FINANCE_INTENT_INELIGIBLE_BODY,
  FINANCE_INTENT_INELIGIBLE_HEADING,
  FINANCE_INTENT_PERSONALISED_BODY,
  FINANCE_INTENT_PERSONALISED_CTA,
  FINANCE_INTENT_PERSONALISED_HEADING,
} from "@/lib/finance/intent/copy";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceCTA({
  intent,
  supporting = FINANCE_INTENT_ELIGIBILITY_SUPPORTING,
  secondary,
  sticky = false,
}: {
  intent: FinanceIntentSlug | "hub";
  supporting?: string;
  secondary?: { href: string; label: string; event: "calculator" | "browse" | "px" };
  sticky?: boolean;
}) {
  const { mode } = useCustomerFinance();
  const personalised = mode === "personalised";
  const ineligible = mode === "ineligible";

  const trackCta = (action: string) => {
    trackEvent(analyticsEvents.financeIntentCtaClicked, { intent, action });
  };

  if (sticky) {
    const href = personalised
      ? getSearchUrl({ affordable: 1 })
      : ineligible
        ? getUsedCarsUrl()
        : getEligibilityUrl();
    const label = personalised
      ? FINANCE_INTENT_PERSONALISED_CTA
      : ineligible
        ? FINANCE_INTENT_BROWSE_CARS
        : FINANCE_INTENT_ELIGIBILITY_CTA;

    return (
      <StickyActionBar>
        <div className="mx-auto max-w-[var(--oak-width-content)]">
          <Button
            href={href}
            className="w-full"
            onClick={() => {
              if (personalised || ineligible) {
                trackCta("browse");
                trackEvent(analyticsEvents.financeIntentVehicleBrowseClicked, {
                  intent,
                });
              } else {
                trackCta("eligibility");
                trackEvent(analyticsEvents.financeIntentEligibilityStarted, {
                  intent,
                });
              }
            }}
          >
            {label}
          </Button>
        </div>
      </StickyActionBar>
    );
  }

  if (personalised) {
    return (
      <Section>
        <Container>
          <PromoPanel className="py-8">
            <h2 className="text-h2">{FINANCE_INTENT_PERSONALISED_HEADING}</h2>
            <p className="mt-3 max-w-2xl text-body">
              {FINANCE_INTENT_PERSONALISED_BODY}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={getSearchUrl({ affordable: 1 })}
                size="lg"
                onClick={() => {
                  trackCta("browse");
                  trackEvent(analyticsEvents.financeIntentVehicleBrowseClicked, {
                    intent,
                  });
                }}
              >
                {FINANCE_INTENT_PERSONALISED_CTA}
              </Button>
              <Button
                href={getFinanceCalculatorUrl()}
                size="lg"
                onClick={() => {
                  trackCta("calculator");
                  trackEvent(analyticsEvents.financeIntentCalculatorClicked, {
                    intent,
                  });
                }}
              >
                Finance calculator
              </Button>
            </div>
          </PromoPanel>
        </Container>
      </Section>
    );
  }

  if (ineligible) {
    return (
      <Section>
        <Container>
          <PromoPanel className="py-8">
            <h2 className="text-h2">{FINANCE_INTENT_INELIGIBLE_HEADING}</h2>
            <p className="mt-3 max-w-2xl text-body">
              {FINANCE_INTENT_INELIGIBLE_BODY}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={getUsedCarsUrl()}
                size="lg"
                onClick={() => {
                  trackCta("browse");
                  trackEvent(analyticsEvents.financeIntentVehicleBrowseClicked, {
                    intent,
                  });
                }}
              >
                {FINANCE_INTENT_BROWSE_CARS}
              </Button>
              <Button
                href={getEligibilityUrl()}
                size="lg"
                onClick={() => {
                  trackCta("eligibility");
                  trackEvent(analyticsEvents.financeIntentEligibilityStarted, {
                    intent,
                  });
                }}
              >
                {FINANCE_INTENT_EXPIRED_CTA}
              </Button>
              <Button
                href={supportRoutes.contact}
                variant="text"
                onClick={() => trackCta("contact")}
              >
                {FINANCE_INTENT_CONTACT}
              </Button>
            </div>
          </PromoPanel>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <PromoPanel className="py-8">
          <h2 className="text-h2">{FINANCE_INTENT_ELIGIBILITY_CTA}</h2>
          <p className="mt-3 max-w-2xl text-body">{supporting}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              href={getEligibilityUrl()}
              size="lg"
              onClick={() => {
                trackCta("eligibility");
                trackEvent(analyticsEvents.financeIntentEligibilityStarted, {
                  intent,
                });
              }}
            >
              {FINANCE_INTENT_ELIGIBILITY_CTA}
            </Button>
            {secondary ? (
              <Button
                href={secondary.href}
                size="lg"
                onClick={() => {
                  trackCta(secondary.event);
                  if (secondary.event === "calculator") {
                    trackEvent(analyticsEvents.financeIntentCalculatorClicked, {
                      intent,
                    });
                  }
                  if (secondary.event === "browse") {
                    trackEvent(analyticsEvents.financeIntentVehicleBrowseClicked, {
                      intent,
                    });
                  }
                }}
              >
                {secondary.label}
              </Button>
            ) : (
              <Button
                href={getFinanceCalculatorUrl()}
                size="lg"
                onClick={() => {
                  trackCta("calculator");
                  trackEvent(analyticsEvents.financeIntentCalculatorClicked, {
                    intent,
                  });
                }}
              >
                Finance calculator
              </Button>
            )}
          </div>
        </PromoPanel>
      </Container>
    </Section>
  );
}
