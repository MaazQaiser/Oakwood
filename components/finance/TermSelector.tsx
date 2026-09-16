"use client";

import { cn } from "@/lib/cn";
import { formatTerm } from "@/lib/format/money";

export function TermSelector({
  value,
  options,
  maxTerm,
  onChange,
}: {
  value: number;
  options: readonly number[];
  maxTerm: number;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-label" id="term-label">
        Term
      </legend>
      <div
        role="radiogroup"
        aria-labelledby="term-label"
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = value === option;
          const available = option <= maxTerm;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={!available}
              className={cn(
                "min-h-11 rounded-md border px-3 text-button",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border-strong bg-surface text-ink hover:bg-page",
                !available && "opacity-60",
              )}
              onClick={() => {
                if (available) {
                  onChange(option);
                }
              }}
            >
              {formatTerm(option)}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-caption text-muted">
        Choose a term yourself. We never extend it automatically.
      </p>
    </fieldset>
  );
}
