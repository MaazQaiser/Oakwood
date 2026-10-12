"use client";

import { cn } from "@/lib/cn";
import {
  PRICE_VIEW_CASH,
  PRICE_VIEW_MONTHLY,
  type ListingPriceView,
} from "@/lib/vehicles/searchCopy";

export function VehiclePriceToggle({
  value,
  onChange,
}: {
  value: ListingPriceView;
  onChange: (value: ListingPriceView) => void;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="sr-only">Price display</legend>
      <div className="grid grid-cols-2 rounded-[14px] bg-white p-1">
        <button
          type="button"
          className={cn(
            "min-h-11 rounded-[12px] px-3 text-sm font-semibold transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            value === "total"
              ? "bg-[#002852] text-white"
              : "bg-transparent text-primary-secondary hover:bg-page-tint",
          )}
          aria-pressed={value === "total"}
          onClick={() => onChange("total")}
        >
          {PRICE_VIEW_CASH}
        </button>
        <button
          type="button"
          className={cn(
            "min-h-11 rounded-[12px] px-3 text-sm font-semibold transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            value === "monthly"
              ? "bg-[#002852] text-white"
              : "bg-transparent text-primary-secondary hover:bg-page-tint",
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
