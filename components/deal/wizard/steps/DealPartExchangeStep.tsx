"use client";

import { useEffect, useId, useState } from "react";
import { Field, Input } from "@/components/forms/FormControls";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { requestDealAbandonment } from "@/components/deal/DealAbandonmentModal";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { getVehicleUrl } from "@/config/routes";
import {
  DEAL_BACK,
  DEAL_CONTINUE,
  DEAL_PX_FINANCE_LABEL,
  DEAL_PX_HELP_BODY,
  DEAL_PX_HELP_TITLE,
  DEAL_PX_INSPECTION,
  DEAL_PX_NOT_YOUR_VEHICLE,
  DEAL_PX_SETTLEMENT_CHECK,
  DEAL_PX_TOTAL_LABEL,
  DEAL_PX_VALUATION_LABEL,
} from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import type { DealPxCondition, DealPxServiceHistory } from "@/types/deal";

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

type FormErrors = {
  registration?: string;
  mileage?: string;
  condition?: string;
  serviceHistory?: string;
  finance?: string;
  settlement?: string;
  lender?: string;
};

type SavedForm = {
  registration: string;
  mileage: string;
  condition?: DealPxCondition;
  serviceHistory?: DealPxServiceHistory;
  financeOutstanding?: boolean;
  settlementText: string;
  lender: string;
};

function storageKey(dealId: string) {
  return `oakwood-deal-px:${dealId}`;
}

function digits(value: string, max: number): string {
  const raw = value.replace(/\D/g, "").slice(0, String(max).length);
  return raw === "" ? "" : String(Math.min(Number(raw), max));
}

function withCommas(value: string): string {
  return value === "" ? "" : Number(value).toLocaleString("en-GB");
}

function parseAmount(value: string): number {
  return Number(value.replace(/[,£\s]/g, ""));
}

