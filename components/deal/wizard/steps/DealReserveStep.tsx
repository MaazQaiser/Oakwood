"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { reservationConfig } from "@/config/reservation";
import { cn } from "@/lib/cn";
import { formatPounds } from "@/lib/format/money";
import {
  formatHoldPeriod,
  reservationAmountLabel,
  reserveCtaLabel,
} from "@/lib/reservation/format";

const NOT_AVAILABLE = "Not available";

const COVER_LABELS: Record<string, { name: string; years: boolean }> = {
  "aa-warranty": { name: "AA Warranty", years: true },
  "service-plan": { name: "Service Plan", years: true },
  "mot-maintenance": { name: "MOT Plan", years: true },
  supagard: { name: "Supagard", years: false },
};

type PayMethod = "apple" | "google" | "card";

type CardErrors = Partial<
  Record<"name" | "number" | "expiry" | "security", string>
>;

type PxSaved = {
  registration?: string;
  mileage?: string;
  condition?: string;
  serviceHistory?: string;
  financeOutstanding?: boolean;
  settlementText?: string;
  lender?: string;
};

type FinanceSaved = {
  deposit?: number;
  term?: number;
};

type CoverSaved = {
  selected?: string[];
  years?: Record<string, number>;
};

type ReserveSummary = {
  financeType: "hp" | "pcp";
  deposit?: number;
  partExchange: boolean;
  cover: { id: string; name: string; detail: string }[];
};

