"use client";

import { cn } from "@/lib/cn";
import type { FinanceProductType } from "@/types/finance";

const OPTIONS = [
  { id: "hp" as const, label: "Hire Purchase" },
  { id: "pcp" as const, label: "Personal Contract Purchase" },
];

export function FinanceTypeSelector({
  value,
  onChange,
  pcpEnabled = true,
}: {
  value: FinanceProductType;
  onChange: (value: FinanceProductType) => void;
  pcpEnabled?: boolean;
}) {
  const options = pcpEnabled ? OPTIONS : OPTIONS.filter((option) => option.id === "hp");

  return (
    <fieldset>
      <legend className="text-label" id="finance-type-label">
        Finance type
      </legend>
      <div
        role="radiogroup"
        aria-labelledby="finance-type-label"
        className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "min-h-11 rounded-md border px-3 py-2 text-button",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border-strong bg-surface text-ink hover:bg-page",
              )}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
