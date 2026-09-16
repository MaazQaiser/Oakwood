"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

const PAGE_EVENTS = {
  aftersales: analyticsEvents.aftersalesViewed,
  service: analyticsEvents.serviceViewed,
  mot: analyticsEvents.motViewed,
  warranty: analyticsEvents.warrantyViewed,
} as const;

export function AftersalesViewTracker({
  page,
}: {
  page: keyof typeof PAGE_EVENTS;
}) {
  useEffect(() => {
    trackEvent(PAGE_EVENTS[page], { page });
  }, [page]);

  return null;
}
