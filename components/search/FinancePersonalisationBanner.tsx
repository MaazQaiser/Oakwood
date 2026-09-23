"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getSearchCopy, type SearchCopy } from "@/lib/vehicles/searchCopy";

export function FinancePersonalisationBanner({
  copy = getSearchCopy("car"),
  browseHref = "#results",
}: {
  copy?: SearchCopy;
  browseHref?: string;
}) {
  const { mode, setAssumptionsOpen } = useCustomerFinance();
  const [dismissed, setDismissed] = useState(false);
  const eligible = mode === "personalised" || mode === "ineligible";
  const vanEvents = getVanSearchEvents(copy.category);

  if (eligible) {
    if (dismissed) {
      return null;
    }

    return (
      <section
        aria-label="Finance profile"
        className="rounded-[14px] border border-border bg-surface px-4 py-3 md:px-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-label">{copy.personalisedTitle}</h2>
            <p className="mt-1 text-caption text-muted">
              {copy.personalisedBody}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="text"
              onClick={() => {
                if (vanEvents) {
                  trackEvent(vanEvents.financeClicked, {
                    source: "update_finance",
                  });
                }
                setAssumptionsOpen(true);
              }}
            >
              Update my finance
            </Button>
            <Button variant="text" onClick={() => setDismissed(true)}>
              Hide
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Finance eligibility"
      className="rounded-[14px] border border-border bg-primary-soft px-4 py-4 md:px-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-h4">{copy.bannerTitle}</h2>
          <p className="mt-1 text-body-sm text-muted">{copy.bannerBody}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            href={routes.eligibility}
            className="btn-compact"
            onClick={() => {
              trackEvent(analyticsEvents.financeEligibilityCtaClicked, {
                source: "search_banner",
                category: copy.category,
              });
              if (vanEvents) {
                trackEvent(vanEvents.eligibilityClicked, {
                  source: "search_banner",
                });
              }
            }}
          >
            {copy.bannerCta}
          </Button>
          <Button href={browseHref} variant="secondary" className="btn-compact">
            Browse without checking
          </Button>
        </div>
      </div>
    </section>
  );
}
