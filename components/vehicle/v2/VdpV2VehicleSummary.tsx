"use client";

import { VdpV2CashPriceBlock } from "@/components/vehicle/v2/VdpV2CashPriceBlock";
import { VdpV2TitleAndSpecs } from "@/components/vehicle/v2/VdpV2TitleAndSpecs";
import type { VehicleDetail } from "@/types/vehicle-detail";

/** Desktop sidebar summary (title, specs, cash price). */
export function VdpV2VehicleSummary({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <div className="min-w-0">
      <VdpV2TitleAndSpecs vehicle={vehicle} />
      <VdpV2CashPriceBlock />
    </div>
  );
}
