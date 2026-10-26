"use client";

import { cn } from "@/lib/cn";
import { useVdpVariant } from "@/components/vehicle/vdp/VdpVariantProvider";

export function VdpVariantSwitch() {
  const { variant, setVariant, switchEnabled } = useVdpVariant();

  if (!switchEnabled) {
    return null;
  }

  return (
    <div
      className="pointer-events-auto fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] left-[max(0.75rem,env(safe-area-inset-left,0px))] z-[55] max-w-[min(100vw-1.5rem,20rem)] rounded-xl border border-border bg-surface p-2 shadow-lg max-lg:bottom-auto max-lg:left-auto max-lg:right-[max(0.75rem,env(safe-area-inset-right,0px))] max-lg:top-[calc(var(--oak-header-height)+0.5rem)]"
      role="region"
      aria-label="Car detail page design variant (development only)"
    >
      <p className="px-1 pb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">
        Dev: CDP variant
      </p>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          className={cn(
            "min-h-11 rounded-lg px-3 py-2 text-left text-body-sm font-medium",
            variant === 1 ? "bg-primary text-white" : "bg-page-tint text-ink hover:bg-page",
          )}
          aria-pressed={variant === 1}
          onClick={() => setVariant(1)}
        >
          Variant 1 — Current design
        </button>
        <button
          type="button"
          className={cn(
            "min-h-11 rounded-lg px-3 py-2 text-left text-body-sm font-medium",
            variant === 2 ? "bg-primary text-white" : "bg-page-tint text-ink hover:bg-page",
          )}
          aria-pressed={variant === 2}
          onClick={() => setVariant(2)}
        >
          Variant 2 — Mobile CDP
        </button>
      </div>
    </div>
  );
}
