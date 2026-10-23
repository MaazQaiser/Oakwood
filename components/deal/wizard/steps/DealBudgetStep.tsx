"use client";

import { useEffect, useId, useState } from "react";
import { Field, Input } from "@/components/forms/FormControls";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import {
  DEAL_BUDGET_DEFAULT_DEPOSIT,
  DEAL_BUDGET_HP_BODY,
  DEAL_BUDGET_HP_LEAD,
  DEAL_BUDGET_PCP_BODY,
  DEAL_BUDGET_PCP_LEAD,
  DEAL_BUDGET_PCP_TERM_BLOCK,
} from "@/lib/deal/copy";
import { formatNumber, formatPounds } from "@/lib/format/money";
import type { FinanceProductType } from "@/types/finance";

const TERMS = [24, 36, 48, 60, 72, 84] as const;
const PCP_MAX_TERM = 60;
const MILEAGE_PRESETS = [6000, 8000, 10000, 12000, 15000] as const;

type MileageChoice = `${(typeof MILEAGE_PRESETS)[number]}` | "other";

type SavedFinance = {
  deposit: number;
  financeType: FinanceProductType;
  term: number;
  mileageChoice: MileageChoice;
  otherMileage: string;
};

function financeKey(dealId: string) {
  return `oakwood-deal-finance:${dealId}`;
}

function clampDeposit(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.round(value)));
}

function isMileageChoice(value: string): value is MileageChoice {
  return (
    value === "other" ||
    MILEAGE_PRESETS.some((miles) => String(miles) === value)
  );
}

