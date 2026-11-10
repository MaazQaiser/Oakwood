"use client";

import { DealAdjustLayer } from "@/components/vehicle/deal-panel/DealAdjustLayer";
import { DealCoverLayer } from "@/components/vehicle/deal-panel/DealCoverLayer";
import { DealPaymentLayer } from "@/components/vehicle/deal-panel/DealPaymentLayer";

export function VehicleDealPanel({ listingClosed }: { listingClosed?: boolean }) {
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
  );
}
