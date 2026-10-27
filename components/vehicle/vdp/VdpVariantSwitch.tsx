"use client";

import { cn } from "@/lib/cn";
import { useVdpVariant } from "@/components/vehicle/vdp/VdpVariantProvider";
import type { VdpLayoutVariant } from "@/lib/vdp/variant";

const options: Array<{ id: VdpLayoutVariant; label: string }> = [
  { id: 1, label: "Current page" },
  { id: 2, label: "New page" },
];

export function VdpVariantSwitch() {
  const { variant, setVariant, switchEnabled } = useVdpVariant();

  if (!switchEnabled) {
    return null;
  }

  return (
    <div className="bg-page px-[var(--oak-page-x)] pt-4">
      <div className="mx-auto flex w-full max-w-[var(--oak-width-wide)] justify-center">
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-[0_8px_20px_rgba(16,40,72,0.08)]">
          <div className="flex" role="group" aria-label="Car detail page design">
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
                onClick={() => setVariant(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
