"use client";

import { Button } from "@/components/ui/Button";
import { SimilarVehicles } from "@/components/vehicle/SimilarVehicles";
import { reservationCopy } from "@/lib/reservation/copy";
import { getDealUrl, getReserveUrl, supportRoutes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { ReservationPageModel } from "@/features/reservation/load";

export function PaymentError({ model }: { model: ReservationPageModel }) {
  const stockId = model.vehicle?.stockId;
  const dealHref = model.dealSnapshot
    ? getDealUrl(model.dealSnapshot.dealId)
    : stockId
      ? getReserveUrl(stockId)
      : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">{reservationCopy.paymentFailedHeading}</h1>
        <p className="mt-2 text-body">{reservationCopy.notReserved}</p>
      </header>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {stockId ? (
          <Button href={getReserveUrl(stockId, "payment")}>Try payment again</Button>
        ) : null}
        {dealHref ? (
          <Button href={dealHref} variant="secondary">
            Return to deal
          </Button>
        ) : null}
        <Button
          href={supportRoutes.bookingEnquiry}
          variant="tertiary"
          onClick={() =>
            trackEvent(analyticsEvents.reservationContactClicked, {
              channel: "enquiry",
            })
          }
        >
          Contact Oakwood
        </Button>
      </div>
      {model.similar.length ? <SimilarVehicles vehicles={model.similar} /> : null}
    </div>
  );
}
