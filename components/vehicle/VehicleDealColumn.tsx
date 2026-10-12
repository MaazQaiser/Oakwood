"use client";

import { FinanceControls } from "@/components/vehicle/FinanceControls";
import { PartExchange } from "@/components/vehicle/PartExchange";

export function VehicleDealColumn() {
  return (
    <div className="vdp-hero__deal flex min-w-0 flex-col gap-3">
      <FinanceControls />
      <PartExchange />
    </div>
  );
}
