"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Field, Input } from "@/components/forms/FormControls";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { DealCard } from "@/components/deal/wizard/DealWizardShell";
import { reservationConfig } from "@/config/reservation";
import { getVehicleUrl } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  STEP4_BACK_HUB,
  STEP4_DONE,
  STEP4_RESERVE_HOLD,
  STEP4_RESERVE_PROCESSING,
  STEP4_RESERVE_REFUND_INFO,
  STEP4_RESERVE_REFUNDABLE,
  STEP4_RESERVE_SUCCESS_BODY,
  STEP4_RESERVE_SUCCESS_TITLE,
} from "@/lib/deal/step4-copy";
import { formatPounds } from "@/lib/format/money";
import {
  payAndReserveLabel,
  reservationAmountLabel,
} from "@/lib/reservation/format";

type PayMethod = "apple" | "google" | "card";
type Phase = "form" | "processing" | "confirmed";
type CardErrors = Partial<Record<"name" | "number" | "expiry" | "security", string>>;

function groupCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function DealReservePanel({ onBack }: { onBack: () => void }) {
  const { vehicle, navigateTo } = useDealBuilder();
  const nameId = useId();
  const numberId = useId();
  const expiryId = useId();
  const securityId = useId();

  const [method, setMethod] = useState<PayMethod>("apple");
  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [security, setSecurity] = useState("");
  const [errors, setErrors] = useState<CardErrors>({});
  const [methodError, setMethodError] = useState("");

  const fee = reservationAmountLabel(reservationConfig.amount);
  const payLabel =
    method === "apple"
      ? `Pay ${fee} with Apple Pay`
      : method === "google"
        ? `Pay ${fee} with Google Pay`
        : payAndReserveLabel();

  function validateCard(): CardErrors {
    const next: CardErrors = {};
    if (name.trim().length < 2) next.name = "Enter the cardholder name.";
    const digits = number.replace(/\D/g, "");
    if (digits.length < 15 || digits.length > 16) {
      next.number = "Enter the card number.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) {
      next.expiry = "Use MM/YY.";
    }
    if (!/^\d{3,4}$/.test(security.trim())) {
      next.security = "Enter the security code.";
    }
    return next;
  }

  function pay(next: PayMethod = method) {
    setMethod(next);
    setMethodError("");
    if (next === "card") {
      const found = validateCard();
      setErrors(found);
      const focus =
        (found.name && nameId) ||
        (found.number && numberId) ||
        (found.expiry && expiryId) ||
        (found.security && securityId);
      if (focus) {
        document.getElementById(focus)?.focus();
        return;
      }
    }
    setPhase("processing");
    window.setTimeout(() => {
      setName("");
      setNumber("");
      setExpiry("");
      setSecurity("");
      setPhase("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  }

  if (phase === "processing") {
    return (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary"
          aria-hidden
        />
        <p className="text-label" role="status">
          {STEP4_RESERVE_PROCESSING}
        </p>
      </div>
    );
  }

  if (phase === "confirmed") {
    return (
      <div className="flex flex-1 flex-col gap-4 pb-5">
        <DealResultHero
          eyebrow="Reserved"
          title={STEP4_RESERVE_SUCCESS_TITLE}
          body={STEP4_RESERVE_SUCCESS_BODY()}
        />
        <DealStep4Summary />
        <DealCard className="space-y-2">
          <p className="text-label text-navy">{fee} reservation</p>
          <p className="text-body-sm text-ink">{STEP4_RESERVE_HOLD()}</p>
          <p className="text-body-sm text-muted">{STEP4_RESERVE_REFUND_INFO()}</p>
        </DealCard>
        <DealStepFooter
          showMonthly={false}
          onBack={onBack}
          backLabel={STEP4_BACK_HUB}
          onContinue={() => navigateTo(getVehicleUrl(vehicle.slug))}
          continueLabel={STEP4_DONE}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <div className="lg:sticky lg:top-[calc(var(--oak-header-height)+1.25rem)] lg:z-10">
          <DealCard className="flex gap-3">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[12px] bg-page-tint">
              <Image
                src={vehicle.imageSrc}
                alt={vehicle.imageAlt}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={vehicle.imageSrc.endsWith(".svg")}
              />
            </div>
            <div className="min-w-0">
              <p className="text-caption font-semibold! uppercase tracking-[0.08em] text-muted">
                Your deal
              </p>
              <p className="mt-1 text-body font-semibold! text-ink">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              <p className="text-body-sm text-muted">
                Listed price {formatPounds(vehicle.cashPrice)}
              </p>
            </div>
          </DealCard>
        </div>

        <DealCard className="space-y-4">
          <div>
            <p className="text-caption font-semibold! uppercase tracking-[0.08em] text-primary">
              Reservation fee
            </p>
            <p className="mt-1 text-h3 text-navy">{fee}</p>
            <p className="mt-1 text-body-sm text-ink">{STEP4_RESERVE_REFUNDABLE}</p>
            <p className="mt-1 text-body-sm text-ink">{STEP4_RESERVE_HOLD()}</p>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              aria-pressed={method === "apple"}
              onClick={() => {
                setMethod("apple");
                setMethodError("");
              }}
              className={cn(
                "min-h-12 rounded-[14px] bg-black px-4 text-body-sm font-semibold! text-white",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                method === "apple" && "ring-2 ring-primary ring-offset-2",
              )}
            >
              Apple Pay
            </button>
            <button
              type="button"
              aria-pressed={method === "google"}
              onClick={() => {
                setMethod("google");
                setMethodError("");
              }}
              className={cn(
                "min-h-12 rounded-[14px] border border-border bg-surface px-4 text-body-sm font-semibold! text-ink",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                method === "google" && "ring-2 ring-primary ring-offset-2",
              )}
            >
              Google Pay
            </button>
          </div>
          {methodError ? (
            <p className="text-caption text-danger" role="alert">
              {methodError}
            </p>
          ) : null}

          <form
            className="space-y-3 border-t border-border pt-4"
            onSubmit={(event) => {
              event.preventDefault();
              pay("card");
            }}
          >
            <h2 className="text-label text-navy">Card</h2>
            <p className="text-caption text-muted">
              Pay {fee} by card if you are not using Apple Pay or Google Pay.
            </p>
            <Field htmlFor={nameId} label="Cardholder name" error={errors.name}>
              <Input
                id={nameId}
                autoComplete="cc-name"
                value={name}
                error={Boolean(errors.name)}
                onFocus={() => setMethod("card")}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: undefined }));
                }}
              />
            </Field>
            <Field htmlFor={numberId} label="Card number" error={errors.number}>
              <Input
                id={numberId}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="Card number"
                value={number}
                error={Boolean(errors.number)}
                onFocus={() => setMethod("card")}
                onChange={(event) => {
                  setNumber(groupCardNumber(event.target.value));
                  setErrors((current) => ({ ...current, number: undefined }));
                }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field htmlFor={expiryId} label="Expiry" error={errors.expiry}>
                <Input
                  id={expiryId}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={expiry}
                  error={Boolean(errors.expiry)}
                  onFocus={() => setMethod("card")}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                    const next =
                      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                    setExpiry(next);
                    setErrors((current) => ({ ...current, expiry: undefined }));
                  }}
                />
              </Field>
              <Field htmlFor={securityId} label="Security code" error={errors.security}>
                <Input
                  id={securityId}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="000"
                  value={security}
                  error={Boolean(errors.security)}
                  onFocus={() => setMethod("card")}
                  onChange={(event) => {
                    setSecurity(event.target.value.replace(/\D/g, "").slice(0, 4));
                    setErrors((current) => ({ ...current, security: undefined }));
                  }}
                />
              </Field>
            </div>
            <button type="submit" className="sr-only">
              Pay by card
            </button>
          </form>
        </DealCard>
      </div>

      <DealStepFooter
        showMonthly={false}
        onBack={onBack}
        backLabel={STEP4_BACK_HUB}
        onContinue={() => pay()}
        continueLabel={payLabel}
      />
    </div>
  );
}
