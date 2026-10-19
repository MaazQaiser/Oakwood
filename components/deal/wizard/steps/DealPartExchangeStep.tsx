"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Field, Input } from "@/components/forms/FormControls";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Accordion } from "@/components/ui/Accordion";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/Loading";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { getContactUrl } from "@/config/routes";
import {
  DEAL_ADD_TO_DEAL,
  DEAL_PX_CALLBACK,
  DEAL_PX_DEPOSIT_CASH,
  DEAL_PX_DEPOSIT_EQUITY,
  DEAL_PX_DEPOSIT_TOTAL,
  DEAL_PX_FINANCE_LABEL,
  DEAL_PX_GET_OFFER,
  DEAL_PX_HELP_BODY,
  DEAL_PX_HELP_TITLE,
  DEAL_PX_INSPECTION,
  DEAL_PX_NEGATIVE_BODY,
  DEAL_PX_NEGATIVE_TITLE,
  DEAL_PX_NOT_YOUR_VEHICLE,
  DEAL_PX_TOTAL_LABEL,
  DEAL_PX_VALUATION_LABEL,
  DEAL_PX_VALUING,
  DEAL_SKIP_PX,
} from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";
import { VE_EXTRA_OPTIONS } from "@/lib/valuation-entry/extras";
import {
  VE_EXTRAS_HEADING,
  VE_EXTRAS_SUPPORT,
  VE_OTHER_DETAILS,
  VE_PRIVATE_PLATE_LABEL,
  VE_PRIVATE_RETAIN,
  VE_PRIVATE_SELL,
} from "@/lib/valuation-entry/copy";
import type {
  DealPartExchangeInput,
  DealPxCondition,
  DealPxExtraId,
  DealPxPrivatePlateDisposition,
  DealPxServiceHistory,
} from "@/types/deal";

const CONDITION_OPTIONS: { value: DealPxCondition; label: string }[] = [
  { value: "needs-work", label: "Rough" },
  { value: "average", label: "Average" },
  { value: "good", label: "Good" },
  { value: "excellent", label: "Immaculate" },
];

const SERVICE_OPTIONS: { value: DealPxServiceHistory; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "partial", label: "Partial" },
  { value: "none", label: "None" },
];

function parseNumber(value: string): number {
  return Number(value.replace(/[,£\s]/g, ""));
}

const MAX_MILES = 500_000;
const MAX_SETTLEMENT = 150_000;
const MOCK_LOOKUP_MS = 850;

function digits(value: string, max: number): string {
  const raw = value.replace(/\D/g, "").slice(0, String(max).length);
  return raw === "" ? "" : String(Math.min(Number(raw), max));
}

function withCommas(value: string): string {
  return value === "" ? "" : Number(value).toLocaleString("en-GB");
}

