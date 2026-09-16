"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { PxDealDrawer } from "@/components/part-exchange/PxDealDrawer";
import { PxEquitySummary } from "@/components/part-exchange/PxEquitySummary";
import { Alert } from "@/components/ui/Alert";
import { PX_DEAL_SUPPORT, PX_EDIT, PX_EQUITY_ADDED, PX_REMOVE } from "@/lib/part-exchange/copy";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function PartExchangeSection() {
  const { vehicle, draft, calculation, applyPartExchange, clearPartExchange } =
    useDealBuilder();
  const [open, setOpen] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string>();
  const px = draft.px;
  const negative = calculation?.pxNegativeEquity ?? 0;
  const equity = calculation?.pxEquity ?? 0;

  return (
    <section
      aria-labelledby="part-exchange-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="part-exchange-heading" className="text-h3">
        Part exchange
      </h2>
      {appliedNotice ? (
        <div className="mt-4">
          <Alert title={appliedNotice} tone="success" />
        </div>
      ) : null}
      {px ? (
        <div className="mt-4 space-y-4">
          <p className="text-body-sm text-muted">
            {px.vehicle
              ? `${px.vehicle.make} ${px.vehicle.model}`
              : px.registration}
            {` · ${formatNumber(px.mileage)} miles`}
          </p>
          <PxEquitySummary
            estimatedValue={px.value}
            settlementFigure={px.settlement ?? 0}
            equity={equity}
            shortfall={negative}
            equityType={
              negative > 0 ? "negative" : equity > 0 ? "positive" : "none"
            }
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setOpen(true)}>
              {PX_EDIT}
            </Button>
            <Button
              variant="text"
              className="px-0"
              onClick={() => {
                clearPartExchange();
                setAppliedNotice(undefined);
              }}
            >
              {PX_REMOVE}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-1 text-body-sm text-muted">{PX_DEAL_SUPPORT}</p>
          <div className="mt-5">
            <Button
              onClick={() => {
                trackEvent(analyticsEvents.pxStarted, {
                  source: "deal",
                  stockId: vehicle.stockId,
                });
                setOpen(true);
              }}
            >
              Get my valuation
            </Button>
          </div>
        </>
      )}
      <PxDealDrawer
        open={open}
        initialPx={px}
        consideredStockId={vehicle.stockId}
        onClose={() => setOpen(false)}
        onApplied={(next) => {
          applyPartExchange(next);
          const equity = next.value - (next.settlement ?? 0);
          setAppliedNotice(
            equity > 0 ? PX_EQUITY_ADDED(formatPounds(equity)) : undefined,
          );
        }}
      />
    </section>
  );
}
