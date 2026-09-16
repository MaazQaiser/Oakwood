"use client";

import { PromoPanel } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/layout/Container";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { buildSearchHref } from "@/lib/validation/search";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";
import type { VehicleCategory } from "@/types/vehicle";

export function FinanceSearchCTA({
  basePath,
  category = "car",
}: {
  basePath: string;
  category?: VehicleCategory;
}) {
  const { mode } = useCustomerFinance();
  const eligible = mode === "personalised" || mode === "ineligible";
  const copy = getSearchCopy(category);
  const vanEvents = getVanSearchEvents(category);

  if (eligible) {
    return (
      <Section>
        <Container>
          <PromoPanel>
            <h2 className="text-h2">{copy.affordableFooterTitle}</h2>
            <p className="mt-3 max-w-2xl text-body text-muted">
              {copy.affordableFooterBody}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                href={buildSearchHref(basePath, { affordable: "1" })}
                onClick={() => {
                  if (vanEvents) {
                    trackEvent(vanEvents.financeClicked, {
                      source: "search_footer",
                    });
                  }
                }}
              >
                {copy.affordableCta}
              </Button>
              <Button href={routes.financeCalculator} variant="secondary">
                Finance calculator
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
        <PromoPanel>
          <h2 className="text-h2">{copy.financeFooterTitle}</h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            {copy.financeFooterBody}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              href={routes.eligibility}
              onClick={() => {
                trackEvent(analyticsEvents.financeEligibilityCtaClicked, {
                  source: "search_footer",
                  category,
                });
                if (vanEvents) {
                  trackEvent(vanEvents.eligibilityClicked, {
                    source: "search_footer",
                  });
                }
              }}
            >
              {copy.heroPrimary}
            </Button>
            <Button href={routes.financeCalculator} variant="secondary">
              Finance calculator
            </Button>
          </div>
        </PromoPanel>
      </Container>
    </Section>
  );
}
