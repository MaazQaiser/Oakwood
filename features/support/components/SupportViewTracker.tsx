"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

const PAGE_EVENTS = {
  support: analyticsEvents.supportViewed,
  contact: analyticsEvents.contactViewed,
  faq: analyticsEvents.faqViewed,
  complaint: analyticsEvents.complaintViewed,
} as const;

export function SupportViewTracker({
  page,
}: {
  page: keyof typeof PAGE_EVENTS;
}) {
  useEffect(() => {
    trackEvent(PAGE_EVENTS[page], { page });
    if (page === "contact") {
      trackEvent(analyticsEvents.supportViewed, { page: "contact" });
    }
  }, [page]);

  return null;
}
