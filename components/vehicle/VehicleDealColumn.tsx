"use client";

import { FinanceControls } from "@/components/vehicle/FinanceControls";
import { PartExchange } from "@/components/vehicle/PartExchange";
import { ReservationCTA } from "@/components/vehicle/ReservationCTA";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";

export function VehicleDealColumn() {
  const { reservable } = useVehicleDeal();

  return (
    <div className="vdp-hero__deal flex min-w-0 flex-col gap-6">
      {reservable ? <ReservationCTA hidePrimaryOnMobile /> : null}
      {reservable ? (
        <div className="rounded-3xl bg-[#8EBFDF] p-6 text-[#002852] md:p-8">
          <h2 className="text-h3">Build your deal</h2>
          <p className="mt-2 text-body-sm">
            Continue with this car. Your deposit, term and monthly figure carry
            through.
          </p>
          <div className="mt-4">
            <StartVehicleDealButton className="w-full sm:w-auto" />
          </div>
        </div>
      ) : null}
      <FinanceControls />
      <PartExchange />
    </div>
  );
}
