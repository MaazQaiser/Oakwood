"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { reservationConfig } from "@/config/reservation";
import { supportRoutes } from "@/config/routes";
import {
  DEAL_EMAIL_DEAL,
  DEAL_HANDOVER_WITHIN,
  DEAL_RESERVE_SUCCESS_TITLE,
} from "@/lib/deal/copy";
import { listSelectedProducts } from "@/lib/deal/products";
import { formatPounds, formatTerm } from "@/lib/format/money";
import {
  formatHoldPeriod,
  payAndReserveLabel,
  reservationAmountLabel,
} from "@/lib/reservation/format";

/** Placeholder until ops confirm the named coordinator, photo and SLA (spec §7). */
const HANDOVER = {
  name: "Sam Wright",
  initials: "SW",
  role: "Customer handover",
  callbackMinutes: 20,
};

/** Mock reservation reference until Stripe/DMS confirm a real one. */
function mockReference(dealId: string, stockId: string): string {
  const seed = `${stockId}${dealId}`.replace(/[^a-zA-Z0-9]/g, "").slice(-6);
  return `OAK-${seed.toUpperCase() || "DEMO01"}`;
}

function formatCard(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
}

type Errors = Partial<
  Record<"name" | "email" | "phone" | "card" | "expiry" | "cvc", string>
>;

function Row({
  label,
  children,
  strong,
}: {
  label: string;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={strong ? "text-label" : "text-muted"}>{label}</dt>
      <dd className="text-right tabular-number">{children}</dd>
    </div>
  );
}

function Coordinator({ bordered = false }: { bordered?: boolean }) {
  return (
    <div
      className={
        bordered
          ? "flex items-center gap-3 rounded-card bg-surface p-5 shadow-card"
          : "flex items-center gap-3 rounded-[24px] bg-surface-soft p-4"
      }
    >
      <span
        aria-hidden
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-body-sm font-semibold! text-primary"
      >
        {HANDOVER.initials}
      </span>
      <div className="min-w-0">
        <p className="text-label">
          {HANDOVER.name} will call you in {HANDOVER.callbackMinutes} min
        </p>
        <p className="text-caption text-muted">
          {HANDOVER.role}. To confirm the car, answer questions and book your
          handover.
        </p>
      </div>
    </div>
  );
}

