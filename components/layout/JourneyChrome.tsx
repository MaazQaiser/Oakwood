"use client";

import { useLayoutEffect } from "react";

export function JourneyChrome() {
  useLayoutEffect(() => {
    document.documentElement.dataset.oakJourney = "true";
    return () => {
      delete document.documentElement.dataset.oakJourney;
    };
  }, []);

  return null;
}
