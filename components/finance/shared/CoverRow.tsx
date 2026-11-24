"use client";

import { COVER_YEAR_OPTIONS } from "@/lib/finance/negative-equity/constants";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export interface CoverRowProps {
  id: string;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  /** Years selected when enabled. Omit for products with no term (Supagard). */
  years?: number;
  hasTerm?: boolean;
  onToggle: () => void;
  onYearsChange?: (years: number) => void;
}

export function CoverRow({
  id,
  name,
  description,
  price,
  enabled,
  years = 3,
  hasTerm = true,
  onToggle,
  onYearsChange,
}: CoverRowProps) {
  return (
    <div className="border-b border-[#E7EEF4] py-3.5 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold leading-snug text-[#002852]">
            {name}
          </p>
          <p className="mt-0.5 text-sm leading-snug text-muted">{description}</p>
        </div>
        {enabled ? (
          <p className="min-w-[3.25rem] flex-none text-right text-lg font-semibold tabular-nums tracking-[-0.02em] text-[#002852]">
            {formatPounds(price)}
          </p>
        ) : null}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`${enabled ? "Remove" : "Add"} ${name}`}
          data-cover-id={id}
          onClick={onToggle}
          className={cn(
            "relative mt-0.5 h-5 w-9 flex-none rounded-full transition-colors",
            enabled ? "bg-[#002852]" : "bg-[#D0D5DD]",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
              enabled && "translate-x-4",
            )}
          />
        </button>
      </div>
      {enabled && hasTerm ? (
        <div className="mt-3 flex gap-2" role="group" aria-label={`${name} term`}>
          {COVER_YEAR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={years === option}
              onClick={() => onYearsChange?.(option)}
              className={cn(
                "min-h-10 flex-1 rounded-[12px] text-sm font-semibold",
                years === option
                  ? "bg-[#002852] text-white"
                  : "bg-[#ECF3F8] text-[#002852]",
              )}
            >
              {option} {option === 1 ? "year" : "years"}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