function readJson<T>(key: string): T | undefined {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function pxComplete(saved: PxSaved | undefined): boolean {
  if (!saved) {
    return false;
  }
  const miles = Number(String(saved.mileage ?? "").replace(/\D/g, ""));
  const financeOk =
    saved.financeOutstanding === false ||
    (saved.financeOutstanding === true &&
      String(saved.settlementText ?? "").trim() !== "" &&
      String(saved.lender ?? "").trim() !== "");
  return (
    String(saved.registration ?? "").trim().length >= 2 &&
    Number.isFinite(miles) &&
    miles > 0 &&
    Boolean(saved.condition) &&
    Boolean(saved.serviceHistory) &&
    financeOk
  );
}

function loadSummary(dealId: string): ReserveSummary {
  const savedType = readJson<{ financeType?: string }>(
    `oakwood-deal-quote:${dealId}`,
  );
  const finance = readJson<FinanceSaved>(`oakwood-deal-finance:${dealId}`);
  const px = readJson<PxSaved>(`oakwood-deal-px:${dealId}`);
  const cover = readJson<CoverSaved>(`oakwood-deal-cover:${dealId}`);
  const deposit = Number(finance?.deposit);
  const selected = new Set(cover?.selected ?? []);

  return {
    financeType: savedType?.financeType === "pcp" ? "pcp" : "hp",
    deposit: Number.isFinite(deposit) ? deposit : undefined,
    partExchange: pxComplete(px),
    cover: Object.entries(COVER_LABELS)
      .filter(([id]) => selected.has(id))
      .map(([id, item]) => {
        const years = Number(cover?.years?.[id]);
        return {
          id,
          name: item.name,
          detail:
            item.years && [1, 2, 3, 4].includes(years)
              ? `${years} ${years === 1 ? "year" : "years"}`
              : "",
        };
      }),
  };
}

function holdLabel(): string {
  const period = formatHoldPeriod(reservationConfig.holdDurationDays);
  if (period.endsWith(" hours")) {
    return `${period.replace(" hours", "")}-hour vehicle hold`;
  }
  return `${period} vehicle hold`;
}

const PAY_OPTIONS: { value: PayMethod; label: string; hint: string }[] = [
  { value: "apple", label: "Apple Pay", hint: "Not available" },
  { value: "google", label: "Google Pay", hint: "Not available" },
  {
    value: "card",
    label: "Card payment",
    hint: "Not available. Do not enter a real card.",
  },
];

export function DealReserveStep() {
  const { dealId, vehicle } = useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const formId = useId();
  const nameId = useId();
  const numberId = useId();
  const expiryId = useId();
  const securityId = useId();
  const statusId = useId();

  const [summary, setSummary] = useState<ReserveSummary>({
    financeType: "hp",
    partExchange: false,
    cover: [],
  });
  const [ready, setReady] = useState(false);
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [methodError, setMethodError] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [security, setSecurity] = useState("");
  const [errors, setErrors] = useState<CardErrors>({});
  const [confirmed, setConfirmed] = useState<PayMethod | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [callbackNoted, setCallbackNoted] = useState(false);

  useEffect(() => {
    setSummary(loadSummary(dealId));
    setReady(true);
  }, [dealId]);

  const feeLabel = reservationAmountLabel(reservationConfig.amount);
  const hold = holdLabel();
  const typeName =
    summary.financeType === "hp"
      ? "Hire Purchase (HP)"
      : "Personal Contract Purchase (PCP)";
  const depositLabel =
    summary.deposit === undefined ? "Not chosen" : formatPounds(summary.deposit);
  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  function clearError(key: keyof CardErrors) {
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );
  }

  function validateCard(): CardErrors {
    const next: CardErrors = {};
    if (name.trim().length < 2) {
      next.name = "Enter the cardholder name.";
    }
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

  function confirmPayment() {
    if (confirmed) {
      return;
    }
    if (!method) {
      setMethodError("Choose a payment option.");
      document.getElementById(`${formId}-pay`)?.focus();
      return;
    }
    if (method === "card") {
      const found = validateCard();
      setErrors(found);
      const order: [keyof CardErrors, string][] = [
        ["name", nameId],
        ["number", numberId],
        ["expiry", expiryId],
        ["security", securityId],
      ];
      const first = order.find(([key]) => found[key]);
      if (first) {
        document.getElementById(first[1])?.focus();
        return;
      }
    }
    setName("");
    setNumber("");
    setExpiry("");
    setSecurity("");
    setErrors({});
    setMethodError("");
    setConfirmed(method);
    window.setTimeout(() => {
      document.getElementById(statusId)?.focus();
    }, 0);
  }

  const confirmedLabel =
    confirmed === "apple"
      ? "Apple Pay"
      : confirmed === "google"
        ? "Google Pay"
        : "Card payment";

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3 pb-32 lg:pb-5">
        <DealCard className="space-y-4">
          <section aria-labelledby={`${formId}-vehicle`}>
            <h2 id={`${formId}-vehicle`} className="text-label text-navy">
              Vehicle
            </h2>
            <div className="mt-3 flex gap-3">
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
                <p className="text-body font-semibold! text-ink">{vehicleTitle}</p>
                {vehicle.derivative ? (
                  <p className="text-body-sm text-muted">{vehicle.derivative}</p>
                ) : null}
                <p className="mt-1 text-body-sm text-ink">
                  Listed price {formatPounds(vehicle.cashPrice)}
                </p>
              </div>
            </div>
          </section>

          <dl className="grid grid-cols-1 gap-2 border-t border-border pt-4 sm:grid-cols-2">
            <SummaryStat label="Finance type" value={typeName} />
            <SummaryStat
              label="Deposit"
              value={ready ? depositLabel : "Not chosen"}
            />
            {ready && summary.partExchange ? (
              <SummaryStat
                label="Part-exchange contribution"
                value={NOT_AVAILABLE}
              />
            ) : null}
          </dl>
          {ready && summary.partExchange ? (
            <p className="text-caption text-muted">
              A part-exchange valuation is not available.
            </p>
          ) : null}

          <section aria-labelledby={`${formId}-cover`}>
            <h2 id={`${formId}-cover`} className="text-label text-navy">
              Cover
            </h2>
            {summary.cover.length === 0 ? (
              <p className="mt-1 text-body-sm text-muted">
                {ready ? "No cover selected." : "Not chosen"}
              </p>
            ) : (
              <ul className="mt-2 space-y-1 text-body-sm text-ink">
                {summary.cover.map((product) => (
                  <li key={product.id}>
                    {product.name}
                    {product.detail ? ` · ${product.detail}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="border-t border-border pt-4">
            <p className="text-caption font-semibold! uppercase tracking-[0.08em] text-muted">
              Indicative monthly payment
            </p>
            <p className="mt-1">
              <span className="text-h5 text-navy">{NOT_AVAILABLE}</span>
            </p>
            <p className="mt-1 text-caption text-muted">
              A monthly payment is not available.
            </p>
          </div>
        </DealCard>

        <section
          aria-labelledby={`${formId}-fee`}
          className="rounded-card border-2 border-primary bg-surface p-5 shadow-card sm:p-7"
        >
          <h2
            id={`${formId}-fee`}
            className="text-caption font-semibold! uppercase tracking-[0.08em] text-primary"
          >
            Reservation fee
          </h2>
          <p className="mt-2 text-h4 text-navy">{feeLabel}</p>
          <p className="mt-1 text-body-sm font-semibold! text-ink">
            {feeLabel} refundable reservation fee
          </p>
          <p className="mt-1 text-body-sm text-ink">{hold}</p>
          <p className="mt-2 text-caption text-muted">
            Payable to reserve the vehicle. This is not the monthly finance
            payment.
          </p>
        </section>

        {confirmed ? (
          <div
            id={statusId}
            tabIndex={-1}
            className="outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Alert title="Not available" tone="info">
              Payment by {confirmedLabel} is not available. No payment has been
              taken and the vehicle has not been reserved.
            </Alert>
            <p className="mt-2 text-caption text-muted">
              {feeLabel} refundable reservation fee · {hold}
            </p>
          </div>
        ) : (
          <DealCard>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                confirmPayment();
              }}
            >
              <h2
                id={`${formId}-pay`}
                tabIndex={-1}
                className="text-label text-navy outline-none"
              >
                Payment
              </h2>
              <p className="mt-1 text-caption text-muted">
                Payment is not available. Nothing is sent to a payment provider.
              </p>
              {methodError ? (
                <p className="mt-2 text-caption text-danger" role="alert">
                  {methodError}
                </p>
              ) : null}
              <fieldset className="mt-3">
                <legend className="sr-only">Payment method</legend>
                <div className="grid gap-2">
                  {PAY_OPTIONS.map((option) => {
                    const selected = method === option.value;
                    return (
                      <label key={option.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="reserve-payment"
                          value={option.value}
                          checked={selected}
                          className="peer sr-only"
                          onChange={() => {
                            setMethod(option.value);
                            setMethodError("");
                          }}
                        />
                        <span
                          className={cn(
                            "flex min-h-12 items-center justify-between gap-3 rounded-[14px] px-4 py-2",
                            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                            option.value === "apple" &&
                              "bg-black text-white",
                            option.value === "google" &&
                              "border border-border bg-surface text-ink",
                            option.value === "card" &&
                              "border border-transparent bg-page-tint text-ink",
                            selected &&
                              "ring-2 ring-primary ring-offset-2",
                          )}
                        >
                          <span>
                            <span className="block text-body-sm font-semibold!">
                              {option.label}
                            </span>
                            <span
                              className={cn(
                                "block text-caption",
                                option.value === "apple"
                                  ? "text-white/80"
                                  : "text-muted",
                              )}
                            >
                              {option.hint}
                            </span>
                          </span>
                          <span className="shrink-0 text-caption">
                            {selected ? "Selected" : "Choose"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              >
                {reserveCtaLabel(reservationConfig.amount)}
              </button>

              {method === "card" ? (
                <div className="mt-4 space-y-3">
                  <Field
                    htmlFor={nameId}
                    label="Cardholder name"
                    error={errors.name}
                  >
                    <Input
                      id={nameId}
                      value={name}
                      autoComplete="off"
                      error={Boolean(errors.name)}
                      onChange={(event) => {
                        setName(event.target.value);
                        clearError("name");
                      }}
                    />
                  </Field>
                  <Field
                    htmlFor={numberId}
                    label="Card number"
                    hint="Do not enter a real card."
                    error={errors.number}
                  >
                    <Input
                      id={numberId}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Card number"
                      value={number}
                      error={Boolean(errors.number)}
                      onChange={(event) => {
                        const digits = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        setNumber(
                          digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim(),
                        );
                        clearError("number");
                      }}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      htmlFor={expiryId}
                      label="Expiry date"
                      error={errors.expiry}
                    >
                      <Input
                        id={expiryId}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="MM/YY"
                        value={expiry}
                        error={Boolean(errors.expiry)}
                        onChange={(event) => {
                          const digits = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setExpiry(
                            digits.length > 2
                              ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                              : digits,
                          );
                          clearError("expiry");
                        }}
                      />
                    </Field>
                    <Field
                      htmlFor={securityId}
                      label="Security code"
                      error={errors.security}
                    >
                      <Input
                        id={securityId}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="000"
                        value={security}
                        error={Boolean(errors.security)}
                        onChange={(event) => {
                          setSecurity(
                            event.target.value.replace(/\D/g, "").slice(0, 4),
                          );
                          clearError("security");
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ) : null}
            </form>
          </DealCard>
        )}

        <section aria-labelledby={`${formId}-other`} className="space-y-2">
          <h2 id={`${formId}-other`} className="text-label text-navy">
            Not ready to reserve
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="btn-wrap w-full"
              onClick={() => setEmailOpen(true)}
            >
              Email me this deal
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="btn-wrap w-full"
              onClick={() => setCallbackNoted(true)}
            >
              Request a callback
            </Button>
          </div>
          {emailOpen ? (
            <article
              className="rounded-card border border-dashed border-border-strong bg-page-tint p-4"
              aria-label="Email preview"
            >
              <p className="text-caption font-semibold! uppercase tracking-[0.08em] text-muted">
                Email
              </p>
              <p className="mt-1 text-caption text-muted">
                An email is not available. Nothing has been sent.
              </p>
              <dl className="mt-3 space-y-2 text-body-sm">
                <div>
                  <dt className="text-caption text-muted">To</dt>
                  <dd>{NOT_AVAILABLE}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted">Subject</dt>
                  <dd>Your deal for the {vehicleTitle}</dd>
                </div>
              </dl>
              <div className="mt-3 space-y-1 text-body-sm text-ink">
                <p>
                  {vehicleTitle}
                  {vehicle.derivative ? `, ${vehicle.derivative}` : ""}. Listed
                  price {formatPounds(vehicle.cashPrice)}.
                </p>
                <p>Finance: {typeName}.</p>
                <p>Deposit: {ready ? depositLabel : "Not chosen"}.</p>
                {ready && summary.partExchange ? (
                  <p>Part-exchange contribution: {NOT_AVAILABLE}.</p>
                ) : null}
                <p>Indicative monthly payment: {NOT_AVAILABLE}.</p>
                <p>
                  {feeLabel} refundable reservation fee. {hold}.
                </p>
              </div>
            </article>
          ) : null}
          {callbackNoted ? (
            <Alert title="Not available" tone="info">
              A callback is not available. No request has been sent.
            </Alert>
          ) : null}
        </section>
      </div>

      <DealStepFooter
        showMonthly={false}
        onBack={() => goBack("quote")}
        onContinue={confirmed ? undefined : confirmPayment}
        continueLabel={reserveCtaLabel(reservationConfig.amount)}
        note={
          confirmed
            ? "No payment was taken."
            : "No payment is taken."
        }
      />
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-page-tint px-3 py-2.5">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 text-body-sm font-semibold! text-ink">{value}</dd>
    </div>
  );
}
