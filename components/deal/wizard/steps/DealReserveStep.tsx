"use client";

import { useId, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { reservationConfig } from "@/config/reservation";
import { supportRoutes } from "@/config/routes";
import {
  DEAL_EMAIL_DEAL,
  DEAL_HANDOVER_WITHIN,
} from "@/lib/deal/copy";
import { listSelectedProducts } from "@/lib/deal/products";
import { formatPounds, formatTerm } from "@/lib/format/money";
import {
  payAndReserveLabel,
  reservationAmountLabel,
} from "@/lib/reservation/format";

const HANDOVER = {
  name: "Sam Wright",
  role: "Customer handover",
  photo: "/images/vehicle-placeholder.svg",
};

export function DealReserveStep() {
  const {
    vehicle,
    draft,
    calculation,
    dealId,
  } = useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, startTransition] = useTransition();
  const products = listSelectedProducts(draft.productIds);
  const amountLabel = reservationAmountLabel(reservationConfig.amount);

  const canPay =
    name.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length >= 10;

  function pay() {
    if (!canPay) {
      setError("Enter your name, email and phone to continue.");
      return;
    }
    setError(null);
    startTransition(() => {
      window.setTimeout(() => {
        setConfirmed(true);
      }, 900);
    });
  }

  const idempotency = useMemo(
    () => `${dealId}-${vehicle.stockId}-reserve`,
    [dealId, vehicle.stockId],
  );

  if (confirmed) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-page p-4">
          <p className="text-caption text-muted">Reservation confirmed</p>
          <h2 className="mt-1 text-h3">You&apos;re all set</h2>
          <p className="mt-2 text-body-sm text-muted">{DEAL_HANDOVER_WITHIN}</p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-page">
            <Image
              src={HANDOVER.photo}
              alt={HANDOVER.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <p className="text-label">{HANDOVER.name}</p>
            <p className="text-caption text-muted">{HANDOVER.role}</p>
          </div>
        </div>

        <div className="space-y-2 text-body-sm">
          <p className="text-label">What happens next</p>
          <ol className="list-decimal space-y-1 pl-5 text-muted">
            <li>We call you within 20 minutes to confirm the reservation.</li>
            <li>We finalise part exchange and paperwork.</li>
            <li>You collect or arrange delivery for the reserved car.</li>
          </ol>
        </div>

        <div className="space-y-2">
          <div className="rounded-md border border-border p-3">
            <p className="text-label">{DEAL_EMAIL_DEAL}</p>
            <SaveDeal />
          </div>
          <Button
            href={supportRoutes.bookingEnquiry}
            variant="secondary"
            className="w-full"
          >
            Request a callback
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border bg-page p-4 space-y-2 text-body-sm">
        <p className="text-label">Deal summary</p>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Car</span>
          <span className="text-right">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Part exchange</span>
          <span>
            {draft.px
              ? formatPounds(calculation?.pxEquity ?? 0)
              : "Skipped"}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Cash deposit</span>
          <span>{formatPounds(draft.cashDeposit)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Total deposit</span>
          <span>{formatPounds(calculation?.totalDeposit ?? draft.cashDeposit)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Term</span>
          <span>
            {formatTerm(draft.term)} {draft.financeType.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Cover</span>
          <span className="text-right">
            {products.length
              ? products.map((item) => item.name).join(", ")
              : "None"}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Monthly</span>
          <FinancialNumber
            value={formatPounds(calculation?.monthlyPayment ?? 0)}
            size="sm"
          />
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Total payable</span>
          <span>{formatPounds(calculation?.totalPayable ?? 0)}</span>
        </div>
      </div>

      <div className="rounded-md border border-border p-4">
        <p className="text-label">
          {amountLabel} refundable reservation
        </p>
        <p className="mt-1 text-body-sm text-muted">
          Held for {reservationConfig.holdDurationDays} days. Fully refundable
          and applied to your purchase.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          busy={submitting}
          onClick={pay}
        >
          Apple Pay
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          busy={submitting}
          onClick={pay}
        >
          Google Pay
        </Button>
      </div>

      <div className="space-y-3 rounded-md border border-border p-4">
        <p className="text-label">Or pay by card</p>
        <label className="block" htmlFor={nameId}>
          <span className="text-label">Name</span>
          <input
            id={nameId}
            className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="block" htmlFor={emailId}>
          <span className="text-label">Email</span>
          <input
            id={emailId}
            type="email"
            className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block" htmlFor={phoneId}>
          <span className="text-label">Phone</span>
          <input
            id={phoneId}
            type="tel"
            className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
            value={phone}
            autoComplete="tel"
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <div className="rounded-md border border-dashed border-border-strong bg-page px-3 py-4 text-body-sm text-muted">
          Card details (mock Stripe field) · ref {idempotency.slice(0, 12)}
        </div>
        {error ? <Alert tone="warning" title={error} /> : null}
        <Button
          type="button"
          className="w-full"
          busy={submitting}
          disabled={!canPay}
          onClick={pay}
        >
          {payAndReserveLabel(reservationConfig.amount)}
        </Button>
      </div>

      <DealStepFooter
        onBack={() => goBack("quote")}
        onContinue={pay}
        continueLabel={payAndReserveLabel(reservationConfig.amount)}
        continueDisabled={!canPay}
        busy={submitting}
      />
    </div>
  );
}
