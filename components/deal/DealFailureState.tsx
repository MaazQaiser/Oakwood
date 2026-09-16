"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { VehicleCard } from "@/components/cards/Card";
import { useDealBuilderOptional } from "@/components/deal/DealBuilderProvider";
import {
  DEAL_CALCULATION_UNAVAILABLE,
  DEAL_SESSION_EXPIRED,
  DEAL_VEHICLE_UNAVAILABLE,
} from "@/lib/deal/copy";
import { getEligibilityUrl, getUsedCarsUrl, supportRoutes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";

export function DealFailureState({
  kind,
}: {
  kind: "session" | "vehicle" | "calculation" | "provider";
}) {
  const deal = useDealBuilderOptional();

  if (kind === "session") {
    return (
      <Alert title={DEAL_SESSION_EXPIRED} tone="warning">
        Save a new deal from the vehicle page, or check eligibility again.
        <div className="mt-3 flex flex-wrap gap-2">
          <Button href={getUsedCarsUrl()} size="sm">
            Browse cars
          </Button>
          <Button href={getEligibilityUrl()} variant="secondary" size="sm">
            Check my eligibility
          </Button>
        </div>
      </Alert>
    );
  }

  if (kind === "vehicle") {
    return (
      <div>
        <Alert title={DEAL_VEHICLE_UNAVAILABLE} tone="info">
          You can look at similar cars, or browse the full range.
          <div className="mt-3">
            <Button href={getUsedCarsUrl()} size="sm">
              View similar cars
            </Button>
          </div>
        </Alert>
        {deal?.similar.length ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {deal.similar.map((vehicle) => (
              <li key={vehicle.stockId}>
                <VehicleCard vehicle={vehicle} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  const telephone = deal?.contact.telephone;
  const retry = deal?.retryCalculation;

  return (
    <Alert title={DEAL_CALCULATION_UNAVAILABLE} tone="warning">
      You can try again, save this deal, or contact Oakwood.
      <div className="mt-3 flex flex-wrap gap-2">
        {retry ? (
          <Button size="sm" onClick={retry}>
            Try again
          </Button>
        ) : null}
        <Button href={supportRoutes.bookingEnquiry} variant="secondary" size="sm">
          Contact Oakwood
        </Button>
        {telephone ? (
          <Button href={toTelHref(telephone)} variant="text" size="sm">
            Call {telephone}
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}
