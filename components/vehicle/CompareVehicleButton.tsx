"use client";

import Link from "next/link";
import { Button, IconButton } from "@/components/ui/Button";
import { IconCompare } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { getCompareUrl } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { COMPARE_MAX, compareCopy } from "@/lib/compare/copy";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
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
  const { has, toggle, count, stockIds } = useCompare();
  const { pushToast } = useToast();
  const selected = has(stockId);
  const compareHref = getCompareUrl(stockIds);

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

  function onOpenCompare() {
    trackEvent(analyticsEvents.compareTrayClicked, { count });
  }

  if (appearance === "button") {
    if (selected) {
      return (
        <Button
          href={compareHref}
          variant="tertiary"
          className={cn("w-full", className)}
          onClick={onOpenCompare}
        >
          <IconCompare className="text-primary" />
          {compareCopy.compareNow}
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="secondary"
        aria-pressed={false}
        className={cn("w-full", className)}
        onClick={onToggle}
      >
        <IconCompare />
        {compareCopy.add}
      </Button>
    );
  }

  if (selected) {
    return (
      <Link
        href={compareHref}
        aria-label={`${compareCopy.compareNow}: ${vehicleName}`}
        title={compareCopy.compareNow}
        aria-pressed="true"
        onClick={onOpenCompare}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface text-primary shadow-sm",
          "transition-colors hover:bg-page-tint",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className,
        )}
      >
        <IconCompare className="text-primary" />
      </Link>
    );
  }

  return (
    <IconButton
      label={`${compareCopy.add}: ${vehicleName}`}
      aria-pressed={false}
      title={count >= COMPARE_MAX ? compareCopy.limitReached : compareCopy.add}
      className={cn("bg-surface shadow-sm text-ink hover:bg-page-tint", className)}
      onClick={onToggle}
    >
      <IconCompare />
    </IconButton>
  );
}
