"use client";

import { Grid } from "@/components/layout/Container";
import { VehicleCard } from "@/components/cards/Card";
import { Card } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Loading";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { Button } from "@/components/ui/Button";
import { getVehicleUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { getVanSearchEvents } from "@/features/vans/analytics";
import type { CustomerFinanceMode } from "@/features/eligibility/CustomerFinanceProvider";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export function VehicleGrid({
  vehicles,
  financeMode,
  maxAdvance,
  deposit = 0,
  term = 48,
  onAdjustDeposit,
  onViewAffordable,
  category = "car",
  viewLabel = "View car",
  affordableLabel = "View affordable cars",
}: {
  vehicles: Vehicle[];
  financeMode: CustomerFinanceMode;
  maxAdvance: number;
  deposit?: number;
  term?: number;
  onAdjustDeposit: () => void;
  onViewAffordable: () => void;
  category?: VehicleCategory;
  viewLabel?: string;
  affordableLabel?: string;
}) {
  return (
    <Grid columns="featured">
      {vehicles.map((vehicle, index) => {
        const state = getFinanceDisplayState(
          financeMode,
          vehicle.cashPrice,
          maxAdvance,
          deposit,
        );
        const gapAmount =
          state === "ineligible"
            ? getDepositGap(vehicle.cashPrice, maxAdvance, deposit)
            : undefined;

        return (
          <VehicleCard
            key={vehicle.stockId}
            vehicle={vehicle}
            monthly={getIllustratedMonthly(vehicle, deposit, term)}
            state={state}
            gapAmount={gapAmount}
            imagePriority={index < 4}
            toolbar={
              <SaveVehicleButton
                vehicleName={`${vehicle.make} ${vehicle.model}`}
                stockId={vehicle.stockId}
                category={category}
              />
            }
            financeActions={
              state === "ineligible" ? (
                <div className="flex flex-wrap gap-2">
                  <Button variant="text" onClick={onAdjustDeposit}>
                    Adjust deposit
                  </Button>
                  <Button variant="text" onClick={onViewAffordable}>
                    {affordableLabel}
                  </Button>
                </div>
              ) : null
            }
            action={
              <Button
                href={getVehicleUrl(vehicle)}
                className="w-full"
                onClick={() => {
                  trackEvent(analyticsEvents.vehicleViewed, {
                    stockId: vehicle.stockId,
                    category,
                  });
                  const vanEvents = getVanSearchEvents(category);
                  if (vanEvents) {
                    trackEvent(vanEvents.resultClicked, {
                      stockId: vehicle.stockId,
                    });
                  }
                }}
              >
                {viewLabel}
              </Button>
            }
          />
        );
      })}
    </Grid>
  );
}

export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Grid columns="featured">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} className="flex flex-col gap-4">
          <Skeleton className="aspect-[16/10] h-auto w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-11 w-full" />
        </Card>
      ))}
    </Grid>
  );
}
