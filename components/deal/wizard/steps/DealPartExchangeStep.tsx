"use client";

import { useId, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Field, Input } from "@/components/forms/FormControls";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { DEAL_ADD_TO_DEAL, DEAL_SKIP_PX } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";
import type {
  DealPartExchangeInput,
  DealPxCondition,
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

/** Sanity caps so a slip of the keyboard can't create a £1bn settlement. */
const MAX_MILES = 500_000;
const MAX_SETTLEMENT = 150_000;

/** Keep digits only, capped, and show them with thousands separators. */
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
    draft,
    pxError,
    calculation,
    startPartExchange,
    updatePartExchange,
    clearPartExchange,
  } = useDealBuilder();
  const { goNext } = useDealStepNavigation("part-exchange");
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
    px?.outstandingFinanceAmount ? String(px.outstandingFinanceAmount) : "",
  );
  const [lender, setLender] = useState(px?.outstandingFinanceLender ?? "");

  const miles = parseNumber(mileage);
  const hasVehicle =
    normaliseReg(registration).length >= 2 &&
    Number.isFinite(miles) &&
    miles > 0;
  const settlementAmount = parseNumber(settlementText);
  const settlementMissing =
    financeOutstanding === true &&
    !(Number.isFinite(settlementAmount) && settlementAmount > 0);
  const answered =
    Boolean(condition) &&
    Boolean(serviceHistory) &&
    financeOutstanding !== undefined &&
    !settlementMissing;
  const valued =
    px?.value !== undefined &&
    px.registration === normaliseReg(registration) &&
    px.mileage === miles;
  const settlement = px?.settlement ?? 0;
  const equity = calculation?.pxEquity ?? 0;
  const negativeEquity = calculation?.pxNegativeEquity ?? 0;
  const owes = negativeEquity > 0;

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
    };
  }

  function valueNow() {
    if (!hasVehicle || valued) {
      return;
    }
    startPartExchange(registration, miles);
    updatePartExchange(details());
  }

  /** Keep the saved PX in step with the form once a valuation exists. */
  function sync(patch: Partial<DealPartExchangeInput>) {
    if (px) {
      updatePartExchange(patch);
    }
  }

  const note = !hasVehicle
    ? "Enter your registration and mileage to get an offer."
    : valued && settlementMissing
      ? "Enter the settlement figure from your lender to add this car."
      : valued && !answered
        ? "Answer the three questions above to add this car."
        : undefined;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 pb-5">
        <DealCard className="space-y-5">
          <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-3">
            <Field htmlFor={regId} label="Registration">
              <Input
                id={regId}
                className="font-semibold! tracking-wider uppercase"
                value={registration}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="AB21 CDE"
                onChange={(event) => setRegistration(event.target.value)}
                onBlur={valueNow}
              />
            </Field>
            <Field htmlFor={milesId} label="Mileage">
              <Input
                id={milesId}
                inputMode="numeric"
                value={withCommas(mileage)}
                placeholder="42,000"
                onChange={(event) =>
                  setMileage(digits(event.target.value, MAX_MILES))
                }
                onBlur={valueNow}
              />
            </Field>
          </div>

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
                // `financeOutstanding: false` also clears settlement in the provider.
                sync({ financeOutstanding: next });
              }}
            />

            {financeOutstanding ? (
              <div className="grid grid-cols-2 gap-3">
                <Field htmlFor={settleId} label="Settlement">
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
                          sync({ outstandingFinanceAmount: amount });
                        }
                      }}
                    />
                  </div>
                </Field>
                <Field htmlFor={lenderId} label="Lender">
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
          </div>

          {pxError ? (
            <p
              className="rounded-lg bg-warning-soft px-3 py-2 text-body-sm text-ink"
              role="alert"
            >
              {pxError} You can skip this step and we&apos;ll value it in the
              showroom.
            </p>
          ) : null}

          {valued && px ? (
            <div
              className={cn(
                "rounded-[20px] px-4 py-4",
                owes ? "bg-warning-soft/70" : "bg-success-soft/60",
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
                Our offer
              </p>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <FinancialNumber
                  value={formatPounds(px.value)}
                  size="compact"
                  className={owes ? "text-ink" : "text-success"}
                />
                <span
                  className={cn(
                    "text-caption",
                    owes ? "text-ink" : "text-success",
                  )}
                >
                  {settlement > 0 ? (
                    <>
                      less {formatPounds(settlement)} finance ={" "}
                      <strong>
                        {negativeEquity > 0
                          ? `−${formatPounds(negativeEquity)}`
                          : `${formatPounds(equity)} equity`}
                      </strong>
                    </>
                  ) : (
                    <>{formatPounds(equity)} towards your deposit</>
                  )}
                </span>
              </div>
              <p
                className={cn(
                  "mt-1.5 text-caption",
                  owes ? "text-ink" : "text-success",
                )}
              >
                {owes
                  ? "You owe more than our offer. The difference can be added to your new finance."
                  : "Subject to our inspection. Price is firm, not an estimate."}
              </p>
            </div>
          ) : null}
        </DealCard>
      </div>

      <DealStepFooter
        showMonthly={false}
        onSkip={() => {
          clearPartExchange();
          goNext("budget");
        }}
        skipLabel={DEAL_SKIP_PX}
        continueLabel={valued ? DEAL_ADD_TO_DEAL : "Get my offer"}
        continueDisabled={!hasVehicle || (valued && !answered)}
        note={note}
        onContinue={() => {
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
