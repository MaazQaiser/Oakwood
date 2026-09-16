"use client";

import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { SearchCopy } from "@/lib/vehicles/searchCopy";

export function SearchHeroActions({ copy }: { copy: SearchCopy }) {
  const vanEvents = getVanSearchEvents(copy.category);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Button
        href={routes.eligibility}
        onClick={() => {
          trackEvent(analyticsEvents.financeEligibilityCtaClicked, {
            source: "search_hero",
            category: copy.category,
          });
          if (vanEvents) {
            trackEvent(vanEvents.eligibilityClicked, { source: "search_hero" });
          }
        }}
      >
        {copy.heroPrimary}
      </Button>
      <Button href="#results" variant="secondary">
        {copy.heroSecondary}
      </Button>
    </div>
  );
}
