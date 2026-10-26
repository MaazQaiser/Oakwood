"use client";

import { IconHeart } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { routes } from "@/config/routes";
import { useSavedVehicles } from "@/features/saved/SavedVehiclesProvider";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { VehicleCategory } from "@/types/vehicle";

export function SaveVehicleButton({
  vehicleName,
  stockId,
  category = "car",
  className,
}: {
  vehicleName: string;
  stockId?: string;
  category?: VehicleCategory;
  className?: string;
}) {
  const { has, toggle, ready } = useSavedVehicles();
  const { pushToast } = useToast();
  const saved = Boolean(stockId && ready && has(stockId));
  const listLabel = category === "van" ? "your vans" : "your cars";

  return (
    <IconButton
      label={
        saved
          ? `Remove ${vehicleName} from ${listLabel}`
          : `Save ${vehicleName}`
      }
      aria-pressed={saved}
      title={saved ? "Saved" : "Save for later"}
      className={cn(
        "bg-surface shadow-sm",
        saved ? "text-primary" : "text-ink hover:bg-page-tint",
        className,
      )}
      onClick={() => {
        if (!stockId) {
          return;
        }
        const result = toggle(stockId, category);
        if (result.action === "added") {
          pushToast(
            category === "van" ? "Saved to your vans" : "Saved to your cars",
            "success",
            { href: routes.savedCars, label: "View your cars" },
          );
          const vanEvents = getVanSearchEvents(category);
          if (vanEvents) {
            trackEvent(vanEvents.saved, { stockId });
          }
          return;
        }
        if (result.action === "removed") {
          pushToast(
            category === "van" ? "Removed from your vans" : "Removed from your cars",
            "info",
            { href: routes.savedCars, label: "View your cars" },
          );
          return;
        }
        if (result.action === "limit") {
          pushToast("Your cars list is full", "info", {
            href: routes.savedCars,
            label: "View your cars",
          });
        }
      }}
    >
      <IconHeart filled={saved} className={saved ? "text-primary" : undefined} />
    </IconButton>
  );
}
