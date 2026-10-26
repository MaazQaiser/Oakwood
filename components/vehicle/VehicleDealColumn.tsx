"use client";

import { FinanceControls } from "@/components/vehicle/FinanceControls";

export function VehicleDealColumn() {
  return (
    <div className="vdp-hero__deal flex min-w-0 flex-col gap-3">
      <FinanceControls />
    </div>
  );
}