function digits(value: string, maxLength: number): string {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function withCommas(value: string): string {
  return value === "" ? "" : Number(value).toLocaleString("en-GB");
}

export function DealBudgetStep() {
  const { dealId, config, vehicle } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("budget");
  const sliderId = useId();
  const amountId = useId();
  const otherId = useId();

  const [deposit, setDeposit] = useState(0);
  const [depositText, setDepositText] = useState("0");
  const [financeType, setFinanceType] = useState<FinanceProductType>("hp");
  const [term, setTerm] = useState<number>(84);
  const [hpOnlyNote, setHpOnlyNote] = useState(false);
  const [mileageChoice, setMileageChoice] = useState<MileageChoice>("10000");
  const [otherMileage, setOtherMileage] = useState("");
  const [mileageError, setMileageError] = useState<string>();
  const [hydrated, setHydrated] = useState(false);

  const minDeposit = config.minDeposit;
  const maxDeposit = config.maxDepositCap;

  useEffect(() => {
    const raw = window.sessionStorage.getItem(financeKey(dealId));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Partial<SavedFinance>;
        const savedDeposit = clampDeposit(
          Number(saved.deposit),
          minDeposit,
          maxDeposit,
        );
        const savedType = saved.financeType === "pcp" ? "pcp" : "hp";
        const savedTerm = TERMS.find((item) => item === Number(saved.term)) ?? 84;
        const savedMileage = isMileageChoice(String(saved.mileageChoice))
          ? saved.mileageChoice
          : "10000";
        setDeposit(savedDeposit);
        setDepositText(String(savedDeposit));
        setFinanceType(savedType);
        setTerm(savedType === "pcp" && savedTerm > PCP_MAX_TERM ? 60 : savedTerm);
        setMileageChoice(savedMileage ?? "10000");
        setOtherMileage(digits(String(saved.otherMileage ?? ""), 6));
        setHydrated(true);
        return;
      } catch {
        window.sessionStorage.removeItem(financeKey(dealId));
      }
    }

    const tenPercent = Math.round(vehicle.cashPrice * 0.1);
    const starting = clampDeposit(tenPercent, minDeposit, maxDeposit);
    setDeposit(starting);
    setDepositText(String(starting));
    setTerm(84);
    setHydrated(true);
  }, [dealId, maxDeposit, minDeposit, vehicle.cashPrice]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const saved: SavedFinance = {
      deposit,
      financeType,
      term,
      mileageChoice,
      otherMileage,
    };
    window.sessionStorage.setItem(financeKey(dealId), JSON.stringify(saved));
  }, [
    dealId,
    deposit,
    financeType,
    hydrated,
    mileageChoice,
    otherMileage,
    term,
  ]);

  const fill =
    maxDeposit > minDeposit
      ? ((deposit - minDeposit) / (maxDeposit - minDeposit)) * 100
      : 0;

  const activeDeposit = formatPounds(deposit);

  function applyDeposit(next: number) {
    const clamped = clampDeposit(next, minDeposit, maxDeposit);
    setDeposit(clamped);
    setDepositText(String(clamped));
  }

  function selectFinanceType(next: FinanceProductType) {
    setHpOnlyNote(false);
    setMileageError(undefined);
    if (next === "pcp" && term > PCP_MAX_TERM) {
      setFinanceType("pcp");
      setTerm(PCP_MAX_TERM);
      return;
    }
    setFinanceType(next);
  }

  function selectTerm(months: number) {
    if (financeType === "pcp" && months > PCP_MAX_TERM) {
      setFinanceType("hp");
      setTerm(months);
      setHpOnlyNote(true);
      return;
    }
    setHpOnlyNote(false);
    setTerm(months);
  }

  function continueToDeal() {
    if (financeType === "pcp" && mileageChoice === "other") {
      const miles = Number(otherMileage);
      if (!otherMileage || !Number.isFinite(miles) || miles <= 0) {
        setMileageError("Enter the annual mileage.");
        document.getElementById(otherId)?.focus();
        return;
      }
    }
    goNext("quote");
  }

  return (
    <div>
      <DealCard>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: "hp" as const,
                  title: "Hire Purchase",
                  lead: DEAL_BUDGET_HP_LEAD,
                  body: DEAL_BUDGET_HP_BODY,
                  termNote: "84 months",
                },
                {
                  value: "pcp" as const,
                  title: "Personal Contract Purchase",
                  lead: DEAL_BUDGET_PCP_LEAD,
                  body: DEAL_BUDGET_PCP_BODY,
                  termNote: "60 months",
                },
              ]
            ).map((option) => {
              const selected = financeType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectFinanceType(option.value)}
                  className={`rounded-2xl px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                    selected
                      ? "bg-navy text-white"
                      : "bg-page-tint text-ink hover:bg-surface-soft"
                  }`}
                >
                  <p className={`text-caption font-semibold! uppercase tracking-[0.08em] ${selected ? "text-white/70" : "text-muted"}`}>
                    {option.lead}
                  </p>
                  <p className="mt-1 text-label">{option.title}</p>
                  <p className={`mt-1 text-caption ${selected ? "text-white/80" : "text-muted"}`}>
                    {option.body}
                  </p>
                  <p className={`mt-2 text-caption font-semibold! ${selected ? "text-white" : "text-navy"}`}>
                    {option.termNote}
                  </p>
                </button>
              );
            })}
          </div>
          {hpOnlyNote ? (
            <p className="text-body-sm text-navy" role="status">
              {DEAL_BUDGET_PCP_TERM_BLOCK}
            </p>
          ) : null}

          <section aria-labelledby={`${sliderId}-label`} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id={`${sliderId}-label`} className="text-label">
                Deposit
              </h2>
              <p className="rounded-full bg-primary px-3 py-1 text-caption font-semibold! text-white">
                <span className="sr-only">Selected deposit </span>
                {hydrated ? activeDeposit : formatPounds(deposit)}
              </p>
            </div>
            {hydrated ? (
              <p className="text-caption text-muted">{DEAL_BUDGET_DEFAULT_DEPOSIT}</p>
            ) : null}
            <div>
              <label htmlFor={sliderId} className="sr-only">
                Deposit amount in pounds
              </label>
              <input
                id={sliderId}
                type="range"
                min={minDeposit}
                max={maxDeposit}
                step={1}
                value={deposit}
                aria-valuetext={formatPounds(deposit)}
                onChange={(event) => applyDeposit(Number(event.target.value))}
                className="h-11 w-full cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, var(--oak-primary) ${fill}%, var(--oak-border) ${fill}%) center / 100% 4px no-repeat`,
                }}
              />
              <div className="flex justify-between text-caption text-muted">
                <span>{formatPounds(minDeposit)}</span>
                <span>{formatPounds(maxDeposit)}</span>
              </div>
            </div>
            <Field
              htmlFor={amountId}
              label="Deposit amount"
              hint="In pounds."
            >
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                  £
                </span>
                <Input
                  id={amountId}
                  inputMode="numeric"
                  autoComplete="off"
                  className="pl-7 tabular-number"
                  value={withCommas(depositText)}
                  onChange={(event) => {
                    const next = digits(event.target.value, 7);
                    if (next === "") {
                      setDepositText("");
                      return;
                    }
                    const amount = Number(next);
                    const clamped = clampDeposit(
                      amount,
                      minDeposit,
                      maxDeposit,
                    );
                    setDeposit(clamped);
                    setDepositText(String(clamped === amount ? amount : clamped));
                  }}
                  onBlur={() => setDepositText(String(deposit))}
                />
              </div>
            </Field>
          </section>

          <DealChipGroup
            label="Finance term"
            value={term}
            columns={3}
            hint="Hire Purchase starts at 84 months. Personal Contract Purchase starts at 60 months. 72 and 84 months are Hire Purchase only."
            options={TERMS.map((months) => ({
              value: months,
              label: `${months} months`,
            }))}
            onChange={selectTerm}
          />

          {financeType === "pcp" ? (
            <div className="space-y-3">
              <DealChipGroup
                label="Annual mileage"
                value={mileageChoice}
                columns={2}
                options={[
                  ...MILEAGE_PRESETS.map((miles) => ({
                    value: String(miles) as MileageChoice,
                    label: `${formatNumber(miles)} miles`,
                  })),
                  { value: "other" as const, label: "Other" },
                ]}
                onChange={(value) => {
                  setMileageChoice(value);
                  setMileageError(undefined);
                }}
              />
              {mileageChoice === "other" ? (
                <Field
                  htmlFor={otherId}
                  label="Annual mileage"
                  error={mileageError}
                >
                  <Input
                    id={otherId}
                    inputMode="numeric"
                    autoComplete="off"
                    value={withCommas(otherMileage)}
                    placeholder="Miles a year"
                    error={Boolean(mileageError)}
                    onChange={(event) => {
                      setOtherMileage(digits(event.target.value, 6));
                      setMileageError(undefined);
                    }}
                  />
                </Field>
              ) : null}
            </div>
          ) : null}
        </div>
      </DealCard>

      <DealStepFooter
        onBack={() => goBack("part-exchange")}
        onContinue={continueToDeal}
        showMonthly={false}
      />
    </div>
  );
}
