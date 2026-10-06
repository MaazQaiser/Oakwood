"use client";

import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { SearchCopy } from "@/lib/vehicles/searchCopy";

export function SearchRecovery({
  unmatched,
  relaxation,
  closestHeading,
  showingWithout,
  copy,
  onApplyClosest,
}: {
  unmatched: string;
  relaxation: string;
  closestHeading: string;
  showingWithout: string;
  copy: SearchCopy;
  onApplyClosest: () => void;
}) {
  const vanEvents = getVanSearchEvents(copy.category);

  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-5 sm:px-5">
      <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">
        {copy.emptyHeading}
      </h3>
      <p className="mt-2 text-body text-muted">{unmatched}</p>
      <p className="mt-2 text-body text-ink">{relaxation}</p>
      <p className="mt-1 text-body-sm text-muted">{showingWithout}</p>
      <p className="mt-4 text-body font-medium text-ink">{closestHeading}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {copy.showNotify ? (
          <Button
            href={routes.getAQuote}
            onClick={() => {
              trackEvent(analyticsEvents.requestACarClicked, {
                category: copy.category,
                type: "notify",
              });
              if (vanEvents) {
                trackEvent(vanEvents.requestStarted, { source: "search_recovery" });
              }
            }}
          >
            {copy.notifyLabel}
          </Button>
        ) : null}
        <Button
          href={routes.getAQuote}
          variant={copy.showNotify ? "tertiary" : "primary"}
          onClick={() => {
            trackEvent(analyticsEvents.requestACarClicked, {
              category: copy.category,
            });
            if (vanEvents) {
              trackEvent(vanEvents.requestStarted, { source: "search_recovery" });
            }
          }}
        >
          {copy.requestLabel}
        </Button>
        <Button variant="secondary" onClick={onApplyClosest}>
          Use these filters
        </Button>
      </div>
    </div>
  );
}