export function DealPartExchangeStep() {
  const { dealId, draft, vehicle } = useDealBuilder();
  const { goNext } = useDealStepNavigation("part-exchange");
  const px = draft.px;
  const regId = useId();
  const milesId = useId();
  const settleId = useId();
  const lenderId = useId();

  const [registration, setRegistration] = useState(px?.registration ?? "");
  const [mileage, setMileage] = useState(px?.mileage ? String(px.mileage) : "");
  const [condition, setCondition] = useState<DealPxCondition | undefined>(
    px?.condition,
  );
  const [serviceHistory, setServiceHistory] = useState<
    DealPxServiceHistory | undefined
  >(px?.serviceHistory);
  const [financeOutstanding, setFinanceOutstanding] = useState<
    boolean | undefined
  >(px?.financeOutstanding);
  const [settlementText, setSettlementText] = useState(
    px?.outstandingFinanceAmount !== undefined
      ? String(px.outstandingFinanceAmount)
      : "",
  );
  const [lender, setLender] = useState(px?.outstandingFinanceLender ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(storageKey(dealId));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as SavedForm;
        setRegistration(saved.registration ?? "");
        setMileage(saved.mileage ?? "");
        setCondition(saved.condition);
        setServiceHistory(saved.serviceHistory);
        setFinanceOutstanding(saved.financeOutstanding);
        setSettlementText(saved.settlementText ?? "");
        setLender(saved.lender ?? "");
      } catch {
        window.sessionStorage.removeItem(storageKey(dealId));
      }
    }
    setHydrated(true);
  }, [dealId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const saved: SavedForm = {
      registration,
      mileage,
      condition,
      serviceHistory,
      financeOutstanding,
      settlementText,
      lender,
    };
    window.sessionStorage.setItem(storageKey(dealId), JSON.stringify(saved));
  }, [
    condition,
    dealId,
    financeOutstanding,
    hydrated,
    lender,
    mileage,
    registration,
    serviceHistory,
    settlementText,
  ]);

  const settlementAmount = parseAmount(settlementText);
  const miles = parseAmount(mileage);
  const financeAnswered = financeOutstanding !== undefined;
  const settlementReady =
    financeOutstanding !== true ||
    (settlementText !== "" &&
      Number.isFinite(settlementAmount) &&
      settlementAmount >= 0 &&
      lender.trim().length > 0);
  const formReady =
    registration.trim().length >= 2 &&
    Number.isFinite(miles) &&
    miles > 0 &&
    Boolean(condition) &&
    Boolean(serviceHistory) &&
    financeAnswered &&
    settlementReady;

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (registration.trim().length < 2) {
      next.registration = "Enter the vehicle registration.";
    }
    if (!Number.isFinite(miles) || miles <= 0) {
      next.mileage = "Enter the current mileage.";
    }
    if (!condition) {
      next.condition = "Choose a vehicle condition.";
    }
    if (!serviceHistory) {
      next.serviceHistory = "Choose the service history.";
    }
    if (!financeAnswered) {
      next.finance = "Say whether there is outstanding finance.";
    }
    if (financeOutstanding === true) {
      if (
        settlementText === "" ||
        !Number.isFinite(settlementAmount) ||
        settlementAmount < 0
      ) {
        next.settlement = "Enter the settlement amount.";
      }
      if (lender.trim().length === 0) {
        next.lender = "Enter the lender.";
      }
    }
    return next;
  }

  function focusFirst(next: FormErrors) {
    const id = next.registration
      ? regId
      : next.mileage
        ? milesId
        : next.settlement
          ? settleId
          : next.lender
            ? lenderId
            : undefined;
    if (id) {
      document.getElementById(id)?.focus();
    }
  }

  function continueToFinance() {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirst(next);
      return;
    }
    goNext("budget");
  }

  function skipToFinance() {
    goNext("budget");
  }

  return (
    <div className="flex flex-1 flex-col">
      <DealCard className="space-y-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="min-h-11 text-caption font-semibold! text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            onClick={() => {
              setRegistration("");
              setMileage("");
              setCondition(undefined);
              setServiceHistory(undefined);
              setFinanceOutstanding(undefined);
              setSettlementText("");
              setLender("");
              setErrors({});
              document.getElementById(regId)?.focus();
            }}
          >
            {DEAL_PX_NOT_YOUR_VEHICLE}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            htmlFor={regId}
            label="Vehicle registration"
            error={errors.registration}
          >
            <Input
              id={regId}
              className="font-semibold! tracking-wider uppercase"
              value={registration}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="Registration"
              error={Boolean(errors.registration)}
              onChange={(event) => {
                setRegistration(event.target.value);
                setErrors((current) => ({ ...current, registration: undefined }));
              }}
            />
          </Field>
          <Field htmlFor={milesId} label="Current mileage" error={errors.mileage}>
            <Input
              id={milesId}
              inputMode="numeric"
              value={withCommas(mileage)}
              placeholder="Mileage"
              error={Boolean(errors.mileage)}
              onChange={(event) => {
                setMileage(digits(event.target.value, 500_000));
                setErrors((current) => ({ ...current, mileage: undefined }));
              }}
            />
          </Field>
        </div>

        <div>
          <DealChipGroup
            label="Vehicle condition"
            value={condition}
            options={CONDITION_OPTIONS}
            columns={2}
            onChange={(value) => {
              setCondition(value);
              setErrors((current) => ({ ...current, condition: undefined }));
            }}
          />
          {errors.condition ? (
            <p className="mt-1.5 text-caption text-danger" role="alert">
              {errors.condition}
            </p>
          ) : null}
        </div>

        <div>
          <DealChipGroup
            label="Service history"
            value={serviceHistory}
            options={SERVICE_OPTIONS}
            columns={3}
            onChange={(value) => {
              setServiceHistory(value);
              setErrors((current) => ({
                ...current,
                serviceHistory: undefined,
              }));
            }}
          />
          {errors.serviceHistory ? (
            <p className="mt-1.5 text-caption text-danger" role="alert">
              {errors.serviceHistory}
            </p>
          ) : null}
        </div>

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
              setErrors((current) => ({
                ...current,
                finance: undefined,
                settlement: undefined,
                lender: undefined,
              }));
            }}
          />
          {errors.finance ? (
            <p className="text-caption text-danger" role="alert">
              {errors.finance}
            </p>
          ) : null}

          {financeOutstanding ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                htmlFor={settleId}
                label="Settlement amount"
                error={errors.settlement}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                    £
                  </span>
                  <Input
                    id={settleId}
                    inputMode="numeric"
                    className="pl-7"
                    value={withCommas(settlementText)}
                    placeholder="Amount"
                    error={Boolean(errors.settlement)}
                    onChange={(event) => {
                      setSettlementText(digits(event.target.value, 150_000));
                      setErrors((current) => ({
                        ...current,
                        settlement: undefined,
                      }));
                    }}
                  />
                </div>
              </Field>
              <Field htmlFor={lenderId} label="Lender" error={errors.lender}>
                <Input
                  id={lenderId}
                  value={lender}
                  placeholder="Lender name"
                  error={Boolean(errors.lender)}
                  onChange={(event) => {
                    setLender(event.target.value);
                    setErrors((current) => ({ ...current, lender: undefined }));
                  }}
                />
              </Field>
            </div>
          ) : null}

          <details className="rounded-2xl bg-page-tint px-4 py-3">
            <summary className="cursor-pointer text-body-sm font-semibold! text-primary">
              {DEAL_PX_HELP_TITLE}
            </summary>
            <p className="mt-2 text-body-sm text-muted">{DEAL_PX_HELP_BODY}</p>
          </details>
        </div>

        {formReady ? (
          <div
            className="rounded-2xl bg-page-tint px-4 py-4"
            role="status"
            aria-label="Part-exchange breakdown"
          >
            <p className="text-label text-navy">Part exchange</p>
            <dl className="mt-3 space-y-2 text-body-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt>{DEAL_PX_VALUATION_LABEL}</dt>
                <dd className="shrink-0 text-right font-semibold! text-ink">
                  Subject to inspection
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt>{DEAL_PX_FINANCE_LABEL}</dt>
                <dd className="shrink-0 font-semibold! text-ink">
                  {financeOutstanding ? `−${formatPounds(settlementAmount)}` : formatPounds(0)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2">
                <dt className="font-semibold text-navy">{DEAL_PX_TOTAL_LABEL}</dt>
                <dd className="shrink-0 text-right font-semibold! text-primary">
                  Subject to inspection
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-caption text-muted">{DEAL_PX_INSPECTION}</p>
            {financeOutstanding ? (
              <p className="mt-1 text-caption text-muted">{DEAL_PX_SETTLEMENT_CHECK}</p>
            ) : null}
          </div>
        ) : null}
      </DealCard>

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_24px_rgb(16_40_72/0.06)] backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:mt-6 lg:mb-5 lg:rounded-[22px] lg:px-4 lg:pb-3 lg:shadow-card">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]">
          <Button
            type="button"
            variant="tertiary"
            className="btn-compact w-full px-4 sm:w-auto"
            onClick={() =>
              requestDealAbandonment(getVehicleUrl(vehicle.slug))
            }
          >
            {DEAL_BACK}
          </Button>
          <Button
            type="button"
            variant="text"
            className="min-h-11 w-full text-body font-semibold! text-primary"
            onClick={skipToFinance}
          >
            Skip part exchange
          </Button>
          <Button type="button" className="btn-compact w-full" onClick={continueToFinance}>
            <span className="truncate">{DEAL_CONTINUE}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
