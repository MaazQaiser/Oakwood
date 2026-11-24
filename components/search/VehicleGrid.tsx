"use client";

import type { ReactNode } from "react";
import { Grid } from "@/components/layout/Container";
import { VehicleCard } from "@/components/cards/Card";
import { Card } from "@/components/cards/Card";
import { FinanceRateCta } from "@/components/finance/FinanceRateCta";
import { Skeleton } from "@/components/ui/Loading";
import { CompareVehicleButton } from "@/components/vehicle/CompareVehicleButton";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { Button } from "@/components/ui/Button";
import { getVehicleUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { getVanSearchEvents } from "@/features/vans/analytics";
import type { CustomerFinanceMode } from "@/features/eligibility/CustomerFinanceProvider";
import type { ListingPriceView } from "@/lib/vehicles/searchCopy";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

/** Insert the rate CTA after this many cars (1-based). */
const RATE_CTA_AFTER = 6;

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
  priceView = "monthly",
  showRateCta = true,
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
  priceView?: ListingPriceView;
  /** Full rate CTA after the sixth result. Off for grids that already have one elsewhere. */
  showRateCta?: boolean;
}) {
  const items: ReactNode[] = [];

  vehicles.forEach((vehicle, index) => {
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

    const trackView = () => {
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
    };

    items.push(
      <VehicleCard
        key={vehicle.stockId}
        vehicle={vehicle}
        onOpen={trackView}
        monthly={getIllustratedMonthly(vehicle, deposit, term)}
        priceView={priceView}
        state={state}
        gapAmount={gapAmount}
        imagePriority={index < 4}
        term={term}
        toolbar={
          <div className="flex items-center gap-2">
            <CompareVehicleButton
              vehicleName={`${vehicle.make} ${vehicle.model}`}
              stockId={vehicle.stockId}
              category={category}
            />
            <SaveVehicleButton
              vehicleName={`${vehicle.make} ${vehicle.model}`}
              stockId={vehicle.stockId}
              category={category}
            />
          </div>
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
        copyInset
        action={
          <Button
            href={getVehicleUrl(vehicle)}
            className="btn-compact w-full pl-6!"
            onClick={trackView}
          >
            {viewLabel}
          </Button>
        }
      />,
    );

    if (showRateCta && index + 1 === RATE_CTA_AFTER) {
      items.push(
        <div key="finance-rate-cta" className="col-span-full">
          <FinanceRateCta variant="full" source="search_inline" />
        </div>,
      );
    }
  });

  return <Grid columns="listing">{items}</Grid>;
}

export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Grid columns="listing">
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
