"use client";

import { useState } from "react";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { DEAL_PX_EQUITY_LINE } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import type { DealPxCondition, DealPxServiceHistory } from "@/types/deal";

const CONDITION_OPTIONS: { value: DealPxCondition; label: string }[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "needs-work", label: "Needs work" },
];

const SERVICE_OPTIONS: { value: DealPxServiceHistory; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "partial", label: "Partial" },
  { value: "none", label: "None" },
];

export function DealPartExchangeStep() {
  const {
    draft,
    pxError,
    calculation,
    startPartExchange,
    updatePartExchange,
    clearPartExchange,
    setSettlement,
  } = useDealBuilder();
  const { goNext } = useDealStepNavigation("part-exchange");
  const [registration, setRegistration] = useState(
    draft.px?.registration ?? "",
  );
  const [mileage, setMileage] = useState(
    draft.px?.mileage ? String(draft.px.mileage) : "",
  );

  const equity = calculation?.pxEquity ?? 0;
  const settlement = draft.px?.settlement ?? 0;
  const valuation = draft.px?.value;

  function valueNow() {
    const miles = Number(mileage);
    if (!registration.trim() || !Number.isFinite(miles) || miles <= 0) {
      return;
    }
    startPartExchange(registration, miles);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-label">Registration</span>
          <input
            className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3 uppercase"
            value={registration}
            autoComplete="off"
            onChange={(event) => setRegistration(event.target.value)}
            onBlur={valueNow}
          />
        </label>
        <label className="block">
          <span className="text-label">Mileage</span>
          <input
            className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
            inputMode="numeric"
            value={mileage}
            onChange={(event) => setMileage(event.target.value)}
            onBlur={valueNow}
          />
        </label>
      </div>

      <DealChipGroup
        label="Overall condition"
        value={draft.px?.condition}
        options={CONDITION_OPTIONS}
        onChange={(condition) => {
          if (!draft.px) {
            valueNow();
          }
          updatePartExchange({ condition });
        }}
      />

      <DealChipGroup
        label="Service history"
        value={draft.px?.serviceHistory}
        options={SERVICE_OPTIONS}
        onChange={(serviceHistory) => updatePartExchange({ serviceHistory })}
      />

      <DealChipGroup
        label="Outstanding finance"
        value={
          draft.px?.financeOutstanding === undefined
            ? undefined
            : draft.px.financeOutstanding
              ? "yes"
              : "no"
        }
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        onChange={(value) => {
          const financeOutstanding = value === "yes";
          updatePartExchange({ financeOutstanding });
          if (!financeOutstanding) {
            setSettlement(undefined);
          }
        }}
      />

      {draft.px?.financeOutstanding ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-label">Amount outstanding</span>
            <input
              className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
              inputMode="numeric"
              value={draft.px.outstandingFinanceAmount ?? ""}
              onChange={(event) => {
                const amount = Number(event.target.value);
                updatePartExchange({
                  outstandingFinanceAmount: Number.isFinite(amount)
                    ? amount
                    : undefined,
                });
                if (Number.isFinite(amount)) {
                  setSettlement(amount);
                }
              }}
            />
          </label>
          <label className="block">
            <span className="text-label">Lender</span>
            <input
              className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
              value={draft.px.outstandingFinanceLender ?? ""}
              onChange={(event) =>
                updatePartExchange({
                  outstandingFinanceLender: event.target.value,
                })
              }
            />
          </label>
        </div>
      ) : null}

      {pxError ? <p className="text-body-sm text-warning">{pxError}</p> : null}

      {valuation !== undefined ? (
        <div className="rounded-md border border-border bg-page p-4 space-y-2">
          <div className="flex justify-between gap-3 text-body-sm">
            <span className="text-muted">Valuation</span>
            <FinancialNumber value={formatPounds(valuation)} size="sm" />
          </div>
          <div className="flex justify-between gap-3 text-body-sm">
            <span className="text-muted">Settlement</span>
            <FinancialNumber value={formatPounds(settlement)} size="sm" />
          </div>
          <p className="text-label text-primary">
            {DEAL_PX_EQUITY_LINE(formatPounds(equity))}
          </p>
        </div>
      ) : (
        <p className="text-body-sm text-muted">
          Enter registration and mileage to see a valuation. You can skip if you
          do not have a part exchange.
        </p>
      )}

      <DealStepFooter
        onContinue={() => {
          if (registration.trim() && mileage) {
            valueNow();
          }
          goNext("budget");
        }}
        onSkip={() => {
          clearPartExchange();
          goNext("budget");
        }}
      />
    </div>
  );
}
