"use client";

import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format/money";

export function AnnualMileageSelector({
  value,
  options,
  onChange,
}: {
  value?: number;
  options: readonly number[];
  onChange: (value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-label" id="mileage-label">
        Annual mileage
      </legend>
      <div
        role="radiogroup"
        aria-labelledby="mileage-label"
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "min-h-11 rounded-md border px-3 text-button",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border-strong bg-surface text-ink hover:bg-page",
              )}
              onClick={() => onChange(option)}
            >
              {formatNumber(option)} miles
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
