"use client";

import { useState } from "react";
import { IconHeart } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getVanSearchEvents } from "@/features/vans/analytics";
import type { VehicleCategory } from "@/types/vehicle";

export function SaveVehicleButton({
  vehicleName,
  stockId,
  category = "car",
}: {
  vehicleName: string;
  stockId?: string;
  category?: VehicleCategory;
}) {
  const [saved, setSaved] = useState(false);
  const { pushToast } = useToast();

  return (
    <IconButton
      label={
        saved
          ? `Remove ${vehicleName} from saved ${category === "van" ? "vans" : "cars"}`
          : `Save ${vehicleName}`
      }
      aria-pressed={saved}
      className="bg-surface shadow-sm"
      onClick={() => {
        const next = !saved;
        setSaved(next);
        if (next) {
          pushToast(
            category === "van" ? "Saved to your vans" : "Saved to your cars",
            "success",
          );
          trackEvent(analyticsEvents.vehicleSaved, {
            stockId,
            vehicleName,
            category,
          });
          trackEvent(analyticsEvents.saveVehicle, { stockId, category });
          const vanEvents = getVanSearchEvents(category);
          if (vanEvents) {
            trackEvent(vanEvents.saved, { stockId });
          }
        }
      }}
    >
      <IconHeart filled={saved} className={saved ? "text-primary" : undefined} />
    </IconButton>
  );
}
