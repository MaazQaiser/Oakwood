"use client";

import { Button } from "@/components/ui/Button";
import { getEligibilityUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  CALCULATOR_ELIGIBILITY_CTA,
  CALCULATOR_ELIGIBILITY_SUPPORTING,
} from "@/lib/finance/calculator-copy";

export function EligibilityCTA({
  source = "calculator",
  compact = false,
  onClick,
}: {
  source?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <div>
      <Button
        href={getEligibilityUrl()}
        className="w-full"
        onClick={() => {
          onClick?.();
          trackEvent(analyticsEvents.financeEligibilityClicked, { source });
        }}
      >
        {CALCULATOR_ELIGIBILITY_CTA}
      </Button>
      {compact ? null : (
        <p className="mt-2 text-caption text-muted">
          {CALCULATOR_ELIGIBILITY_SUPPORTING}
        </p>
      )}
    </div>
  );
}
