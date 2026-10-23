"use client";

import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { listSelectedProducts } from "@/lib/deal/products";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { cn } from "@/lib/cn";

/**
 * Sticky deal summary for the embedded application.
 * Never surfaces bank details or licence numbers.
 */
export function ApplicationDealSummary({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { vehicle, draft } = useDealBuilder();
  const products = listSelectedProducts(draft.productIds);
  const financeLine = [draft.financeType.toUpperCase(), formatTerm(draft.term)]
    .filter(Boolean)
    .join(" · ");

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-xl bg-navy px-4 py-3 text-white shadow-card",
          className,
        )}
      >
        <p className="text-caption text-white/70">Your deal</p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-body-sm font-semibold!">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <span className="shrink-0 text-body-sm font-semibold!">
            {formatPounds(vehicle.cashPrice)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-caption text-white/65">
          {financeLine}
        </p>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-card bg-surface p-5 shadow-card sm:p-6",
        className,
      )}
      aria-labelledby="app-deal-summary"
    >
      <h2 id="app-deal-summary" className="text-label">
        Your deal
      </h2>
      <p className="mt-3 text-body-sm font-semibold! text-ink">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </p>
      <p className="text-caption text-muted">
        {[
          vehicle.derivative,
          `${vehicle.mileage.toLocaleString("en-GB")} miles`,
          vehicle.locationName,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <dl className="mt-4 space-y-2 text-body-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cash price</dt>
          <dd>{formatPounds(vehicle.cashPrice)}</dd>
        </div>
        {draft.px?.registration ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Part exchange</dt>
            <dd>{draft.px.registration}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cash deposit</dt>
          <dd>{formatPounds(draft.cashDeposit)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Finance</dt>
          <dd className="text-right">{financeLine}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Optional products</dt>
          <dd className="text-right">
            {products.length
              ? products.map((product) => product.name).join(", ")
              : "None"}
          </dd>
        </div>
        {products.length ? (
          <ul className="space-y-0.5 text-caption text-muted">
            {products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        ) : null}
      </dl>

      <p className="mt-4 border-t border-border pt-3 text-caption text-muted">
        Confirmed when you apply.
      </p>
    </aside>
  );
}
