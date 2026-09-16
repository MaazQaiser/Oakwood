"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PxDealDrawer } from "@/components/part-exchange/PxDealDrawer";
import { PxEquitySummary } from "@/components/part-exchange/PxEquitySummary";
import { PX_EDIT, PX_REMOVE } from "@/lib/part-exchange/copy";
import { formatNumber } from "@/lib/format/money";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { CALCULATOR_PX_CTA } from "@/lib/finance/calculator-copy";
import type { DealPartExchangeInput } from "@/types/deal";
import type { CalculatorVehicle } from "@/features/finance/calculator/types";

export function CalculatorPartExchange({
  vehicle,
  px,
  equity,
  negativeEquity,
  onApplied,
  onClear,
}: {
  vehicle?: CalculatorVehicle;
  px?: DealPartExchangeInput;
  equity: number;
  negativeEquity: number;
  onApplied: (px: DealPartExchangeInput) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="calculator-px-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="calculator-px-heading" className="text-h3">
        Part exchange
      </h2>
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
            shortfall={negativeEquity}
            equityType={
              negativeEquity > 0 ? "negative" : equity > 0 ? "positive" : "none"
            }
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setOpen(true)}>
              {PX_EDIT}
            </Button>
            <Button variant="text" className="px-0" onClick={onClear}>
              {PX_REMOVE}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-1 text-body-sm text-muted">
            Use your current car towards the deposit. Valuation uses the existing
            part-exchange journey.
          </p>
          <div className="mt-5">
            <Button
              onClick={() => {
                trackEvent(analyticsEvents.pxStarted, {
                  source: vehicle ? "vdp" : "standalone",
                  stockId: vehicle?.stockId,
                });
                setOpen(true);
              }}
            >
              {CALCULATOR_PX_CTA}
            </Button>
          </div>
        </>
      )}
      <PxDealDrawer
        open={open}
        initialPx={px}
        consideredStockId={vehicle?.stockId}
        onClose={() => setOpen(false)}
        onApplied={onApplied}
      />
    </section>
  );
}
