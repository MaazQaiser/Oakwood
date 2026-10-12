"use client";

import { useState } from "react";
import { IconBookmark } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
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
      title={saved ? "Saved" : "Save for later"}
      className={cn(
        "bg-surface shadow-sm",
        saved ? "text-primary" : "text-ink hover:bg-page-tint",
      )}
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
      <IconBookmark filled={saved} className={saved ? "text-primary" : undefined} />
    </IconButton>
  );
}
