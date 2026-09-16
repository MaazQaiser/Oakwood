"use client";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { reservationConfig } from "@/config/reservation";
import { getUsedCarsUrl, routes } from "@/config/routes";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { reservationCopy } from "@/lib/reservation/copy";

export function ReservationCTA({
  hidePrimaryOnMobile = false,
}: {
  hidePrimaryOnMobile?: boolean;
}) {
  const { vehicle, reservable } = useVehicleDeal();
  const amount = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod(reservationConfig.holdDurationDays);

  if (vehicle.availability === "reserved") {
    return <ReservedVehicleNotice />;
  }

  if (!reservable) {
    return vehicle.availability === "sold" ? (
      <SoldVehicleNotice />
    ) : (
      <UnavailableVehicleNotice />
    );
  }

  return (
    <section
      aria-labelledby="reservation-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="reservation-heading" className="text-h3">
        Reserve this car for {amount}
      </h2>
        <p className="mt-2 text-body-sm text-muted">
          {reservationCopy.fullyRefundable}. Holds the vehicle for {hold}.
        </p>
        <p className="mt-3">
          <a
            href={routes.reservationTerms}
            className="text-body-sm text-primary underline-offset-4 hover:underline"
          >
            Reservation terms
          </a>
          {" · "}
          <a
            href={routes.cancellationRefund}
            className="text-body-sm text-primary underline-offset-4 hover:underline"
          >
            Cancellation and refund
          </a>
        </p>
      <div className={hidePrimaryOnMobile ? "mt-4 hidden lg:block" : "mt-4"}>
        <StartReservationButton
          stockId={vehicle.stockId}
          className="w-full sm:w-auto"
        />
        <p className="mt-2 text-caption text-muted">
          {reservationCopy.fullyRefundable}
          {` · ${hold} hold`}
        </p>
      </div>
    </section>
  );
}

export function SoldVehicleNotice({
  browseHref = getUsedCarsUrl(),
}: {
  browseHref?: string;
}) {
  return (
    <Alert title="This car has been sold." tone="info">
      This listing is kept so you can still compare it with similar stock.
      <div className="mt-3 flex flex-wrap gap-2">
        <Button href="#similar-cars" variant="secondary">
          View similar cars
        </Button>
        <Button href={browseHref}>Browse all cars</Button>
      </div>
    </Alert>
  );
}

export function ReservedVehicleNotice({
  browseHref = getUsedCarsUrl(),
}: {
  browseHref?: string;
}) {
  return (
    <Alert title="This car is reserved." tone="warning">
      It is currently held for another customer, so it is not available to reserve
      right now. You can still look at the details, or browse similar cars.
      <div className="mt-3 flex flex-wrap gap-2">
        <Button href="#similar-cars" variant="secondary">
          View similar cars
        </Button>
        <Button href={browseHref}>Browse all cars</Button>
      </div>
    </Alert>
  );
}

export function UnavailableVehicleNotice({
  browseHref = getUsedCarsUrl(),
}: {
  browseHref?: string;
}) {
  return (
    <Alert title="This vehicle is temporarily unavailable." tone="info">
      You can still look at similar cars, or browse the full range.
      <div className="mt-3 flex flex-wrap gap-2">
        <Button href="#similar-cars" variant="secondary">
          View similar cars
        </Button>
        <Button href={browseHref}>Browse all cars</Button>
      </div>
    </Alert>
  );
}
