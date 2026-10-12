"use client";

import { cn } from "@/lib/cn";
import type { HomeHeroVariant } from "@/lib/home/hero-variant";

const options: Array<{ id: HomeHeroVariant; label: string }> = [
  { id: "current", label: "Current hero" },
  { id: "filters", label: "Filter hero" },
];

export function HeroVariantToggle({
  variant,
  onChange,
}: {
  variant: HomeHeroVariant;
  onChange: (variant: HomeHeroVariant) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-border bg-white p-1 shadow-[0_12px_32px_rgba(16,40,72,0.18)]">
      <div className="flex" role="group" aria-label="Hero variation">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={cn(
              "min-h-10 rounded-full px-4 text-sm font-semibold whitespace-nowrap",
              variant === option.id
                ? "bg-[#002852] text-white"
                : "bg-transparent text-[#002852]",
            )}
            aria-pressed={variant === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
