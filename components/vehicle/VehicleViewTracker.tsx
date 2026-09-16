"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function VehicleViewTracker({ stockId }: { stockId: string }) {
  useEffect(() => {
    trackEvent(analyticsEvents.vehicleViewed, { stockId });
  }, [stockId]);

  return null;
}
