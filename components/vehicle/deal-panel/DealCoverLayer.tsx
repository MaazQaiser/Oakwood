"use client";

import { useMemo, useState } from "react";
import { MOCK_OPTIONAL_PRODUCTS } from "@/lib/deal/products";
import { formatPounds } from "@/lib/format/money";
import { IconChevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function DealCoverLayer() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );

  return (
    <details
      className="group rounded-[24px] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4]"
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-body font-semibold text-[#002852] md:px-6 [&::-webkit-details-marker]:hidden">
        <span>
          Add cover
          <span className="ml-2 text-body-sm font-normal text-muted">
            {selectedCount === 0
              ? "None selected"
              : `${selectedCount} selected`}
          </span>
        </span>
        <span
          aria-hidden
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-[10px] transition",
            open ? "bg-[#002852] text-white" : "bg-[#ECF3F8] text-[#002852]",
          )}
        >
          <IconChevron className={open ? "rotate-180" : undefined} />
        </span>
      </summary>
      <div className="space-y-3 border-t border-[#E7EEF4] px-5 py-5 md:px-6">
        {MOCK_OPTIONAL_PRODUCTS.map((product) => {
          const on = Boolean(selected[product.id]);
          return (
            <label
              key={product.id}
              className={cn(
                "flex cursor-pointer gap-3 rounded-[16px] border px-4 py-3",
                on ? "border-primary bg-[#ECF3F8]" : "border-[#E7EEF4] bg-[#F7FAFC]",
              )}
            >
              <input
                type="checkbox"
                className="mt-1 accent-primary"
                checked={on}
                onChange={() =>
                  setSelected((current) => ({
                    ...current,
                    [product.id]: !current[product.id],
                  }))
                }
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-ink">{product.name}</span>
                  <span className="text-body-sm font-semibold tabular-nums text-primary">
                    {formatPounds(product.price)}
                  </span>
                </span>
                <span className="mt-1 block text-body-sm text-muted">
                  {product.summary}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </details>
  );
}
