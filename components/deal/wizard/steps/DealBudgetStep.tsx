"use client";

import { useId, useState } from "react";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Input } from "@/components/forms/FormControls";
import {
  maxCashDeposit,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { DEAL_GET_MY_DECISION } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";

const PCP_MAX_TERM = 60;

function mileageLabel(miles: number): string {
  return miles >= 1000 ? `${Math.round(miles / 1000)}k` : String(miles);
}

function DepositCard() {
  const { draft, calculation, config, vehicle, setCashDeposit } =
    useDealBuilder();
  const sliderId = useId();
  const inputId = useId();
  const [typed, setTyped] = useState<string>();
  const max = maxCashDeposit(
    vehicle.cashPrice,
    config.maxDepositCap,
    config.depositStep,
    draft.px,
  );
  const equity = calculation?.pxEquity ?? 0;
  const owed = calculation?.pxNegativeEquity ?? 0;
  const total = calculation?.totalDeposit ?? draft.cashDeposit;
  const fill = max > 0 ? (Math.min(max, draft.cashDeposit) / max) * 100 : 0;

  function commit(text: string) {
    const next = Number(text.replace(/[,£\s]/g, ""));
    if (text.trim() !== "" && Number.isFinite(next)) {
      setCashDeposit(next);
    }
  }

  return (
    <section aria-labelledby={`${sliderId}-label`} className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`${sliderId}-label`} className="text-label">
          Deposit
        </h2>
        <FinancialNumber value={formatPounds(total)} size="compact" />
      </div>
      {equity > 0 ? (
        <p className="text-caption text-muted">
          {formatPounds(draft.cashDeposit)} cash + {formatPounds(equity)}{" "}
          part-exchange equity. Change your part exchange in step 1.
        </p>
      ) : null}
      {owed > 0 ? (
        <p className="rounded-lg bg-warning-soft/70 px-3 py-2 text-caption text-ink">
          {formatPounds(owed)} still owed on your part exchange is added to what
          you borrow.
        </p>
      ) : null}

      <div>
        <label htmlFor={sliderId} className="sr-only">
          Cash deposit
        </label>
        <input
          id={sliderId}
          type="range"
          min={config.minDeposit}
          max={max}
          step={config.depositStep}
          value={Math.min(max, draft.cashDeposit)}
          aria-valuetext={formatPounds(draft.cashDeposit)}
          onChange={(event) => {
            setTyped(undefined);
            setCashDeposit(Number(event.target.value));
          }}
          className="h-11 w-full cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, var(--oak-primary) ${fill}%, var(--oak-border) ${fill}%) center / 100% 4px no-repeat`,
          }}
        />
        <div className="flex justify-between text-caption text-muted">
          <span>{formatPounds(config.minDeposit)}</span>
          <span>{formatPounds(max)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={inputId} className="shrink-0 text-body-sm text-muted">
          Cash deposit
        </label>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            £
          </span>
          <Input
            id={inputId}
            inputMode="numeric"
            autoComplete="off"
            className="pl-7 tabular-number"
            value={typed ?? draft.cashDeposit.toLocaleString("en-GB")}
            onChange={(event) => {
              setTyped(event.target.value);
              commit(event.target.value);
            }}
            onBlur={() => setTyped(undefined)}
          />
        </div>
      </div>
    </section>
  );
}

export function DealBudgetStep() {
  const { draft, config, finance, setTerm, setAnnualMileage } =
    useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("budget");
  const customId = useId();
  const presetMiles = config.pcpMileageOptions;
  const isPreset = draft.annualMileage
    ? presetMiles.includes(draft.annualMileage)
    : true;
  const [otherSelected, setOtherSelected] = useState(!isPreset);
  const [otherValue, setOtherValue] = useState(
    !isPreset && draft.annualMileage ? String(draft.annualMileage) : "",
  );
  const maxTerm = Math.min(
    finance.profile?.maximumTerm ?? Infinity,
    Math.max(...config.termOptions),
  );
  const isPcp = draft.financeType === "pcp";

  const termOptions = config.termOptions.map((term) => ({
    value: term,
    label: String(term),
    disabled: term > maxTerm || (isPcp && term > PCP_MAX_TERM),
  }));

  const mileageOptions = [
    ...presetMiles.map((miles) => ({
      value: String(miles),
      label: mileageLabel(miles),
    })),
    ...(config.pcpEnabled ? [{ value: "other", label: "Other" }] : []),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 pb-5">
        <DealCard className="space-y-6">
          <DepositCard />

          <DealChipGroup
            label="Term"
            aside="HP 24–84 · PCP 24–60"
            value={draft.term}
            options={termOptions}
            columns={6}
            onChange={setTerm}
            hint={
              isPcp
                ? "Months. 72 and 84 are HP only, switch to HP on your quote."
                : "Months. We never extend your term automatically."
            }
          />

          {config.pcpEnabled ? (
            <div className="space-y-3">
              <DealChipGroup
                label="Annual mileage"
                value={
                  otherSelected ? "other" : String(draft.annualMileage ?? "")
                }
                options={mileageOptions}
                columns={3}
                onChange={(value) => {
                  if (value === "other") {
                    setOtherSelected(true);
                    return;
                  }
                  setOtherSelected(false);
                  setAnnualMileage(Number(value));
                }}
                hint="Only used for PCP, which you can compare on your quote."
              />
              {otherSelected ? (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor={customId}
                    className="shrink-0 text-body-sm text-muted"
                  >
                    Miles a year
                  </label>
                  <Input
                    id={customId}
                    inputMode="numeric"
                    placeholder="e.g. 20,000"
                    value={otherValue}
                    onChange={(event) => {
                      setOtherValue(event.target.value);
                      const next = Number(
                        event.target.value.replace(/[,\s]/g, ""),
                      );
                      if (Number.isFinite(next) && next > 0) {
                        setAnnualMileage(next);
                      }
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </DealCard>
      </div>

      <DealStepFooter
        onBack={() => goBack("part-exchange")}
        onContinue={() => goNext("decision")}
        continueLabel={DEAL_GET_MY_DECISION}
      />
    </div>
  );
}
