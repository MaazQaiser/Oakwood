"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

const PAGE_EVENTS = {
  hub: analyticsEvents.locationHubViewed,
  location: analyticsEvents.locationViewed,
  about: analyticsEvents.aboutViewed,
  "how-it-works": analyticsEvents.howItWorksViewed,
  "what-to-expect": analyticsEvents.whatToExpectViewed,
  reviews: analyticsEvents.reviewsViewed,
} as const;

export function TrustViewTracker({
  page,
  location,
}: {
  page: keyof typeof PAGE_EVENTS;
  location?: string;
}) {
  useEffect(() => {
    trackEvent(PAGE_EVENTS[page], location ? { location } : { page });
  }, [location, page]);

  return null;
}
