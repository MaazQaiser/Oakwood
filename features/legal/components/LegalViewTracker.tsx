"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function LegalViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent(analyticsEvents.legalPageViewed, { slug });
  }, [slug]);

  return null;
}