/** Vehicle, part exchange, deposit, cover and finance: before paying and on the confirmation. */
function DealReview({ title }: { title: string }) {
  const { vehicle, draft, calculation, coverMonthly, apr } = useDealBuilder();
  const headingId = useId();
  const products = listSelectedProducts(draft.productIds);
  const vehicleDetail = [
    vehicle.derivative,
    `${vehicle.mileage.toLocaleString("en-GB")} miles`,
  ]
    .filter(Boolean)
    .join(" · ");
  const financeLine = [
    draft.financeType.toUpperCase(),
    formatTerm(draft.term),
    apr !== undefined ? `${apr.toFixed(1)}% APR` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      className="rounded-card bg-surface p-5 shadow-card sm:p-6"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="text-label">
        {title}
      </h2>
      <dl className="mt-3 space-y-1.5 text-body-sm">
        <Row label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
          {formatPounds(vehicle.cashPrice)}
        </Row>
        <p className="text-caption text-muted">{vehicleDetail}</p>
        {draft.px ? (
          <Row label="Part exchange">
            −{formatPounds(calculation?.pxEquity ?? 0)}
          </Row>
        ) : null}
        <Row label="Cash deposit">{formatPounds(draft.cashDeposit)}</Row>
        <Row label="Cover">
          {products.length ? `+${formatPounds(coverMonthly)}/mo` : "None"}
        </Row>
        {products.length ? (
          <ul className="space-y-0.5 text-caption text-muted">
            {products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        ) : null}
        <p className="text-caption text-muted">{financeLine}</p>
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
        <span className="text-label">Monthly</span>
        <FinancialNumber
          value={formatPounds(calculation?.monthlyPayment ?? 0)}
          suffix="/mo"
          size="compact"
        />
      </div>
    </section>
  );
}

export function DealReserveStep() {
  const { vehicle, draft, dealId, markStepComplete, navigateTo } =
    useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const cardId = useId();
  const expiryId = useId();
  const cvcId = useId();
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  // Saved with the deal, so a reload keeps showing the confirmation.
  const [confirmed, setConfirmed] = useState(
    draft.stepsCompleted?.includes("reserve") ?? false,
  );
  const [emailOpen, setEmailOpen] = useState(false);
  // A transition ends before the mock timeout fires, so track it directly:
  // the Pay buttons must show busy and ignore repeat taps while processing.
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (confirmed) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [confirmed]);

  const clear = (key: keyof Errors) =>
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );
  const amountLabel = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod();
  const reference = useMemo(
    () => mockReference(dealId, vehicle.stockId),
    [dealId, vehicle.stockId],
  );

  function completeReservation() {
    setErrors({});
    if (submitting) {
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
      markStepComplete("reserve");
    }, 900);
  }

  function payByCard() {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter the name on your card.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a UK phone number so we can call you.";
    if (cardNumber.replace(/\D/g, "").length < 12)
      next.card = "Enter your card number.";
    if (expiry.replace(/\D/g, "").length !== 4) next.expiry = "Use MM / YY.";
    if (cvc.trim().length < 3) next.cvc = "3 or 4 digits.";
    setErrors(next);
    const order: [keyof Errors, string][] = [
      ["name", nameId],
      ["email", emailId],
      ["phone", phoneId],
      ["card", cardId],
      ["expiry", expiryId],
      ["cvc", cvcId],
    ];
    const first = order.find(([key]) => next[key]);
    if (first) {
      // The Pay button is in the sticky footer; take the customer to the problem.
      document.getElementById(first[1])?.focus();
    }
    if (Object.keys(next).length === 0) {
      completeReservation();
    }
  }

  if (confirmed) {
    const nextSteps = [
      {
        title: `Within ${HANDOVER.callbackMinutes} minutes`,
        body: `${HANDOVER.name} calls you to confirm the reservation.`,
      },
      {
        title: "Before collection",
        body: "We finalise your part exchange, finance and paperwork.",
      },
      {
        title: "Handover",
        body: `Collect the car from ${vehicle.locationName} or we arrange delivery.`,
      },
    ];

    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 pb-5">
          <DealResultHero
            eyebrow={DEAL_RESERVE_SUCCESS_TITLE}
            title="You're all set"
            body={DEAL_HANDOVER_WITHIN}
          >
            <div className="relative mt-5 rounded-[20px] bg-white/10 px-4 py-3.5">
              <p className="text-caption text-white/75">Reservation reference</p>
              <p className="mt-1 text-h5 tabular-number text-white">{reference}</p>
              <p className="mt-1 text-caption text-white/75">
                {amountLabel} paid. Your car is held for {hold}.
              </p>
            </div>
          </DealResultHero>

          <Coordinator bordered />

          <DealReview title="Your deal" />

          <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <p className="text-label">What happens next</p>
            <ol className="relative mt-3 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border">
              {nextSteps.map((item) => (
                <li key={item.title} className="relative pl-6">
                  <span className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-surface" />
                  <p className="text-body-sm font-semibold! text-ink">
                    {item.title}
                  </p>
                  <p className="text-caption text-muted">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {emailOpen ? (
            <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
              <p className="text-label">{DEAL_EMAIL_DEAL}</p>
              <SaveDeal defaultOpen compact />
            </div>
          ) : null}
        </div>

        {/* Same sticky action bar as every other step. */}
        <DealStepFooter
          showMonthly={false}
          onBack={emailOpen ? undefined : () => setEmailOpen(true)}
          backLabel={
            <>
              <span className="sm:hidden">Email deal</span>
              <span className="hidden sm:inline">{DEAL_EMAIL_DEAL}</span>
            </>
          }
          onContinue={() => navigateTo(supportRoutes.bookingEnquiry)}
          continueLabel="Request a callback"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <DealReview title="Review your deal" />

        <section
          className="rounded-card bg-surface p-5 shadow-card sm:p-6"
          aria-labelledby={`${cardId}-pay`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id={`${cardId}-pay`} className="text-label">
                Reserve for {amountLabel}
              </h2>
              <p className="mt-0.5 text-caption text-muted">
                Fully refundable reservation fee, applied to your purchase.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-page-tint px-2.5 py-1 text-caption text-muted">
              <Lock className="h-3 w-3" aria-hidden />
              Stripe
            </span>
          </div>
          <p className="mt-3 rounded-[14px] bg-page-tint px-4 py-3 text-body-sm">
            We hold this car for you for {hold} and take it off sale while
            you finish.
          </p>

          {/* Wallets first, stacked full width, as on Stripe Checkout. */}
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              className="flex min-h-12 items-center justify-center rounded-[14px] bg-black px-4 text-button text-white disabled:opacity-50"
              disabled={submitting}
              onClick={completeReservation}
            >
              Apple Pay
            </button>
            <button
              type="button"
              className="flex min-h-12 items-center justify-center rounded-[14px] bg-black px-4 text-button text-white disabled:opacity-50"
              disabled={submitting}
              onClick={completeReservation}
            >
              Google Pay
            </button>
          </div>

          <div className="my-4 flex items-center gap-3 text-caption text-muted">
            <span className="h-px flex-1 bg-border" />
            or pay with card
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <Field htmlFor={nameId} label="Name on card" error={errors.name}>
              <Input
                id={nameId}
                value={name}
                autoComplete="cc-name"
                error={Boolean(errors.name)}
                onChange={(event) => {
                  setName(event.target.value);
                  clear("name");
                }}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field htmlFor={emailId} label="Email" error={errors.email}>
                <Input
                  id={emailId}
                  type="email"
                  value={email}
                  autoComplete="email"
                  error={Boolean(errors.email)}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clear("email");
                  }}
                />
              </Field>
              <Field htmlFor={phoneId} label="Mobile" error={errors.phone}>
                <Input
                  id={phoneId}
                  type="tel"
                  value={phone}
                  autoComplete="tel"
                  error={Boolean(errors.phone)}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    clear("phone");
                  }}
                />
              </Field>
            </div>
            <Field htmlFor={cardId} label="Card number" error={errors.card}>
              <Input
                id={cardId}
                inputMode="numeric"
                autoComplete="cc-number"
                className="tabular-number"
                placeholder="1234 1234 1234 1234"
                value={cardNumber}
                error={Boolean(errors.card)}
                onChange={(event) => {
                  setCardNumber(formatCard(event.target.value));
                  clear("card");
                }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field htmlFor={expiryId} label="Expiry" error={errors.expiry}>
                <Input
                  id={expiryId}
                  inputMode="numeric"
                  placeholder="MM / YY"
                  autoComplete="cc-exp"
                  className="tabular-number"
                  value={expiry}
                  error={Boolean(errors.expiry)}
                  onChange={(event) => {
                    setExpiry(formatExpiry(event.target.value));
                    clear("expiry");
                  }}
                />
              </Field>
              <Field htmlFor={cvcId} label="CVC" error={errors.cvc}>
                <Input
                  id={cvcId}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  placeholder="123"
                  className="tabular-number"
                  value={cvc}
                  error={Boolean(errors.cvc)}
                  onChange={(event) => {
                    setCvc(event.target.value.replace(/\D/g, ""));
                    clear("cvc");
                  }}
                />
              </Field>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-caption text-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Secured by Stripe. Prototype: no payment is taken.
          </p>
        </section>

        <Coordinator />

        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-4">
          {emailOpen ? (
            <div className="w-full rounded-card bg-surface p-5 shadow-card sm:p-6">
              <p className="text-label">{DEAL_EMAIL_DEAL}</p>
              <SaveDeal defaultOpen compact />
            </div>
          ) : (
            <Button
              type="button"
              variant="text"
              onClick={() => setEmailOpen(true)}
            >
              {DEAL_EMAIL_DEAL}
            </Button>
          )}
          <Button href={supportRoutes.bookingEnquiry} variant="text">
            Request a callback
          </Button>
        </div>
      </div>

      <DealStepFooter
        showMonthly={false}
        onBack={() => goBack("quote")}
        onContinue={payByCard}
        continueLabel={payAndReserveLabel(reservationConfig.amount)}
        busy={submitting}
      />
    </div>
  );
}
