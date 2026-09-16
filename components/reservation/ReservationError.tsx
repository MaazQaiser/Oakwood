"use client";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { reservationCopy } from "@/lib/reservation/copy";
import { getReserveUrl, getUsedCarsUrl, supportRoutes } from "@/config/routes";
import type { ReservationPageModel } from "@/features/reservation/load";

export function ReservationError({ model }: { model: ReservationPageModel }) {
  const stockId = model.vehicle?.stockId;

  if (model.reconciliationRequired) {
    return (
      <Alert title={reservationCopy.reconciliation} tone="warning">
        <p>{reservationCopy.reconciliationSupport}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button href={supportRoutes.bookingEnquiry} size="sm">
            Contact Oakwood
          </Button>
          {stockId ? (
            <Button href={getReserveUrl(stockId, "manage")} variant="secondary" size="sm">
              View my reservation
            </Button>
          ) : null}
        </div>
      </Alert>
    );
  }

  return (
    <Alert title="We could not complete this reservation." tone="warning">
      Your vehicle has not been shown as reserved. You can try again or contact Oakwood.
      <div className="mt-3 flex flex-wrap gap-2">
        {stockId ? (
          <Button href={getReserveUrl(stockId, "payment")} size="sm">
            Try payment again
          </Button>
        ) : null}
        <Button href={getUsedCarsUrl()} variant="secondary" size="sm">
          Browse cars
        </Button>
      </div>
    </Alert>
  );
}
