"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { Checkbox, Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { routes } from "@/config/routes";
import { reservationConfig } from "@/config/reservation";
import {
  STEP4_BACK_HUB,
  STEP4_RESERVE_FAILED_BODY,
  STEP4_RESERVE_FAILED_TITLE,
  STEP4_RESERVE_HOLD,
  STEP4_RESERVE_MOCK,
  STEP4_RESERVE_PROCESSING,
  STEP4_RESERVE_REFUND_INFO,
  STEP4_RESERVE_REFUNDABLE,
  STEP4_RESERVE_SUCCESS_BODY,
  STEP4_RESERVE_SUCCESS_TITLE,
  STEP4_RESERVE_TITLE,
} from "@/lib/deal/step4-copy";
import {
  formatHoldPeriod,
  payAndReserveLabel,
  reservationAmountLabel,
} from "@/lib/reservation/format";

type PayPhase = "form" | "loading" | "failed" | "success";

type Errors = Partial<
  Record<"name" | "email" | "phone" | "card" | "expiry" | "cvc", string>
>;

function mockReference(dealId: string, stockId: string): string {
  const seed = `${stockId}${dealId}`.replace(/[^a-zA-Z0-9]/g, "").slice(-6);
  return `OAK-${seed.toUpperCase() || "DEMO01"}`;
}