function normaliseReg(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function DealPartExchangeStep() {
  const {
    vehicle,
    draft,
    pxError,
    calculation,
    startPartExchange,
    updatePartExchange,
    clearPartExchange,
  } = useDealBuilder();
  const { goNext } = useDealStepNavigation("part-exchange");
  const router = useRouter();
  const regId = useId();
  const milesId = useId();
  const settleId = useId();
  const lenderId = useId();
  const px = draft.px;

  const [registration, setRegistration] = useState(px?.registration ?? "");
  const [mileage, setMileage] = useState(px?.mileage ? String(px.mileage) : "");
  const [condition, setCondition] = useState(px?.condition);
  const [serviceHistory, setServiceHistory] = useState(px?.serviceHistory);
  const [financeOutstanding, setFinanceOutstanding] = useState(
    px?.financeOutstanding,
  );
  const [settlementText, setSettlementText] = useState(
    px?.outstandingFinanceAmount !== undefined
      ? String(px.outstandingFinanceAmount)
      : px?.settlement !== undefined
        ? String(px.settlement)
        : "",
  );
  const [lender, setLender] = useState(px?.outstandingFinanceLender ?? "");
  const [extras, setExtras] = useState<DealPxExtraId[]>(
    px?.extras?.selected ?? [],
  );
  const [privatePlateDisposition, setPrivatePlateDisposition] = useState<
    DealPxPrivatePlateDisposition | undefined
  >(px?.extras?.privatePlateDisposition);
  const [otherNotes, setOtherNotes] = useState(px?.extras?.otherNotes ?? "");
  const [valuing, setValuing] = useState(false);
  const [localError, setLocalError] = useState<string>();

  // Keep local fields aligned when returning from a later step.
  useEffect(() => {
    if (!px) {
      return;
    }
    setRegistration(px.registration);
    setMileage(String(px.mileage));
    setCondition(px.condition);
    setServiceHistory(px.serviceHistory);
    setFinanceOutstanding(px.financeOutstanding);
    setSettlementText(
      px.outstandingFinanceAmount !== undefined
        ? String(px.outstandingFinanceAmount)
        : px.settlement !== undefined
          ? String(px.settlement)
          : "",
    );
    setLender(px.outstandingFinanceLender ?? "");
    setExtras(px.extras?.selected ?? []);
    setPrivatePlateDisposition(px.extras?.privatePlateDisposition);
    setOtherNotes(px.extras?.otherNotes ?? "");
  }, [px?.registration, px?.mileage, px?.value]);

  const miles = parseNumber(mileage);
  const hasVehicle =
    normaliseReg(registration).length >= 2 &&
    Number.isFinite(miles) &&
    miles > 0;
  const settlementAmount = parseNumber(settlementText);
  const settlementMissing =
    financeOutstanding === true &&
    !(Number.isFinite(settlementAmount) && settlementAmount >= 0 && settlementText !== "");
  const answered =
    Boolean(condition) &&
    Boolean(serviceHistory) &&
    financeOutstanding !== undefined &&
    !settlementMissing;
  const valued =
    px?.value !== undefined &&
    px.registration === normaliseReg(registration) &&
    px.mileage === miles;
  const settlement =
    financeOutstanding === true
      ? Number.isFinite(settlementAmount)
        ? settlementAmount
        : (px?.settlement ?? 0)
      : 0;
  const equity = calculation?.pxEquity ?? 0;
  const negativeEquity = calculation?.pxNegativeEquity ?? 0;
  const owes = valued && negativeEquity > 0;
  const cashDeposit = calculation?.cashDeposit ?? draft.cashDeposit;
  const totalDeposit = calculation?.totalDeposit ?? cashDeposit;

  function toggleExtra(id: DealPxExtraId) {
    setExtras((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      syncExtras(next);
      return next;
    });
  }

  function syncExtras(
    selected: DealPxExtraId[],
    plate: DealPxPrivatePlateDisposition | undefined = privatePlateDisposition,
    notes: string = otherNotes,
  ) {
    sync({
      extras: {
        selected,
        privatePlateDisposition: selected.includes("private-plate")
          ? plate
          : undefined,
        otherNotes: selected.includes("other") ? notes || undefined : undefined,
      },
    });
  }

  function details(): Partial<DealPartExchangeInput> {
    const amount = parseNumber(settlementText);
    return {
      condition,
      serviceHistory,
      financeOutstanding,
      outstandingFinanceAmount:
        financeOutstanding && Number.isFinite(amount) ? amount : undefined,
      outstandingFinanceLender: financeOutstanding
        ? lender || undefined
        : undefined,
      settlement: financeOutstanding && Number.isFinite(amount) ? amount : 0,
      extras: {
        selected: extras,
        privatePlateDisposition: extras.includes("private-plate")
          ? privatePlateDisposition
          : undefined,
        otherNotes: extras.includes("other") ? otherNotes || undefined : undefined,
      },
    };
  }

  function valueNow() {
    if (!hasVehicle || valued || valuing) {
      return;
    }
    const cleaned = normaliseReg(registration);
    if (cleaned.length < 2) {
      setLocalError("Enter a valid registration.");
      return;
    }
    if (!Number.isFinite(miles) || miles <= 0) {
      setLocalError("Enter the current mileage.");
      return;
    }
    setLocalError(undefined);
    setValuing(true);
    window.setTimeout(() => {
      startPartExchange(cleaned, miles);
      updatePartExchange(details());
      setValuing(false);
    }, MOCK_LOOKUP_MS);
  }

  function sync(patch: Partial<DealPartExchangeInput>) {
    if (px) {
      updatePartExchange(patch);
    }
  }

  function resetVehicle() {
    clearPartExchange();
    setLocalError(undefined);
    setValuing(false);
    window.setTimeout(() => {
      document.getElementById(regId)?.focus();
    }, 0);
  }

  const note = valuing
    ? DEAL_PX_VALUING
    : !hasVehicle
      ? "Enter your registration and mileage to get a valuation."
      : valued && settlementMissing
        ? "Enter the outstanding finance amount from your lender."
        : valued && !answered
          ? "Answer condition, service history and finance to continue."
          : owes
            ? DEAL_PX_NEGATIVE_TITLE
            : undefined;

  const continueDisabled =
    valuing ||
    !hasVehicle ||
    (valued && (!answered || owes)) ||
    Boolean(pxError && !valued);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <DealCard className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-label text-navy">Your part exchange</p>
            {valued || registration ? (
              <Button
                type="button"
                variant="text"
                className="min-h-8 shrink-0 px-0 text-caption"
                onClick={resetVehicle}
              >
                {DEAL_PX_NOT_YOUR_VEHICLE}
              </Button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Field htmlFor={regId} label="Registration" error={localError && !mileage ? localError : undefined}>
              <Input
                id={regId}
                className="font-semibold! tracking-wider uppercase"
                value={registration}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="AB21 CDE"
                disabled={valuing}
                onChange={(event) => {
                  setRegistration(event.target.value);
                  setLocalError(undefined);
                }}
                onBlur={() => {
                  if (hasVehicle && !valued) {
                    valueNow();
                  }
                }}
              />
            </Field>
            <Field htmlFor={milesId} label="Mileage">
              <Input
                id={milesId}
                inputMode="numeric"
                value={withCommas(mileage)}
                placeholder="42,000"
                disabled={valuing}
                onChange={(event) => {
                  setMileage(digits(event.target.value, MAX_MILES));
                  setLocalError(undefined);
                }}
                onBlur={() => {
                  if (hasVehicle && !valued) {
                    valueNow();
                  }
                }}
              />
            </Field>
          </div>

          {valuing ? (
            <div className="rounded-[16px] bg-page-tint px-4 py-5">
              <LoadingState label={DEAL_PX_VALUING} />
            </div>
          ) : null}

          {pxError ? (
            <Alert title="Valuation unavailable" tone="warning">
              {pxError} You can skip part exchange and continue with £0 equity,
              or try another registration.
            </Alert>
          ) : null}

          {localError && hasVehicle ? (
            <p className="text-caption text-danger" role="alert">
              {localError}
            </p>
          ) : null}

          {valued && px ? (
            <>
              <div
                className={cn(
                  "rounded-[20px] px-4 py-4",
                  owes ? "bg-warning-soft/70" : "bg-success-soft/50",
                )}
                role="status"
                aria-live="polite"
              >
                <p
                  className={cn(
                    "flex items-center gap-1.5 text-caption font-semibold!",
                    owes ? "text-ink" : "text-success",
                  )}
                >
                  {owes ? (
                    <CircleAlert className="h-4 w-4 text-warning" aria-hidden />
                  ) : (
                    <CircleCheck className="h-4 w-4" aria-hidden />
                  )}
                  Indicative valuation
                </p>

                <dl className="mt-3 space-y-2.5 text-body-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted">{DEAL_PX_VALUATION_LABEL}</dt>
                    <dd>
                      <FinancialNumber
                        value={formatPounds(px.value)}
                        size="sm"
                        className="text-ink"
                      />
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted">{DEAL_PX_FINANCE_LABEL}</dt>
                    <dd>
                      <FinancialNumber
                        value={
                          settlement > 0
                            ? `−${formatPounds(settlement)}`
                            : formatPounds(0)
                        }
                        size="sm"
                        className="text-ink"
                      />
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-border/70 pt-2.5">
                    <dt className="text-label text-ink">{DEAL_PX_TOTAL_LABEL}</dt>
                    <dd>
                      <FinancialNumber
                        value={formatPounds(owes ? 0 : equity)}
                        size="sm"
                        className={owes ? "text-ink" : "text-success"}
                      />
                    </dd>
                  </div>
                </dl>

                {owes ? (
                  <p className="mt-3 text-caption text-ink">
                    Negative equity: −{formatPounds(negativeEquity)}. Outstanding
                    finance is higher than the valuation, so £0 goes towards your
                    deposit from this car.
                  </p>
                ) : null}

                <p className="mt-3 text-caption text-muted">{DEAL_PX_INSPECTION}</p>
              </div>

              {owes ? (
                <div className="space-y-3 rounded-[20px] border border-warning/30 bg-warning-soft/40 px-4 py-4">
                  <p className="text-label text-ink">{DEAL_PX_NEGATIVE_TITLE}</p>
                  <p className="text-body-sm text-ink">{DEAL_PX_NEGATIVE_BODY}</p>
                  <Button
                    href={getContactUrl({
                      stockId: vehicle.stockId,
                      topic: "part-exchange",
                    })}
                    className="w-full sm:w-auto"
                  >
                    {DEAL_PX_CALLBACK}
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}

          <DealChipGroup
            label="Condition"
            value={condition}
            options={CONDITION_OPTIONS}
            columns={2}
            onChange={(value) => {
              setCondition(value);
              sync({ condition: value });
            }}
          />

          <DealChipGroup
            label="Service history"
            value={serviceHistory}
            options={SERVICE_OPTIONS}
            columns={3}
            onChange={(value) => {
              setServiceHistory(value);
              sync({ serviceHistory: value });
            }}
          />

          <div className="space-y-3">
            <DealChipGroup
              label="Outstanding finance"
              value={
                financeOutstanding === undefined
                  ? undefined
                  : financeOutstanding
                    ? "yes"
                    : "no"
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              columns={2}
              onChange={(value) => {
                const next = value === "yes";
                setFinanceOutstanding(next);
                if (!next) {
                  setSettlementText("");
                  setLender("");
                }
                sync({ financeOutstanding: next });
              }}
            />

            {financeOutstanding ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field htmlFor={settleId} label="Outstanding finance amount">
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                      £
                    </span>
                    <Input
                      id={settleId}
                      inputMode="numeric"
                      className="pl-7"
                      value={withCommas(settlementText)}
                      placeholder="0"
                      onChange={(event) => {
                        const text = digits(event.target.value, MAX_SETTLEMENT);
                        setSettlementText(text);
                        const amount = parseNumber(text);
                        if (Number.isFinite(amount)) {
                          sync({
                            outstandingFinanceAmount: amount,
                            settlement: amount,
                          });
                        }
                      }}
                    />
                  </div>
                </Field>
                <Field htmlFor={lenderId} label="Lender (optional)">
                  <Input
                    id={lenderId}
                    value={lender}
                    placeholder="e.g. Black Horse"
                    onChange={(event) => {
                      setLender(event.target.value);
                      sync({ outstandingFinanceLender: event.target.value });
                    }}
                  />
                </Field>
              </div>
            ) : null}

            <Accordion
              title={DEAL_PX_HELP_TITLE}
              className="rounded-xl border border-border bg-page-tint px-3 [&_summary]:text-primary"
            >
              <p>{DEAL_PX_HELP_BODY}</p>
            </Accordion>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <div>
              <p className="text-label">{VE_EXTRAS_HEADING}</p>
              <p className="mt-1 text-caption text-muted">{VE_EXTRAS_SUPPORT}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {VE_EXTRA_OPTIONS.map((option) => {
                const selected = extras.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleExtra(option.id)}
                    className={cn(
                      "min-h-10 rounded-xl border px-3 text-caption font-semibold!",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-ink hover:bg-page-tint",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {extras.includes("private-plate") ? (
              <DealChipGroup
                label={VE_PRIVATE_PLATE_LABEL}
                value={privatePlateDisposition}
                options={[
                  { value: "retain", label: VE_PRIVATE_RETAIN },
                  { value: "sell", label: VE_PRIVATE_SELL },
                ]}
                columns={2}
                onChange={(value) => {
                  setPrivatePlateDisposition(value);
                  syncExtras(extras, value, otherNotes);
                }}
              />
            ) : null}
            {extras.includes("other") ? (
              <Field htmlFor="px-other-notes" label={VE_OTHER_DETAILS}>
                <Input
                  id="px-other-notes"
                  value={otherNotes}
                  onChange={(event) => {
                    setOtherNotes(event.target.value);
                    syncExtras(extras, privatePlateDisposition, event.target.value);
                  }}
                />
              </Field>
            ) : null}
          </div>
        </DealCard>

        <DealCard className="space-y-2.5">
          <p className="text-label text-navy">Deposit summary</p>
          <dl className="space-y-2 text-body-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{DEAL_PX_DEPOSIT_CASH}</dt>
              <dd>
                <FinancialNumber value={formatPounds(cashDeposit)} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{DEAL_PX_DEPOSIT_EQUITY}</dt>
              <dd>
                <FinancialNumber
                  value={
                    owes
                      ? formatPounds(0)
                      : formatPounds(valued ? equity : 0)
                  }
                  size="sm"
                  className={valued && equity > 0 && !owes ? "text-success" : undefined}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2">
              <dt className="text-label">{DEAL_PX_DEPOSIT_TOTAL}</dt>
              <dd>
                <FinancialNumber
                  value={formatPounds(
                    valued && !owes ? totalDeposit : cashDeposit,
                  )}
                  size="sm"
                />
              </dd>
            </div>
          </dl>
          {owes ? (
            <p className="text-caption text-muted">
              Negative equity −{formatPounds(negativeEquity)} is flagged for
              discussion — it is not added to your deposit.
            </p>
          ) : null}
        </DealCard>
      </div>

      <div className="mb-3">
        <SaveDeal />
      </div>

      <DealStepFooter
        showMonthly={false}
        onSkip={() => {
          clearPartExchange();
          goNext("budget");
        }}
        skipLabel={DEAL_SKIP_PX}
        continueLabel={
          owes
            ? DEAL_PX_CALLBACK
            : valued
              ? DEAL_ADD_TO_DEAL
              : DEAL_PX_GET_OFFER
        }
        continueDisabled={owes ? false : continueDisabled}
        note={note}
        busy={valuing}
        onContinue={() => {
          if (owes) {
            router.push(
              getContactUrl({
                stockId: vehicle.stockId,
                topic: "part-exchange",
              }),
            );
            return;
          }
          if (!valued) {
            valueNow();
            return;
          }
          updatePartExchange(details());
          goNext("budget");
        }}
      />
    </div>
  );
}
