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

  const monthly = calculation?.monthlyPayment ?? 0;

  return (
    <section
      className="rounded-card bg-surface p-5 shadow-card sm:p-6"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-muted"
      >
        {title}
      </h2>
      <p className="mt-2">
        <FinancialNumber
          value={formatPounds(monthly)}
          suffix="/mo"
          size="lg"
          className="text-navy"
        />
      </p>
      <p className="mt-1 text-caption text-muted">Illustrative monthly payment</p>
      <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-body-sm">
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
    </section>
  );
}
