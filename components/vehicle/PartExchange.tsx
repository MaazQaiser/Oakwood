"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
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
      id="part-exchange"
      aria-labelledby="part-exchange-heading"
      className="scroll-mt-24"
    >
      <Accordion title="Part exchange" id="part-exchange-heading">
        <p>See how much your car could contribute to your deposit.</p>
        {px ? (
        <div className="mt-4 space-y-4">
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
        <p className="mt-3">
          <Button
            variant="text"
            className="px-0"
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
        </p>
      )}
      </Accordion>
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
