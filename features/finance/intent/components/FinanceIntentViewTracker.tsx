"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceIntentViewTracker({
  intent,
}: {
  intent: FinanceIntentSlug | "hub";
}) {
  useEffect(() => {
    trackEvent(analyticsEvents.financeIntentViewed, { intent });
  }, [intent]);

  return null;
}
