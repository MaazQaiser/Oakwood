"use client";

import { useEffect } from "react";

/** Applies document-level hooks for Variant 2 mobile chrome (header/footer). */
export function VdpV2Chrome() {
  useEffect(() => {
    document.documentElement.dataset.vdpV2 = "true";
    return () => {
      delete document.documentElement.dataset.vdpV2;
    };
  }, []);

  return null;
}
