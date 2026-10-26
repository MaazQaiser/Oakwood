"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Field, Input } from "@/components/forms/FormControls";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
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
  DEAL_CALCULATION_ERROR,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  DEAL_QUOTE_UNAVAILABLE,
  DEAL_SOFT_SEARCH,
  DEAL_TOTAL_PAYABLE_LABEL,
} from "@/lib/deal/copy";
import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { getRatesFromLabel } from "@/lib/finance/representative-example";
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
  const {
    dealId,
    config,
    vehicle,
    draft,
    calculation,
    phase,
    calculateFor,
    setCashDeposit,
    setFinanceType: persistFinanceType,
    setTerm: persistTerm,
    setAnnualMileage,
    retryCalculation,
  } = useDealBuilder();
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
  const seeded = useRef(false);

  const minDeposit = config.minDeposit;
  const maxDeposit = config.maxDepositCap;

  useEffect(() => {
    if (seeded.current) {
      return;
    }
    seeded.current = true;
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

    const savedType = draft.financeType === "pcp" ? "pcp" : "hp";
    const savedTerm =
      TERMS.find((item) => item === draft.term) ??
      (savedType === "pcp" ? PCP_MAX_TERM : 84);
    const starting = clampDeposit(draft.cashDeposit, minDeposit, maxDeposit);
    setDeposit(starting);
    setDepositText(String(starting));
    setFinanceType(savedType);
    setTerm(savedType === "pcp" && savedTerm > PCP_MAX_TERM ? PCP_MAX_TERM : savedTerm);
    if (draft.annualMileage && MILEAGE_PRESETS.includes(draft.annualMileage as (typeof MILEAGE_PRESETS)[number])) {
      setMileageChoice(String(draft.annualMileage) as MileageChoice);
    } else if (draft.annualMileage) {
      setMileageChoice("other");
      setOtherMileage(String(draft.annualMileage));
    }
    setHydrated(true);
  }, [dealId, draft.annualMileage, draft.cashDeposit, draft.financeType, draft.term, maxDeposit, minDeposit]);

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
    setCashDeposit(deposit);
    persistFinanceType(financeType);
    persistTerm(term);
    const miles =
      financeType === "pcp"
        ? mileageChoice === "other"
          ? Number(otherMileage)
          : Number(mileageChoice)
        : undefined;
    if (miles && Number.isFinite(miles) && miles > 0) {
      setAnnualMileage(miles);
    }
  }, [
    dealId,
    deposit,
    financeType,
    hydrated,
    mileageChoice,
    otherMileage,
    persistFinanceType,
    persistTerm,
    setAnnualMileage,
    setCashDeposit,
    term,
  ]);

  const fill =
    maxDeposit > minDeposit
      ? ((deposit - minDeposit) / (maxDeposit - minDeposit)) * 100
      : 0;

  const activeDeposit = formatPounds(deposit);
  const hpTerm = financeType === "hp" ? term : 84;
  const pcpTerm = financeType === "pcp" ? Math.min(term, PCP_MAX_TERM) : PCP_MAX_TERM;
  const hpQuote = calculateFor("hp", hpTerm);
  const pcpQuote = calculateFor("pcp", pcpTerm);
  const ratesFrom = getRatesFromLabel(FINANCE_CALCULATOR_CONFIG.ratesFromApr);
  const quotes: Record<"hp" | "pcp", typeof hpQuote> = {
    hp: hpQuote,
    pcp: pcpQuote,
  };

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
                  termNote: `${hpTerm} months`,
                },
                {
                  value: "pcp" as const,
                  title: "Personal Contract Purchase",
                  lead: DEAL_BUDGET_PCP_LEAD,
                  body: DEAL_BUDGET_PCP_BODY,
                  termNote: `${pcpTerm} months`,
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
                  {phase === "CALCULATION_ERROR" ? (
                    <p className={`mt-2 text-caption ${selected ? "text-white/80" : "text-muted"}`}>
                      {DEAL_CALCULATION_ERROR}
                    </p>
                  ) : quotes[option.value] ? (
                    <p className="mt-2">
                      <FinancialNumber
                        value={formatPounds(quotes[option.value]?.monthlyPayment ?? 0)}
                        suffix="/mo"
                        size="sm"
                        className={selected ? "text-white" : "text-primary"}
                      />
                      <span className={`mt-1 block text-caption ${selected ? "text-white/75" : "text-muted"}`}>
                        {DEAL_TOTAL_PAYABLE_LABEL}{" "}
                        {formatPounds(quotes[option.value]?.totalPayable ?? 0)}
                      </span>
                    </p>
                  ) : (
                    <p className={`mt-2 text-caption ${selected ? "text-white/80" : "text-muted"}`}>
                      {DEAL_QUOTE_UNAVAILABLE}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          {hpOnlyNote ? (
            <p className="text-body-sm text-navy" role="status">
              {DEAL_BUDGET_PCP_TERM_BLOCK}
            </p>
          ) : null}
          {phase === "CALCULATION_ERROR" ? (
            <Button type="button" variant="secondary" onClick={retryCalculation}>
              Try the quote again
            </Button>
          ) : null}
          <div
            className="rounded-2xl border border-dotted border-primary/40 bg-primary-soft px-4 py-3 text-caption text-navy"
            role="note"
          >
            <p>{DEAL_ILLUSTRATION_REPRESENTATIVE}</p>
            <p className="mt-1">
              {DEAL_SOFT_SEARCH}
              {ratesFrom ? ` ${ratesFrom}.` : ""}
            </p>
          </div>

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
              <p className="text-caption text-muted">
                {DEAL_BUDGET_DEFAULT_DEPOSIT}
                {calculation && draft.px
                  ? ` Part-exchange equity of ${formatPounds(calculation.pxEquity)} is added on top. Total towards the deposit: ${formatPounds(calculation.totalDeposit)}.`
                  : ""}
                {calculation && calculation.pxNegativeEquity > 0
                  ? ` Shortfall of ${formatPounds(calculation.pxNegativeEquity)} is handled with the lender's negative-equity rule.`
                  : ""}
              </p>
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
