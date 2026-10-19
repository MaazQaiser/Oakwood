"use client";

import { useId, type ReactNode } from "react";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { listSelectedProducts } from "@/lib/deal/products";
import { formatNumber, formatPounds, formatTerm } from "@/lib/format/money";

function Row({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right tabular-number">{children}</dd>
    </div>
  );
}

/** Deal summary shared across Step 4 hub and action panels. */
export function DealStep4Summary({ title = "Your deal" }: { title?: string }) {
  const { vehicle, draft, calculation, coverMonthly, apr } = useDealBuilder();
  const headingId = useId();
  const products = listSelectedProducts(draft.productIds);
  const vehicleDetail = [
    vehicle.derivative,
    `${formatNumber(vehicle.mileage)} miles`,
    vehicle.locationName,
  ]
    .filter(Boolean)
    .join(" · ");
  const financeLine = [
    draft.financeType.toUpperCase(),
    formatTerm(draft.term),
    apr !== undefined ? `${apr.toFixed(1)}% APR est.` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      className="rounded-card bg-surface p-5 shadow-card sm:p-6"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="text-label">
        {title}
      </h2>
      <dl className="mt-3 space-y-1.5 text-body-sm">
        <Row label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
          {formatPounds(vehicle.cashPrice)}
        </Row>
        <div>
          <dt className="sr-only">Vehicle details</dt>
          <dd className="text-caption text-muted">{vehicleDetail}</dd>
        </div>
        {draft.px ? (
          <Row label="Part exchange">
            −{formatPounds(calculation?.pxEquity ?? 0)}
          </Row>
        ) : null}
        <Row label="Cash deposit">{formatPounds(draft.cashDeposit)}</Row>
        <Row label="Finance">{financeLine}</Row>
        <Row label="Optional products">
          {products.length ? `+${formatPounds(coverMonthly)}/mo` : "None"}
        </Row>
        {products.length ? (
          <div>
            <dt className="sr-only">Selected products</dt>
            <dd>
              <ul className="space-y-0.5 text-caption text-muted">
                {products.map((product) => (
                  <li key={product.id}>{product.name}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
        <span className="text-label">Estimated monthly</span>
        <FinancialNumber
          value={formatPounds(calculation?.monthlyPayment ?? 0)}
          suffix="/mo"
          size="compact"
        />
      </div>
    </section>
  );
}
