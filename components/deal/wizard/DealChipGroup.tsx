"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DealChipOption<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * Single-select chip row backed by native radio inputs, so arrow keys,
 * focus and screen-reader semantics come from the browser.
 */
export function DealChipGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
  columns,
  hint,
  aside,
}: {
  label: string;
  value?: T;
  options: DealChipOption<T>[];
  onChange: (value: T) => void;
  /** Equal-width grid columns. Defaults to the option count, max 4. */
  columns?: 2 | 3 | 4 | 6;
  hint?: ReactNode;
  /** Right-aligned note on the label row, e.g. "HP 24–84 · PCP 24–60". */
  aside?: ReactNode;
}) {
  const name = useId();
  const hintId = `${name}-hint`;
  const cols =
    columns ?? (Math.min(4, Math.max(2, options.length)) as 2 | 3 | 4);

  return (
    <fieldset aria-describedby={hint ? hintId : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <legend className="text-label">{label}</legend>
        {aside ? (
          <span className="text-caption text-muted">{aside}</span>
        ) : null}
      </div>
      <div
        className={cn(
          "mt-2 grid gap-2",
          cols === 2 && "grid-cols-2",
          cols === 3 && "grid-cols-3",
          cols === 4 && "grid-cols-4",
          cols === 6 && "grid-cols-3 sm:grid-cols-6",
        )}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={String(option.value)}
              className={cn(
                "relative block",
                option.disabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                className="peer sr-only"
                checked={selected}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
              />
              <span
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-[14px] border px-2 text-center text-body-sm transition-colors",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                  // Home page toggle language: soft resting chip, solid blue when on.
                  // Exclusive states: `cn` doesn't dedupe conflicting utilities.
                  selected
                    ? "border-primary bg-primary font-semibold! text-white shadow-[0_6px_16px_rgb(0_97_162/0.22)]"
                    : option.disabled
                      ? "border-dashed border-border-strong bg-surface text-subtle"
                      : "border-transparent bg-page-tint text-ink hover:bg-surface-soft",
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-caption text-muted">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}
