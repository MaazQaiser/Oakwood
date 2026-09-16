"use client";

import { Grid } from "@/components/layout/Container";
import { VehicleCard } from "@/components/cards/Card";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { Button } from "@/components/ui/Button";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { EmptyState } from "@/components/ui/Feedback";
import { getUsedCarsUrl, getVehicleUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import type { Vehicle } from "@/types/vehicle";

export function SimilarVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const finance = useCustomerFinance();

  if (vehicles.length === 0) {
    return (
      <section id="similar-cars" aria-labelledby="similar-cars-heading" className="scroll-mt-24">
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
    <section id="similar-cars" aria-labelledby="similar-cars-heading" className="scroll-mt-24">
      <h2 id="similar-cars-heading" className="text-h3">
        Similar cars
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Not quite the right car? Take a look at these.
      </p>
      <div className="mt-6">
        <Grid columns="featured">
          {vehicles.map((vehicle) => {
            const state = getFinanceDisplayState(
              finance.mode,
              vehicle.cashPrice,
              finance.maxAdvance,
              finance.deposit,
            );
            const gapAmount =
              state === "ineligible"
                ? getDepositGap(
                    vehicle.cashPrice,
                    finance.maxAdvance,
                    finance.deposit,
                  )
                : undefined;

            return (
              <VehicleCard
                key={vehicle.stockId}
                vehicle={vehicle}
                monthly={getIllustratedMonthly(
                  vehicle,
                  finance.deposit,
                  finance.term,
                )}
                state={state}
                gapAmount={gapAmount}
                imagePriority={false}
                toolbar={
                  <SaveVehicleButton
                    vehicleName={`${vehicle.make} ${vehicle.model}`}
                    stockId={vehicle.stockId}
                  />
                }
                action={
                  <Button
                    href={getVehicleUrl(vehicle)}
                    className="w-full"
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
            );
          })}
        </Grid>
      </div>
    </section>
  );
}
