"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_UPDATING } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";

export function DealMonthlyBar() {
  const { calculation, phase } = useDealBuilder();
  const updating = phase === "RECALCULATING";

  return (
    <div className="rounded-lg border border-border bg-primary-soft px-4 py-3">
      <p className="text-caption text-muted">Estimated monthly payment</p>
      <FinancialNumber
        value={formatPounds(calculation?.monthlyPayment ?? 0)}
        suffix="/month"
        size="md"
        className="text-primary"
      />
      {updating ? (
        <p className="text-caption text-muted" role="status">
          {DEAL_UPDATING}
        </p>
      ) : null}
    </div>
  );
}
