"use client";

import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { DealCta } from "@/components/deal/DealSummary";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_UPDATING } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function DealBuilderMobileCTA() {
  const { calculation, phase, vehicleUnavailable } = useDealBuilder();
  const updating = phase === "RECALCULATING";

  if (vehicleUnavailable) {
    return (
      <StickyActionBar>
        <DealCta />
      </StickyActionBar>
    );
  }

  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-3">
        <div className={cn("min-w-0", updating && "opacity-60")}>
          <p className="text-caption text-muted">Estimated monthly payment</p>
          <FinancialNumber
            value={formatPounds(calculation?.monthlyPayment ?? 0)}
            suffix="/month"
            size="sm"
            className="text-primary"
          />
          {updating ? (
            <p className="text-caption text-muted" role="status">
              {DEAL_UPDATING}
            </p>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <DealCta />
        </div>
      </div>
    </StickyActionBar>
  );
}
