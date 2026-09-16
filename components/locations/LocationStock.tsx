"use client";

import { VehicleCard } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Grid } from "@/components/layout/Container";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getLocationStockUrl, getUsedCarsUrl, getVehicleUrl, routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import type { Vehicle } from "@/types/vehicle";

export function LocationStock({
  locationSlug,
  locationName,
  vehicles,
}: {
  locationSlug: string;
  locationName: string;
  vehicles: Vehicle[];
}) {
  const finance = useCustomerFinance();
  const monthly = (vehicle: Vehicle) =>
    getIllustratedMonthly(vehicle, finance.deposit, finance.term);
  const href = getLocationStockUrl(locationSlug);
  const preview = vehicles.slice(0, 4);

  return (
    <section aria-labelledby="location-stock-heading">
      <h2 id="location-stock-heading" className="text-h3">
        Available vehicles
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Cars listed at Oakwood {locationName}. Monthly figures are representative
        until you have a finance profile.
      </p>
      {preview.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="No cars listed at this location right now."
          actions={
            <>
              <Button href={getUsedCarsUrl()}>Browse all cars</Button>
              <Button href={routes.getAQuote} variant="secondary">
                Request a car
              </Button>
            </>
          }
        >
          You can browse the full Oakwood range, or tell us what you&apos;re looking
          for.
        </EmptyState>
      ) : (
        <Grid columns="featured" className="mt-6">
          {preview.map((vehicle) => (
            <VehicleCard
              key={vehicle.stockId}
              vehicle={vehicle}
              monthly={monthly(vehicle)}
              state={getFinanceDisplayState(
                finance.mode,
                vehicle.cashPrice,
                finance.maxAdvance,
                finance.deposit,
              )}
              action={
                <Button
                  href={getVehicleUrl(vehicle)}
                  className="w-full"
                  onClick={() =>
                    trackEvent(analyticsEvents.locationStockClicked, {
                      location: locationSlug,
                      stockId: vehicle.stockId,
                    })
                  }
                >
                  View car
                </Button>
              }
            />
          ))}
        </Grid>
      )}
      {preview.length > 0 ? (
        <p className="mt-6">
          <Button
            href={href}
            onClick={() =>
              trackEvent(analyticsEvents.locationStockClicked, {
                location: locationSlug,
              })
            }
          >
            View cars
          </Button>
        </p>
      ) : null}
    </section>
  );
}
