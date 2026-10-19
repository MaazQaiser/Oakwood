"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  maxCashDeposit,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { SaveProgressPrompt } from "@/components/deal/SaveProgressPrompt";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { getContactUrl } from "@/config/routes";
import {
  DEAL_BUDGET_DEFAULT_DEPOSIT,
  DEAL_BUDGET_HP_BODY,
  DEAL_BUDGET_HP_LEAD,
  DEAL_BUDGET_ILLUSTRATIVE,
  DEAL_BUDGET_PCP_BODY,
  DEAL_BUDGET_PCP_LEAD,
  DEAL_BUDGET_PCP_TERM_BLOCK,
  DEAL_BUDGET_PCP_UNAVAILABLE,
  DEAL_BUDGET_SWITCH_HP,
  DEAL_CONTINUE,
  DEAL_PX_CALLBACK,
  DEAL_PX_NEGATIVE_TITLE,
} from "@/lib/deal/copy";
import { cn } from "@/lib/cn";
import { formatPounds, formatTerm } from "@/lib/format/money";
import type { FinanceProductType } from "@/types/finance";

const PCP_MAX_TERM = 60;

function mileageLabel(miles: number): string {
  return miles >= 1000 ? `${Math.round(miles / 1000)}k` : String(miles);
}

function QuoteStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-page-tint px-3 py-2.5">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 tabular-number text-body-sm font-semibold! text-ink">
        {value}
      </dd>
    </div>
  );
}

