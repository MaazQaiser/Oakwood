"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { PxDealDrawer } from "@/components/part-exchange/PxDealDrawer";
import { PxEquitySummary } from "@/components/part-exchange/PxEquitySummary";
import { PX_EDIT, PX_REMOVE } from "@/lib/part-exchange/copy";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function PartExchange() {
  const { px, applyPartExchange, clearPartExchange, extraDeposit, negativeEquity, vehicle } =
    useVehicleDeal();
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="part-exchange-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="part-exchange-heading" className="text-h3">
        Part exchange your current car
      </h2>
      <p className="mt-1 text-body-sm text-muted">
        See how much your car could contribute to your deposit.
      </p>
      {px ? (
        <div className="mt-5 space-y-4">
          <PxEquitySummary
            estimatedValue={px.value}
            settlementFigure={px.settlement ?? 0}
            equity={extraDeposit}
            shortfall={negativeEquity}
            equityType={
              negativeEquity > 0
                ? "negative"
                : extraDeposit > 0
                  ? "positive"
                  : "none"
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
                trackEvent(analyticsEvents.pxRemoved, {
                  stockId: vehicle.stockId,
                });
              }}
            >
              {PX_REMOVE}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <Button
            onClick={() => {
              trackEvent(analyticsEvents.pxStarted, {
                source: "vdp",
                stockId: vehicle.stockId,
              });
              setOpen(true);
            }}
          >
            Get my valuation
          </Button>
        </div>
      )}
      <PxDealDrawer
        open={open}
        initialPx={px}
        consideredStockId={vehicle.stockId}
        vdp
        onClose={() => setOpen(false)}
        onApplied={(next) => {
          applyPartExchange({
            registration: next.registration,
            mileage: next.mileage,
            value: next.value,
            settlement: next.settlement,
          });
        }}
      />
    </section>
  );
}
