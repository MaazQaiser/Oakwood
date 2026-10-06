"use client";

import { Button, IconButton } from "@/components/ui/Button";
import { IconCompare } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { getCompareUrl } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { compareCopy } from "@/lib/compare/copy";
import { cn } from "@/lib/cn";
import type { VehicleCategory } from "@/types/vehicle";

export function CompareVehicleButton({
  stockId,
  vehicleName,
  category = "car",
  appearance = "icon",
  className,
}: {
  stockId: string;
  vehicleName: string;
  category?: VehicleCategory;
  appearance?: "icon" | "button";
  className?: string;
}) {
  const { has, toggle } = useCompare();
  const { pushToast } = useToast();
  const selected = has(stockId);

  if (category !== "car") {
    return null;
  }

  function onToggle() {
    const result = toggle(stockId);
    if (result.action === "removed") {
      pushToast(compareCopy.removed, "info");
      return;
    }
    if (result.action === "ignored") {
      return;
    }
    pushToast(
      result.action === "replaced" ? compareCopy.replaced : compareCopy.added,
      "success",
      { href: getCompareUrl(result.stockIds), label: compareCopy.compareNow },
    );
  }

  if (appearance === "button") {
    return (
      <Button
        type="button"
        variant={selected ? "tertiary" : "secondary"}
        aria-pressed={selected}
        className={cn("w-full", className)}
        onClick={onToggle}
      >
        <IconCompare className={selected ? "text-primary" : undefined} />
        {selected ? "Remove from compare" : "Add to compare"}
      </Button>
    );
  }

  return (
    <IconButton
      label={
        selected
          ? `Remove ${vehicleName} from compare`
          : `Add ${vehicleName} to compare`
      }
      aria-pressed={selected}
      className={cn("bg-surface shadow-sm", className)}
      onClick={onToggle}
    >
      <IconCompare className={selected ? "text-primary" : undefined} />
    </IconButton>
  );
}
