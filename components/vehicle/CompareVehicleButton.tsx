"use client";

import { Button, IconButton } from "@/components/ui/Button";
import { IconCompare } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { getCompareUrl } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { COMPARE_MAX, compareCopy } from "@/lib/compare/copy";
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
  const { has, toggle, count } = useCompare();
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
    if (result.action === "limit") {
      pushToast(compareCopy.limitReached, "info", {
        href: getCompareUrl(result.stockIds),
        label: compareCopy.compareNow,
      });
      return;
    }
    if (result.action === "ignored") {
      return;
    }
    pushToast(compareCopy.added, "success", {
      href: getCompareUrl(result.stockIds),
      label:
        result.stockIds.length >= 2
          ? compareCopy.compareNow
          : compareCopy.addAnother,
    });
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
        {selected ? compareCopy.remove : compareCopy.add}
      </Button>
    );
  }

  return (
    <IconButton
      label={`${selected ? compareCopy.remove : compareCopy.add}: ${vehicleName}`}
      aria-pressed={selected}
      title={
        selected
          ? compareCopy.remove
          : count >= COMPARE_MAX
            ? compareCopy.limitReached
            : compareCopy.add
      }
      className={cn(
        "h-8! w-8! min-h-8! min-w-8! bg-surface p-0 shadow-sm hover:bg-page-tint [&_svg]:h-3.5! [&_svg]:w-3.5!",
        selected ? "text-primary" : "text-ink",
        className,
      )}
      onClick={onToggle}
    >
      <IconCompare className={selected ? "text-primary" : undefined} />
    </IconButton>
  );
}
