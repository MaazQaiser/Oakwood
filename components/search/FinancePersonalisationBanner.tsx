"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getSearchCopy, type SearchCopy } from "@/lib/vehicles/searchCopy";

export function FinancePersonalisationBanner({
  copy = getSearchCopy("car"),
  className,
  compact = false,
  unboxed = false,
}: {
  copy?: SearchCopy;
  className?: string;
  compact?: boolean;
  unboxed?: boolean;
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
        className={cn(
          unboxed
            ? "p-0"
            : "rounded-[14px] border border-border bg-surface px-4 py-3 md:px-5",
          className,
        )}
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

  function onEligibilityClick() {
    trackEvent(analyticsEvents.financeEligibilityCtaClicked, {
      source: "search_banner",
      category: copy.category,
    });
    if (vanEvents) {
      trackEvent(vanEvents.eligibilityClicked, {
        source: "search_banner",
      });
    }
  }

  if (compact) {
    return (
      <section
        aria-label="Finance eligibility"
        className={cn(
          unboxed
            ? "flex flex-col gap-3 lg:h-[3.75rem] lg:flex-row lg:items-center lg:justify-between lg:gap-3"
            : "flex flex-col gap-3 rounded-[14px] border border-border bg-primary-soft px-4 py-3 lg:h-[3.75rem] lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-1.5 lg:pl-4 lg:pr-1.5",
          className,
        )}
      >
        <h2 className="min-w-0 text-label lg:truncate">{copy.bannerTitle}</h2>
        <Button
          href={routes.eligibility}
          className="btn-compact w-full shrink-0 lg:w-auto"
          onClick={onEligibilityClick}
        >
          {copy.bannerCta}
        </Button>
      </section>
    );
  }

  return (
    <section
      aria-label="Finance eligibility"
      className={cn(
        unboxed
          ? null
          : "rounded-[14px] border border-border bg-primary-soft px-4 py-4 md:px-5",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between",
          unboxed ? "gap-6 sm:gap-8" : "gap-4 sm:gap-5",
        )}
      >
        <div className="min-w-0">
          <h2
            className={
              unboxed
                ? "text-[1.35rem] font-medium tracking-[-0.02em] text-ink sm:text-[1.5rem]"
                : "text-h4"
            }
          >
            {copy.bannerTitle}
          </h2>
          <p
            className={cn(
              "text-body-sm text-muted",
              unboxed ? "mt-3" : "mt-1",
            )}
          >
            {copy.bannerBody}
          </p>
        </div>
        <Button
          href={routes.eligibility}
          className="btn-compact justify-start gap-2 self-start shrink-0"
          onClick={onEligibilityClick}
        >
          {copy.bannerCta}
        </Button>
      </div>
    </section>
  );
}
