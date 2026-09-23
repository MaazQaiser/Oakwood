"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { ReservationVehicleSummary } from "@/components/reservation/ReservationVehicleSummary";
import { RefundConfirmation } from "@/components/reservation/RefundConfirmation";
import { ReservationExpired } from "@/components/reservation/ReservationExpired";
import { ReservationUnavailable } from "@/components/reservation/ReservationUnavailable";
import { ReservationError } from "@/components/reservation/ReservationError";
import { lookupReservationAction } from "@/features/reservation/actions";
import type { ReservationPageModel } from "@/features/reservation/load";
import {
  getDealUrl,
  getEligibilityUrl,
  getReserveUrl,
  getVehicleUrl,
  supportRoutes,
} from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { reservationCopy } from "@/lib/reservation/copy";
import {
  formatReservationDate,
  reservationAmountLabel,
} from "@/lib/reservation/format";

function statusLabel(model: ReservationPageModel): string {
  if (model.financeAllRoutesUnavailable) {
    return "Refund in progress";
  }
  switch (model.stockState) {
    case "reserved":
      return "Reserved";
    case "refund_requested":
      return "Refund requested";
    case "refunded":
      return "Refunded";
    case "expired":
      return "Expired";
    case "sold":
      return "No longer available";
    case "reconciliation":
      return "Being reviewed";
    default:
      return "Available";
  }
}

function paymentLabel(model: ReservationPageModel): string {
  switch (model.paymentState) {
    case "paid":
      return `${reservationAmountLabel(model.amount)} paid`;
    case "refund_pending":
      return "Refund pending";
    case "refunded":
      return "Refunded";
    case "failed":
      return "Payment failed";
    default:
      return "Payment pending";
  }
}

function LookupForm({ stockId }: { stockId?: string }) {
  const emailId = useId();
  const refId = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-surface p-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => {
          void lookupReservationAction({ email, reference }).then((result) => {
            if (!result.ok) {
              setError("We could not find that reservation.");
              return;
            }
            if (stockId) {
              router.refresh();
            }
          });
        });
      }}
    >
      <h2 className="text-h3">Find your reservation</h2>
      <p className="text-body-sm text-muted">{reservationCopy.lookupMissing}</p>
      <div>
        <label htmlFor={emailId} className="text-label">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-md border border-border px-3 py-3 text-sm"
        />
      </div>
      <div>
        <label htmlFor={refId} className="text-label">
          Reservation reference
        </label>
        <input
          id={refId}
          required
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          className="mt-2 w-full rounded-md border border-border px-3 py-3 text-sm"
        />
      </div>
      {error ? <Alert title={error} tone="warning" /> : null}
      <Button type="submit" disabled={pending}>
        View reservation
      </Button>
    </form>
  );
}

export function ReservationStatus({ model }: { model: ReservationPageModel }) {
  if (!model.reservationId) {
    return <LookupForm stockId={model.vehicle?.stockId} />;
  }

  if (model.reconciliationRequired) {
    return <ReservationError model={model} />;
  }

  if (model.phase === "EXPIRED") {
    return <ReservationExpired model={model} />;
  }

  if (model.phase === "SOLD" || model.phase === "UNAVAILABLE") {
    return (
      <ReservationUnavailable
        model={model}
        variant={model.phase === "SOLD" ? "sold" : "unavailable"}
      />
    );
  }

  if (model.phase === "REFUND_REQUESTED" || model.phase === "REFUNDED") {
    if (model.financeAllRoutesUnavailable) {
      return (
        <div className="space-y-6">
          <Alert title={reservationCopy.financeUnavailableHeading} tone="info">
            {reservationCopy.financeUnavailableSupporting}
          </Alert>
          <RefundConfirmation model={model} />
        </div>
      );
    }
    return <RefundConfirmation model={model} />;
  }

  const vehicle = model.vehicle;
  const purchaseHref = model.dealSnapshot
    ? getDealUrl(model.dealSnapshot.dealId, "application")
    : getEligibilityUrl();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">Your reservation</h1>
        <p className="mt-2">
          <Badge tone="success">{statusLabel(model)}</Badge>
        </p>
      </header>
      {vehicle ? (
        <ReservationVehicleSummary
          vehicle={vehicle}
          amount={model.amount}
          holdDurationDays={model.holdDurationDays}
        />
      ) : null}
      <section className="rounded-lg border border-border bg-surface p-4 md:p-5">
        <h2 className="text-h3">Reservation status</h2>
        <dl className="mt-4 space-y-2 text-body-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Status</dt>
            <dd>{statusLabel(model)}</dd>
          </div>
          {model.reservedAtIso ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reserved</dt>
              <dd>{formatReservationDate(model.reservedAtIso)}</dd>
            </div>
          ) : null}
          {model.expiresAtIso ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Held until</dt>
              <dd>{formatReservationDate(model.expiresAtIso)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reservation amount</dt>
            <dd>{reservationAmountLabel(model.amount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Payment status</dt>
            <dd>{paymentLabel(model)}</dd>
          </div>
          {model.appliedToPurchase ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Purchase</dt>
              <dd>Applied to purchase</dd>
            </div>
          ) : null}
          {model.reference ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reference</dt>
              <dd>{model.reference}</dd>
            </div>
          ) : null}
        </dl>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          href={purchaseHref}
          onClick={() =>
            trackEvent(analyticsEvents.reservationApplicationStarted, {
              stockId: vehicle?.stockId,
            })
          }
        >
          Continue your purchase
        </Button>
        {vehicle && model.phase === "RESERVED" ? (
          <Button
            href={getReserveUrl(vehicle.stockId, "refund")}
            variant="secondary"
          >
            Request a refund
          </Button>
        ) : null}
        {vehicle ? (
          <Button href={getVehicleUrl(vehicle)} variant="tertiary">
            View vehicle
          </Button>
        ) : null}
        <Button href={supportRoutes.bookingEnquiry} variant="text">
          Contact Oakwood
        </Button>
      </div>
    </div>
  );
}
