"use client";

import { useEffect } from "react";
import { setLastViewedStockId } from "@/lib/vehicles/last-viewed";

export function TrackLastViewedVehicle({ stockId }: { stockId: string }) {
  useEffect(() => {
    setLastViewedStockId(stockId);
  }, [stockId]);

  return null;
}
