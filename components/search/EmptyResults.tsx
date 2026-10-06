"use client";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { routes } from "@/config/routes";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { AlternativeSearch } from "@/lib/vehicles/search";
import { getSearchCopy, type SearchCopy } from "@/lib/vehicles/searchCopy";

export function EmptyResults({
  heading,
  description,
  alternatives,
  copy = getSearchCopy("car"),
  onClear,
}: {
  heading?: string;
  description?: string;
  alternatives: AlternativeSearch[];
  copy?: SearchCopy;
  onClear: () => void;
}) {
  const vanEvents = getVanSearchEvents(copy.category);
  const title = heading ?? copy.emptyHeading;

  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-8">
      <h2 className="text-h3">{title}</h2>
      <p className="mt-2 text-body text-muted">
        {description ?? copy.emptyFallback}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {copy.showNotify ? (
          <Button
            href={routes.getAQuote}
            onClick={() => {
              trackEvent(analyticsEvents.requestACarClicked, {
                category: copy.category,
                type: "notify",
              });
            }}
          >
            {copy.notifyLabel}
          </Button>
        ) : null}
        <Button
          href={routes.getAQuote}
          variant={copy.showNotify ? "secondary" : "primary"}
          onClick={() => {
            trackEvent(analyticsEvents.requestACarClicked, {
              category: copy.category,
            });
            if (vanEvents) {
              trackEvent(vanEvents.requestStarted, { source: "empty_results" });
            }
          }}
        >
          {copy.requestLabel}
        </Button>
        <Button variant="tertiary" onClick={onClear}>
          {copy.category === "van" ? "Relax filters" : "Clear filters"}
        </Button>
        <Button href={copy.hubHref} variant="tertiary">
          {copy.browseAllLabel}
        </Button>
      </div>
      {alternatives.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-h4">Change this search</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {alternatives.map((item) => (
              <li key={item.href}>
                <Button href={item.href} variant="text" className="px-0">
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function StockErrorState({
  onRetry,
  copy = getSearchCopy("car"),
}: {
  onRetry: () => void;
  copy?: SearchCopy;
}) {
  const vanEvents = getVanSearchEvents(copy.category);

  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-8">
      <Alert title={copy.stockErrorTitle} tone="warning">
        {copy.stockErrorBody}
      </Alert>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onRetry}>Try again</Button>
        <Button href={routes.bookingEnquiry} variant="secondary">
          Contact Oakwood
        </Button>
        <Button
          href={routes.getAQuote}
          variant="tertiary"
          onClick={() => {
            trackEvent(analyticsEvents.requestACarClicked, {
              category: copy.category,
            });
            if (vanEvents) {
              trackEvent(vanEvents.requestStarted, { source: "stock_error" });
            }
          }}
        >
          {copy.requestLabel}
        </Button>
      </div>
    </div>
  );
}