export function DealReservePaymentPanel({ onBack }: { onBack: () => void }) {
  const { vehicle, draft, dealId, markStepComplete, navigateTo } =
    useDealBuilder();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const failId = useId();
  const cardId = useId();
  const expiryId = useId();
  const cvcId = useId();
  const formId = useId();

  const [phase, setPhase] = useState<PayPhase>(
    draft.stepsCompleted?.includes("reserve") ? "success" : "form",
  );
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [simulateFail, setSimulateFail] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const amountLabel = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod();
  const reference = useMemo(
    () => mockReference(dealId, vehicle.stockId),
    [dealId, vehicle.stockId],
  );

  useEffect(() => {
    if (phase === "success" || phase === "failed") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (phase === "success") {
      navigateTo(routes.home);
    }
  }, [navigateTo, phase]);

  const clear = (key: keyof Errors) =>
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a UK phone number so we can call you.";
    return next;
  }

  function validateCard(): Errors {
    const next = validate();
    const digits = card.replace(/\D/g, "");
    if (digits.length < 15 || digits.length > 16) {
      next.card = "Enter the card number.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) {
      next.expiry = "Use MM/YY.";
    }
    if (!/^\d{3,4}$/.test(cvc.trim())) {
      next.cvc = "Enter the security code.";
    }
    return next;
  }

  function runMockPayment(source: "card" | "apple" | "google") {
    if (phase === "loading") return;

    if (source === "card") {
      const found = validateCard();
      setErrors(found);
      const order: [keyof Errors, string][] = [
        ["name", nameId],
        ["email", emailId],
        ["phone", phoneId],
        ["card", cardId],
        ["expiry", expiryId],
        ["cvc", cvcId],
      ];
      const first = order.find(([key]) => found[key]);
      if (first) {
        document.getElementById(first[1])?.focus();
        return;
      }
    }

    setPhase("loading");
    window.setTimeout(() => {
      if (source === "card" && simulateFail) {
        setPhase("failed");
        return;
      }
      setPhase("success");
      markStepComplete("reserve");
    }, 1100);
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary"
          aria-hidden
        />
        <p className="text-label" role="status">
          {STEP4_RESERVE_PROCESSING}
        </p>
        <p className="text-caption text-muted">{STEP4_RESERVE_MOCK}</p>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="flex flex-1 flex-col gap-4 pb-5">
        <Alert title={STEP4_RESERVE_FAILED_TITLE} tone="warning">
          {STEP4_RESERVE_FAILED_BODY}
        </Alert>
        <DealStep4Summary />
        <DealStepFooter
          showMonthly={false}
          onBack={onBack}
          backLabel={STEP4_BACK_HUB}
          onContinue={() => setPhase("form")}
          continueLabel="Try again"
        />
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="flex flex-1 flex-col gap-4 pb-5">
        <DealResultHero
          eyebrow="Reservation confirmed"
          title={STEP4_RESERVE_SUCCESS_TITLE}
          body={STEP4_RESERVE_SUCCESS_BODY()}
        >
          <div className="relative mt-5 rounded-[20px] bg-white/10 px-4 py-3.5 text-left">
            <p className="text-caption text-white/75">Reservation reference</p>
            <p className="mt-1 text-h5 tabular-number text-white">{reference}</p>
            <p className="mt-1 text-caption text-white/75">
              {amountLabel} · held for {hold}
            </p>
          </div>
        </DealResultHero>
        <Alert title="Refund information" tone="info">
          {STEP4_RESERVE_REFUND_INFO()}
        </Alert>
        <p className="text-caption text-muted">{STEP4_RESERVE_MOCK}</p>
        <DealStep4Summary title="Reserved deal" />
        <DealStepFooter
          showMonthly={false}
          onBack={onBack}
          backLabel={STEP4_BACK_HUB}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <DealStep4Summary />
        <section
          className="rounded-card bg-surface p-5 shadow-card sm:p-6"
          aria-labelledby={`${formId}-pay`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id={`${formId}-pay`} className="text-label">
                {STEP4_RESERVE_TITLE()}
              </h2>
              <p className="mt-0.5 text-caption text-muted">
                {STEP4_RESERVE_REFUNDABLE}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-page-tint px-2.5 py-1 text-caption text-muted">
              <Lock className="h-3 w-3" aria-hidden />
              Not available
            </span>
          </div>
          <p className="mt-3 rounded-[14px] bg-page-tint px-4 py-3 text-body-sm">
            {STEP4_RESERVE_HOLD()}
          </p>
          <div className="mt-4">
            <Alert title="Prototype payment" tone="info">
              Stripe is not connected. Card details stay in this browser and
              no charge is taken. Apple Pay and Google Pay run the same mock
              confirmation.
            </Alert>
          </div>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              className="flex min-h-12 items-center justify-center rounded-[14px] bg-black px-4 text-button text-white"
              onClick={() => runMockPayment("apple")}
            >
              Apple Pay
            </button>
            <button
              type="button"
              className="flex min-h-12 items-center justify-center rounded-[14px] bg-black px-4 text-button text-white"
              onClick={() => runMockPayment("google")}
            >
              Google Pay
            </button>
          </div>

          <div className="my-4 flex items-center gap-3 text-caption text-muted">
            <span className="h-px flex-1 bg-border" />
            or pay by card
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <Field htmlFor={nameId} label="Full name" error={errors.name}>
              <Input
                id={nameId}
                value={name}
                autoComplete="name"
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
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_7rem_6rem]">
              <Field htmlFor={cardId} label="Card number" error={errors.card}>
                <Input
                  id={cardId}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="•••• •••• •••• ••••"
                  value={card}
                  error={Boolean(errors.card)}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                    setCard(digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim());
                    clear("card");
                  }}
                />
              </Field>
              <Field htmlFor={expiryId} label="Expiry" error={errors.expiry}>
                <Input
                  id={expiryId}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={expiry}
                  error={Boolean(errors.expiry)}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                    setExpiry(
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits,
                    );
                    clear("expiry");
                  }}
                />
              </Field>
              <Field htmlFor={cvcId} label="CVC" error={errors.cvc}>
                <Input
                  id={cvcId}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={cvc}
                  error={Boolean(errors.cvc)}
                  onChange={(event) => {
                    setCvc(event.target.value.replace(/\D/g, "").slice(0, 4));
                    clear("cvc");
                  }}
                />
              </Field>
            </div>
            <Checkbox
              id={failId}
              checked={simulateFail}
              onChange={(event) => setSimulateFail(event.target.checked)}
              label="Simulate a failed payment (prototype)"
            />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-caption text-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            {STEP4_RESERVE_MOCK}
          </p>
        </section>
      </div>
      <DealStepFooter
        showMonthly={false}
        onBack={onBack}
        backLabel={STEP4_BACK_HUB}
        onContinue={() => runMockPayment("card")}
        continueLabel={payAndReserveLabel(reservationConfig.amount)}
      />
    </div>
  );
}
