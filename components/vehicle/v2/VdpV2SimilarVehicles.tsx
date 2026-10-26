"use client";

import { VehicleCard } from "@/components/cards/Card";
import { CompareVehicleButton } from "@/components/vehicle/CompareVehicleButton";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { useOptionalVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getUsedCarsUrl, getVehicleUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import type { Vehicle } from "@/types/vehicle";

export function VdpV2SimilarVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const finance = useCustomerFinance();
  const deal = useOptionalVehicleDeal();
  const priceView = deal?.priceView ?? "monthly";

  if (vehicles.length === 0) {
    return (
      <section
        id="similar-cars"
        aria-labelledby="similar-cars-heading"
        className="vdp-v2__section scroll-mt-24 lg:px-0"
      >
        <EmptyState
          title="No similar cars to show right now."
          actions={<Button href={getUsedCarsUrl()}>Browse all cars</Button>}
        >
          You can still browse the full Oakwood range.
        </EmptyState>
      </section>
    );
  }

  return (
    <section
      id="similar-cars"
      aria-labelledby="similar-cars-heading"
      className="vdp-v2__section scroll-mt-24 lg:px-0"
    >
      <h2 id="similar-cars-heading" className="vdp-v2__heading">
        Similar cars
      </h2>
      <p className="mt-1.5 text-[13px] leading-[18px] text-[#68778B]">
        Swipe to compare more options.
      </p>
      <ul className="mt-3 flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
        {vehicles.map((vehicle) => {
          const state = getFinanceDisplayState(
            finance.mode,
            vehicle.cashPrice,
            finance.maxAdvance,
            finance.deposit,
          );
          const gapAmount =
            state === "ineligible"
              ? getDepositGap(vehicle.cashPrice, finance.maxAdvance, finance.deposit)
              : undefined;

          return (
            <li
              key={vehicle.stockId}
              className="w-[min(85vw,240px)] min-w-[220px] max-w-[260px] shrink-0 snap-start"
            >
              <div className="overflow-hidden rounded-xl border border-[#DCE4ED] bg-white">
                <VehicleCard
                  vehicle={vehicle}
                  monthly={getIllustratedMonthly(vehicle, finance.deposit, finance.term)}
                  state={state}
                  gapAmount={gapAmount}
                  imagePriority={false}
                  term={finance.term}
                  priceView={priceView}
                  toolbar={
                    <div className="flex items-center gap-2">
                      <CompareVehicleButton
                        vehicleName={`${vehicle.make} ${vehicle.model}`}
                        stockId={vehicle.stockId}
                        category={vehicle.category}
                      />
                      <SaveVehicleButton
                        vehicleName={`${vehicle.make} ${vehicle.model}`}
                        stockId={vehicle.stockId}
                        category={vehicle.category}
                      />
                    </div>
                  }
                  onOpen={() =>
                    trackEvent(analyticsEvents.similarVehicleClicked, {
                      stockId: vehicle.stockId,
                    })
                  }
                  action={
                    <Button
                      href={getVehicleUrl(vehicle)}
                      className="btn-compact min-h-11 w-full rounded-lg"
                      onClick={() =>
                        trackEvent(analyticsEvents.similarVehicleClicked, {
                          stockId: vehicle.stockId,
                        })
                      }
                    >
                      View car
                    </Button>
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
