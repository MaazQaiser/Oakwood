"use client";

import { cn } from "@/lib/cn";
import {
  PRICE_VIEW_MONTHLY,
  PRICE_VIEW_TOTAL,
  type ListingPriceView,
} from "@/lib/vehicles/searchCopy";

export function PriceViewToggle({
  value,
  onChange,
  className,
}: {
  value: ListingPriceView;
  onChange: (value: ListingPriceView) => void;
  className?: string;
}) {
  return (
    <fieldset className={cn("m-0 min-w-0 border-0 p-0", className)}>
      <legend className="sr-only">Price display</legend>
      <div className="grid h-9 grid-cols-2 items-center rounded-full bg-page-tint p-0.5">
        <button
          type="button"
          className={cn(
            "h-8 rounded-full px-2.5 text-caption font-semibold whitespace-nowrap",
            value === "total"
              ? "bg-primary text-white"
              : "bg-transparent text-primary-secondary",
          )}
          aria-pressed={value === "total"}
          onClick={() => onChange("total")}
        >
          {PRICE_VIEW_TOTAL}
        </button>
        <button
          type="button"
          className={cn(
            "h-8 rounded-full px-2.5 text-caption font-semibold whitespace-nowrap",
            value === "monthly"
              ? "bg-primary text-white"
              : "bg-transparent text-primary-secondary",
          )}
          aria-pressed={value === "monthly"}
          onClick={() => onChange("monthly")}
        >
          {PRICE_VIEW_MONTHLY}
        </button>
      </div>
    </fieldset>
  );
}
