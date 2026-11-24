"use client";

import { FinanceRateCta } from "@/components/finance/FinanceRateCta";
import { DealAdjustLayer } from "@/components/vehicle/deal-panel/DealAdjustLayer";
import { DealCoverLayer } from "@/components/vehicle/deal-panel/DealCoverLayer";
import { DealPaymentLayer } from "@/components/vehicle/deal-panel/DealPaymentLayer";
import { VehicleTalkCards } from "@/components/vehicle/VehicleTalkCards";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";

export function VehicleDealPanel({ listingClosed }: { listingClosed?: boolean }) {
  const { vehicle } = useVehicleDeal();

  if (listingClosed) {
    return (
      <div
        id="vdp-deal-panel"
        className="rounded-[20px] bg-[#ECF3F8] px-5 py-6 text-ink md:px-6"
      >
        <p className="text-body text-muted">
          This listing is kept available so you can still see the car and compare
          similar stock.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section id="vdp-deal-panel" aria-labelledby="make-it-a-deal-heading" className="flex flex-col gap-3">
        <h2
          id="make-it-a-deal-heading"
          className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-navy"
        >
          Make it a deal
        </h2>
      <DealPaymentLayer />
      <DealAdjustLayer />
      <DealCoverLayer />
    </section>
      <FinanceRateCta variant="compact" source="vdp_compact" />
      <VehicleTalkCards vehicle={vehicle} />
    </div>
  );
}