function FinanceTypeCard({
  type,
  selected,
  monthly,
  term,
  deposit,
  finalPayment,
  available,
  onSelect,
}: {
  type: FinanceProductType;
  selected: boolean;
  monthly?: number;
  term: number;
  deposit: number;
  finalPayment?: number;
  available: boolean;
  onSelect: () => void;
}) {
  const copy =
    type === "hp"
      ? { name: "Hire Purchase", lead: DEAL_BUDGET_HP_LEAD, body: DEAL_BUDGET_HP_BODY }
      : {
          name: "Personal Contract Purchase",
          lead: DEAL_BUDGET_PCP_LEAD,
          body: DEAL_BUDGET_PCP_BODY,
        };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-disabled={!available}
      disabled={!available}
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col rounded-[20px] border p-4 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        selected
          ? "border-navy bg-navy text-white shadow-[0_10px_24px_rgb(0_40_82/0.22)]"
          : available
            ? "border-border bg-surface text-ink hover:border-primary/40 hover:bg-page-tint"
            : "cursor-not-allowed border-dashed border-border bg-page-tint text-muted opacity-80",
      )}
    >
      <span
        className={cn(
          "text-[0.68rem] font-semibold! uppercase tracking-[0.12em]",
          selected ? "text-white/75" : "text-muted",
        )}
      >
        {type === "hp" ? "HP" : "PCP"} · {copy.lead}
      </span>
      <span className="mt-1 text-label">{copy.name}</span>
      {available && monthly !== undefined ? (
        <p className="mt-3">
          <FinancialNumber
            value={formatPounds(monthly)}
            suffix="/mo"
            size="compact"
            className={selected ? "text-white" : "text-navy"}
          />
        </p>
      ) : (
        <p className={cn("mt-3 text-body-sm", selected ? "text-white/85" : "text-muted")}>
          Not available at this term
        </p>
      )}
      <p className={cn("mt-2 text-caption", selected ? "text-white/80" : "text-muted")}>
        {copy.body}
      </p>
      {available ? (
        <dl className="mt-4 grid grid-cols-2 gap-2">
          <QuoteStat
            label="Deposit"
            value={formatPounds(deposit)}
          />
          <QuoteStat label="Term" value={formatTerm(term)} />
          {type === "pcp" && finalPayment !== undefined ? (
            <div className="col-span-2">
              <QuoteStat
                label="Optional final payment"
                value={formatPounds(finalPayment)}
              />
            </div>
          ) : null}
        </dl>
      ) : null}
    </button>
  );
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
          Cash deposit
        </h2>
        <FinancialNumber value={formatPounds(total)} size="compact" />
      </div>
      <p className="text-caption text-muted">{DEAL_BUDGET_DEFAULT_DEPOSIT}</p>
      {equity > 0 ? (
        <p className="text-caption text-muted">
          {formatPounds(draft.cashDeposit)} cash + {formatPounds(equity)}{" "}
          part-exchange equity = {formatPounds(total)} total deposit.
        </p>
      ) : (
        <p className="text-caption text-muted">
          Total deposit {formatPounds(total)} (cash only).
        </p>
      )}
      {owed > 0 ? (
        <p className="rounded-lg bg-warning-soft/70 px-3 py-2 text-caption text-ink">
          Negative equity of {formatPounds(owed)} is not added to your deposit.
          {config.maxNegativeEquityInAdvance === undefined
            ? " A lender limit is not configured in this prototype."
            : null}
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
          Cash amount
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
  const {
    vehicle,
    draft,
    config,
    finance,
    calculation,
    calculateFor,
    setFinanceType,
    setTerm,
    setAnnualMileage,
  } = useDealBuilder();
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
  const [pcpTermNotice, setPcpTermNotice] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const savePromptSeen = useRef(false);
  const prevType = useRef(draft.financeType);

  useEffect(() => {
    if (
      prevType.current === "pcp" &&
      draft.financeType === "hp" &&
      draft.term > PCP_MAX_TERM
    ) {
      setPcpTermNotice(true);
    }
    prevType.current = draft.financeType;
  }, [draft.financeType, draft.term]);

  const maxTerm = Math.min(
    finance.profile?.maximumTerm ?? Infinity,
    Math.max(...config.termOptions),
  );
  const isPcp = draft.financeType === "pcp";
  const pcpBlockedByTerm = draft.term > PCP_MAX_TERM;
  const negativeEquity = calculation?.pxNegativeEquity ?? 0;
  const neCap = config.maxNegativeEquityInAdvance;
  const neExceedsCap =
    neCap !== undefined && negativeEquity > neCap;

  const hpQuote = calculateFor("hp");
  const pcpQuote = calculateFor("pcp");
  const totalDeposit = calculation?.totalDeposit ?? draft.cashDeposit;

  const termOptions = config.termOptions.map((term) => ({
    value: term,
    label: String(term),
    disabled: term > maxTerm,
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
      <div className="flex-1 space-y-4 pb-5">
        <Alert title="Illustrative figures" tone="info">
          {DEAL_BUDGET_ILLUSTRATIVE}
        </Alert>

        {neExceedsCap ? (
          <div className="space-y-3 rounded-[20px] border border-warning/30 bg-warning-soft/50 px-4 py-4">
            <p className="text-label text-ink">{DEAL_PX_NEGATIVE_TITLE}</p>
            <p className="text-body-sm text-ink">
              Part-exchange negative equity of {formatPounds(negativeEquity)}{" "}
              is above the configured lender limit of {formatPounds(neCap)}.
              Please contact Oakwood before continuing.
            </p>
            <Button
              href={getContactUrl({
                stockId: vehicle.stockId,
                topic: "part-exchange",
              })}
            >
              {DEAL_PX_CALLBACK}
            </Button>
          </div>
        ) : null}

        <DealCard className="space-y-5">
          <div>
            <h2 className="text-label">Compare HP and PCP</h2>
            <p className="mt-1 text-caption text-muted">
              Both quotes use your current deposit and term. Select a card to
              choose that product.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Finance type"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <FinanceTypeCard
              type="hp"
              selected={draft.financeType === "hp"}
              monthly={hpQuote?.monthlyPayment}
              term={draft.term}
              deposit={totalDeposit}
              available
              onSelect={() => {
                setPcpTermNotice(false);
                setFinanceType("hp");
              }}
            />
            <FinanceTypeCard
              type="pcp"
              selected={draft.financeType === "pcp"}
              monthly={pcpQuote?.monthlyPayment}
              term={Math.min(draft.term, PCP_MAX_TERM)}
              deposit={totalDeposit}
              finalPayment={pcpQuote?.finalPayment}
              available={!pcpBlockedByTerm && config.pcpEnabled}
              onSelect={() => {
                setPcpTermNotice(false);
                setFinanceType("pcp");
              }}
            />
          </div>

          {pcpTermNotice || pcpBlockedByTerm ? (
            <div className="space-y-2">
              <Alert title="72/84 is HP only" tone="warning">
                {pcpTermNotice
                  ? DEAL_BUDGET_PCP_TERM_BLOCK
                  : DEAL_BUDGET_PCP_UNAVAILABLE}
              </Alert>
              {draft.financeType !== "hp" ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setPcpTermNotice(false);
                    setFinanceType("hp");
                  }}
                >
                  {DEAL_BUDGET_SWITCH_HP}
                </Button>
              ) : null}
            </div>
          ) : null}

          <DepositCard />

          <DealChipGroup
            label="Term"
            aside="HP 24–84 · PCP 24–60"
            value={draft.term}
            options={termOptions}
            columns={6}
            onChange={(value) => {
              if (draft.financeType === "pcp" && value > PCP_MAX_TERM) {
                setPcpTermNotice(true);
              } else {
                setPcpTermNotice(false);
              }
              setTerm(value);
            }}
            hint={
              isPcp
                ? "Months. Choosing 72 or 84 switches you to Hire Purchase."
                : "Months. PCP is available up to 60 months."
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
                hint="Used for PCP quotes. HP does not use annual mileage."
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

      <div className="mb-3">
        <SaveDeal />
      </div>

      <SaveProgressPrompt
        open={savePromptOpen}
        onContinue={() => {
          setSavePromptOpen(false);
          goNext("cover");
        }}
      />

      <DealStepFooter
        onBack={() => goBack("part-exchange")}
        onContinue={() => {
          // Spec §13: soft “Save your progress?” on Step 2 → Step 3 (once).
          if (!savePromptSeen.current) {
            savePromptSeen.current = true;
            setSavePromptOpen(true);
            return;
          }
          goNext("cover");
        }}
        continueLabel={DEAL_CONTINUE}
        continueDisabled={neExceedsCap}
        note={
          neExceedsCap
            ? DEAL_PX_NEGATIVE_TITLE
            : undefined
        }
      />
    </div>
  );
}
