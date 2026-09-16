"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { ContentType } from "@/types/content";

export function ContentViewTracker({
  slug,
  type,
}: {
  slug: string;
  type: ContentType;
}) {
  useEffect(() => {
    trackEvent(analyticsEvents.blogViewed, { slug, type });
    if (type === "model-guide") {
      trackEvent(analyticsEvents.modelGuideViewed, { slug });
    }
    if (type === "comparison") {
      trackEvent(analyticsEvents.comparisonViewed, { slug });
    }
  }, [slug, type]);

  return null;
}
