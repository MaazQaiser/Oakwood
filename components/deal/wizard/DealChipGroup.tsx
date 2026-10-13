"use client";

import { cn } from "@/lib/cn";

export function DealChipGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const labelId = `chip-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <fieldset>
      <legend className="text-label" id={labelId}>
        {label}
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "min-h-11 rounded-md border px-3 text-button",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border-strong bg-surface text-ink hover:bg-page",
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
