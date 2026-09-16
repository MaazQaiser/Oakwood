"use client";

import { useId, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { StripePaymentElement } from "@/components/reservation/StripePaymentElement";
import { ReservationProcessing } from "@/components/reservation/ReservationProcessing";
import { submitReservationPaymentAction } from "@/features/reservation/actions";
import {
  getDealUrl,
  getReserveUrl,
  supportRoutes,
} from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { reservationCopy, payBelowCopy, payHeadingCopy } from "@/lib/reservation/copy";
import { payAndReserveLabel, reservationAmountLabel } from "@/lib/reservation/format";
import { formatPounds } from "@/lib/format/money";
import type { ReservationPageModel } from "@/features/reservation/load";

function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

export function ReservationPayment({ model }: { model: ReservationPageModel }) {
  const router = useRouter();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, startTransition] = useTransition();
  const [processing, setProcessing] = useState(false);
  const idempotencyKey = useMemo(() => createIdempotencyKey(), []);
  const vehicle = model.vehicle;
  const amountLabel = reservationAmountLabel(model.amount);

  if (!vehicle) {
    return null;
  }

  const stockId = vehicle.stockId;

  if (processing) {
    return <ReservationProcessing label={reservationCopy.processing} />;
  }

  function submit() {
    if (submitting || processing) {
      return;
    }
    setError(null);
    trackEvent(analyticsEvents.reservationPaymentSubmitted, {
      stockId,
    });
    setProcessing(true);
    startTransition(() => {
      void submitReservationPaymentAction({ email, idempotencyKey }).then(
        (result) => {
          if (!result.ok) {
            setProcessing(false);
            if (result.reason === "conflict") {
              trackEvent(analyticsEvents.reservationConcurrentConflict, {
                stockId,
              });
              setError(reservationCopy.concurrent);
              return;
            }
            if (result.reason === "unavailable") {
              setError(reservationCopy.soldHeading);
              return;
            }
            if (result.reason === "invalid_email") {
              setError("Enter a valid email address so we can send your confirmation.");
              return;
            }
            setError("We could not start payment. Try again.");
            return;
          }
          if (result.status.paymentFailed) {
            trackEvent(analyticsEvents.reservationPaymentFailed, {
              stockId,
            });
            router.push(getReserveUrl(stockId, "failed"));
            return;
          }
          trackEvent(analyticsEvents.reservationPaymentSucceeded, {
            stockId,
          });
          router.push(getReserveUrl(stockId, "success"));
        },
      );
    });
  }

  return (
    <section aria-labelledby="reservation-payment-heading">
      <h1 id="reservation-payment-heading" className="text-h2">
        {payHeadingCopy(model.amount)}
      </h1>
      <p className="mt-2 text-body">{reservationCopy.payAbove}</p>
      <dl className="mt-5 space-y-2 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Vehicle</dt>
          <dd>{formatPounds(vehicle.cashPrice)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Reservation</dt>
          <dd>{amountLabel}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-label">{reservationCopy.amountPayableToday}</dt>
          <dd className="text-label">{amountLabel}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <label htmlFor={emailId} className="text-label">
          Email for confirmation
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-body"
        />
      </div>

      <div className="mt-6">
        <StripePaymentElement
          wallets={model.stripe.wallets}
          connected={model.stripe.connected}
        />
      </div>

      {error ? (
        <div className="mt-4">
          <Alert title={error} tone="warning">
            {error === reservationCopy.concurrent ? (
              <Button href={`${getReserveUrl(vehicle.stockId)}#similar`} size="sm">
                View similar cars
              </Button>
            ) : null}
          </Alert>
        </div>
      ) : null}

      <p className="mt-4 text-body-sm text-muted">
        {payBelowCopy(model.holdDurationDays)}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={submit}
          busy={submitting || processing}
          disabled={model.dealChanged}
        >
          {payAndReserveLabel(model.amount)}
        </Button>
        {model.dealSnapshot ? (
          <Button href={getDealUrl(model.dealSnapshot.dealId)} variant="secondary">
            Return to deal
          </Button>
        ) : (
          <Button href={getReserveUrl(vehicle.stockId)} variant="secondary">
            Back
          </Button>
        )}
        <Button href={supportRoutes.bookingEnquiry} variant="text">
          Contact Oakwood
        </Button>
      </div>
    </section>
  );
}
