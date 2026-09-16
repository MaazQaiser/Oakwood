"use client";

import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";

export function EligibilityProcessing({
  timedOut,
  onKeepWaiting,
}: {
  timedOut?: boolean;
  onKeepWaiting?: () => void;
}) {
  if (timedOut) {
    return (
      <div role="status" aria-live="polite">
        <h1 className="text-h2">Still checking your eligibility</h1>
        <p className="mt-3 text-body text-muted">
          This is taking a little longer than expected.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onKeepWaiting}>Keep waiting</Button>
          <Button href={routes.usedCars} variant="secondary">
            Continue browsing
          </Button>
          <Button href={routes.bookingEnquiry} variant="text">
            Get help
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite">
      <h1 className="text-h2">Checking your eligibility</h1>
      <p className="mt-3 text-body text-muted">
        This usually takes less than a minute.
      </p>
      <div
        className="mt-8 h-1 overflow-hidden rounded-full bg-border"
        aria-hidden="true"
      >
        <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}
