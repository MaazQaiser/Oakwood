"use client";

import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_UPDATING } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";

/** Navy "money moment" card, matching the home page's dark panels. */
export function DealMonthlyBar() {
  const { calculation, phase, apr } = useDealBuilder();
  const updating = phase === "RECALCULATING";

  return (
    <div className="rounded-[20px] bg-navy px-4 py-4 text-white">
      <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
        {apr !== undefined ? "Your monthly" : "Indicative monthly"}
      </p>
      <p className="financial-number financial-number--compact mt-1.5 text-white">
        {formatPounds(calculation?.monthlyPayment ?? 0)}
        <span className="text-body-sm font-normal tracking-normal text-white/70">
          /mo
        </span>
      </p>
      <p className="mt-1 text-caption text-white/70" role="status">
        {updating
          ? DEAL_UPDATING
          : apr !== undefined
            ? `${apr.toFixed(1)}% APR · decision in principle`
            : "Updates as you build"}
      </p>
    </div>
  );
}
