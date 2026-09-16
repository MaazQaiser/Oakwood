"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SimilarVehicles } from "@/components/vehicle/SimilarVehicles";
import { ReservationVehicleSummary } from "@/components/reservation/ReservationVehicleSummary";
import { reservationCopy } from "@/lib/reservation/copy";
import { getUsedCarsUrl, getVehicleUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { ReservationPageModel } from "@/features/reservation/load";

export function ReservationExpired({ model }: { model: ReservationPageModel }) {
  const vehicle = model.vehicle;

  useEffect(() => {
    trackEvent(analyticsEvents.reservationExpired, {
      stockId: vehicle?.stockId,
    });
  }, [vehicle?.stockId]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">{reservationCopy.expiredHeading}</h1>
        <p className="mt-2 text-body">{reservationCopy.expiredSupporting}</p>
      </header>
      {vehicle ? (
        <ReservationVehicleSummary
          vehicle={vehicle}
          amount={model.amount}
          holdDurationDays={model.holdDurationDays}
        />
      ) : null}
      <div className="flex flex-wrap gap-3">
        {vehicle ? (
          <Button href={getVehicleUrl(vehicle)}>View vehicle</Button>
        ) : null}
        <Button href={`${getUsedCarsUrl()}#similar-cars`} variant="secondary">
          Browse similar cars
        </Button>
      </div>
      {model.similar.length ? <SimilarVehicles vehicles={model.similar} /> : null}
    </div>
  );
}
