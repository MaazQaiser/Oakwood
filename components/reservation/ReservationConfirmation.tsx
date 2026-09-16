"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ReservationProcessing } from "@/components/reservation/ReservationProcessing";
import { ReservationError } from "@/components/reservation/ReservationError";
import { ReservationVehicleSummary } from "@/components/reservation/ReservationVehicleSummary";
import { pollReservationAction } from "@/features/reservation/actions";
import type { ReservationPageModel } from "@/features/reservation/load";
import type { ReservationStatusSnapshot } from "@/features/reservation/status";
import { reservationConfig } from "@/config/reservation";
import {
  getDealUrl,
  getEligibilityUrl,
  getReserveUrl,
  supportRoutes,
} from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { reservationCopy } from "@/lib/reservation/copy";
import {
  formatReservationDate,
  reservationAmountLabel,
} from "@/lib/reservation/format";

function mergeStatus(
  model: ReservationPageModel,
  status: ReservationStatusSnapshot,
): ReservationPageModel {
  return {
    ...model,
    phase: status.phase,
    stockState: status.stockState,
    paymentState: status.paymentState,
    reference: status.reference,
    reservedAtIso: status.reservedAtIso,
    expiresAtIso: status.expiresAtIso,
    refundRequestedAtIso: status.refundRequestedAtIso,
    financeAllRoutesUnavailable: status.financeAllRoutesUnavailable,
    reconciliationRequired: status.reconciliationRequired,
    paymentFailed: status.paymentFailed,
    confirming: status.confirming,
  };
}

export function ReservationConfirmation({
  model,
}: {
  model: ReservationPageModel;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(model);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!model.confirming && !model.paymentFailed && model.phase !== "PROCESSING") {
      if (model.phase === "RESERVED") {
        trackEvent(analyticsEvents.reservationConfirmed, {
          stockId: model.vehicle?.stockId,
        });
      }
      return;
    }

    const started = Date.now();
    let cancelled = false;
    const tick = () => {
      void pollReservationAction().then((result) => {
        if (cancelled || !result || "reason" in result) {
          return;
        }
        setCurrent((prev) => mergeStatus(prev, result));
        if (result.paymentFailed) {
          trackEvent(analyticsEvents.reservationPaymentFailed, {
            stockId: model.vehicle?.stockId,
          });
          router.replace(getReserveUrl(model.vehicle?.stockId ?? "", "failed"));
          return;
        }
        if (result.phase === "RESERVED") {
          trackEvent(analyticsEvents.reservationConfirmed, {
            stockId: model.vehicle?.stockId,
          });
        }
        if (result.confirming && Date.now() - started > reservationConfig.confirmationTimeoutMs) {
          setTimedOut(true);
        }
        if (
          result.confirming &&
          Date.now() - started < reservationConfig.confirmationTimeoutMs + 30000
        ) {
          window.setTimeout(tick, 800);
        }
      });
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [model, router]);

  if (current.paymentFailed) {
    return null;
  }

  if (current.reconciliationRequired) {
    return <ReservationError model={current} />;
  }

  if (current.confirming || current.phase === "PROCESSING") {
    return (
      <div>
        <ReservationProcessing label={reservationCopy.confirming} />
        {timedOut ? (
          <p className="mt-4 text-body-sm text-muted" role="status">
            {reservationCopy.confirmingTimeout}
          </p>
        ) : null}
      </div>
    );
  }

  if (current.phase !== "RESERVED" || !current.vehicle) {
    return <ReservationError model={current} />;
  }

  const vehicle = current.vehicle;
  const purchaseHref = current.dealSnapshot
    ? getDealUrl(current.dealSnapshot.dealId, "application")
    : getEligibilityUrl();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">{reservationCopy.successHeading}</h1>
        <p className="mt-2 text-body">{reservationCopy.successSupporting}</p>
      </header>
      <ReservationVehicleSummary
        vehicle={vehicle}
        amount={current.amount}
        holdDurationDays={current.holdDurationDays}
      />
      <section className="rounded-lg border border-border bg-surface p-4 md:p-5">
        <dl className="space-y-2 text-body-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reservation amount</dt>
            <dd>{reservationAmountLabel(current.amount)}</dd>
          </div>
          {current.reservedAtIso ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reserved</dt>
              <dd>{formatReservationDate(current.reservedAtIso)}</dd>
            </div>
          ) : null}
          {current.expiresAtIso ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Held until</dt>
              <dd>{formatReservationDate(current.expiresAtIso)}</dd>
            </div>
          ) : null}
          {current.reference ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reservation reference</dt>
              <dd>{current.reference}</dd>
            </div>
          ) : (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reservation reference</dt>
              <dd>We&apos;ll confirm this shortly</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Location</dt>
            <dd>{vehicle.locationName}</dd>
          </div>
        </dl>
        {current.emailMasked ? (
          <p className="mt-4 text-body-sm">
            Confirmation sent to {current.emailMasked}
          </p>
        ) : null}
      </section>
      <section aria-labelledby="next-steps-heading">
        <h2 id="next-steps-heading" className="text-h3">
          What happens next?
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-body">
          <li>Your vehicle is now reserved.</li>
          <li>
            Your {reservationAmountLabel(current.amount)} reservation will be
            applied to the purchase.
          </li>
          <li>Complete your next steps with Oakwood.</li>
          <li>
            {current.expiresAtIso
              ? `Your reservation will expire on ${formatReservationDate(current.expiresAtIso)} unless the purchase progresses.`
              : "Your reservation will expire unless the purchase progresses."}
          </li>
        </ol>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          href={purchaseHref}
          onClick={() =>
            trackEvent(analyticsEvents.reservationApplicationStarted, {
              stockId: vehicle.stockId,
            })
          }
        >
          Continue your purchase
        </Button>
        <Button href={getReserveUrl(vehicle.stockId, "manage")} variant="secondary">
          View my reservation
        </Button>
        <Button
          href={supportRoutes.bookingEnquiry}
          variant="text"
          onClick={() =>
            trackEvent(analyticsEvents.reservationContactClicked, {
              channel: "enquiry",
            })
          }
        >
          Contact Oakwood
        </Button>
      </div>
    </div>
  );
}
