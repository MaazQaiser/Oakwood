"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Field, Input } from "@/components/forms/FormControls";
import { StripePaymentElement } from "@/components/reservation/StripePaymentElement";
import { ReservationProcessing } from "@/components/reservation/ReservationProcessing";
import { submitReservationPaymentAction } from "@/features/reservation/actions";
import { routes, getDealUrl, getReserveUrl, supportRoutes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { emailError, telephoneError } from "@/lib/aftersales/validation";
import {
  payBelowCopy,
  payHeadingCopy,
  reservationCopy,
} from "@/lib/reservation/copy";
import {
  payAndReserveLabel,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { formatPounds } from "@/lib/format/money";
import type { ReservationPageModel } from "@/features/reservation/load";

export function ReservationPayment({ model }: { model: ReservationPageModel }) {
  const router = useRouter();
  const emailId = useId();
  const nameId = useId();
  const phoneId = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nameMessage, setNameMessage] = useState<string>();
  const [emailMessage, setEmailMessage] = useState<string>();
  const [phoneMessage, setPhoneMessage] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, startTransition] = useTransition();
  const [processing, setProcessing] = useState(false);
  const vehicle = model.vehicle;
  const amountLabel = reservationAmountLabel(model.amount);

  if (!vehicle) {
    return null;
  }

  const stockId = vehicle.stockId;
  const busy = submitting || processing;

  function contactReady() {
    const nextName = name.trim().length < 2 ? "Enter your name." : undefined;
    const nextEmail = emailError(email);
    const nextPhone = telephoneError(telephone);
    setNameMessage(nextName);
    setEmailMessage(nextEmail);
    setPhoneMessage(nextPhone);
    return !nextName && !nextEmail && !nextPhone;
  }

  function pay() {
    if (busy) {
      return;
    }
    setError(null);
    if (!contactReady()) {
      return;
    }
    trackEvent(analyticsEvents.reservationPaymentSubmitted, { stockId });
    setProcessing(true);
    startTransition(() => {
      void submitReservationPaymentAction({ email, name, telephone }).then(
        (result) => {
          setProcessing(false);
          if (!result.ok) {
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
              setEmailMessage("Enter a valid email address.");
              return;
            }
            if (result.reason === "invalid_contact") {
              setError("Enter your name and a phone number.");
              return;
            }
            if (result.reason === "stripe_unavailable") {
              trackEvent(analyticsEvents.reservationPaymentFailed, { stockId });
              setError(reservationCopy.stripeUnavailable);
              return;
            }
            setError(reservationCopy.stripeUnavailable);
            return;
          }
          if (
            result.status.phase === "RESERVED" &&
            result.status.paymentState === "paid"
          ) {
            trackEvent(analyticsEvents.reservationPaymentSucceeded, { stockId });
            router.push(getReserveUrl(stockId, "success"));
            return;
          }
          if (result.status.paymentFailed) {
            trackEvent(analyticsEvents.reservationPaymentFailed, { stockId });
            router.push(getReserveUrl(stockId, "failed"));
            return;
          }
          setError(reservationCopy.notReserved);
        },
      );
    });
  }

  if (processing) {
    return <ReservationProcessing label={reservationCopy.processing} />;
  }

  return (
    <section aria-labelledby="reservation-payment-heading">
      <p className="oak-eyebrow">Reserve this car</p>
      <h1 id="reservation-payment-heading" className="mt-2 text-h2 text-navy">
        {payHeadingCopy(model.amount)}
      </h1>
      <p className="mt-2 text-body-sm text-secondary">{reservationCopy.payAbove}</p>

      <dl className="mt-5 space-y-2 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Vehicle</dt>
          <dd>{formatPounds(vehicle.cashPrice)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Reservation</dt>
          <dd>{amountLabel} · refundable</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-label">{reservationCopy.amountPayableToday}</dt>
          <dd className="text-label">{amountLabel}</dd>
        </div>
      </dl>

      <div className="mt-6 space-y-4">
        <Field htmlFor={nameId} label="Name" error={nameMessage}>
          <Input
            id={nameId}
            name="name"
            autoComplete="name"
            value={name}
            error={Boolean(nameMessage)}
            onChange={(event) => {
              setName(event.target.value);
              setNameMessage(undefined);
            }}
          />
        </Field>
        <Field htmlFor={phoneId} label="Mobile number" error={phoneMessage}>
          <Input
            id={phoneId}
            name="tel"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={telephone}
            error={Boolean(phoneMessage)}
            onChange={(event) => {
              setTelephone(event.target.value);
              setPhoneMessage(undefined);
            }}
          />
        </Field>
        <Field htmlFor={emailId} label="Email for confirmation" error={emailMessage}>
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            error={Boolean(emailMessage)}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailMessage(undefined);
            }}
          />
        </Field>
      </div>

      <div className="mt-6">
        <StripePaymentElement
          wallets={model.stripe.wallets}
          connected={model.stripe.connected}
          busy={busy || model.dealChanged}
          onWallet={() => pay()}
        />
      </div>

      {error ? (
        <div className="mt-4">
          <Alert title={error} tone="warning">
            <p>{reservationCopy.notReserved}</p>
            {error === reservationCopy.concurrent ? (
              <Button href={`${getReserveUrl(vehicle.stockId)}#similar`} size="sm">
                View similar cars
              </Button>
            ) : (
              <Button size="sm" onClick={() => pay()}>
                Try again
              </Button>
            )}
          </Alert>
        </div>
      ) : null}

      <p className="mt-4 text-body-sm text-muted">
        {reservationCopy.paymentReassurance} {payBelowCopy(model.holdDurationDays)}
      </p>
      <p className="mt-2 text-body-sm">
        <Link
          href={routes.reservationTerms}
          className="text-primary underline-offset-4 hover:underline"
        >
          Reservation terms
        </Link>
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={() => pay()}
          busy={busy}
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
