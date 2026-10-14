"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, Lock, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { getSearchUrl, supportRoutes } from "@/config/routes";
import {
  DEAL_DECISION_APPROVED_LESS_BODY,
  DEAL_DECISION_APPROVED_LESS_TITLE,
  DEAL_DECISION_LOADING,
  DEAL_DECISION_REFER_BODY,
  DEAL_DECISION_REFER_TITLE,
  DEAL_RUN_SOFT_CHECK,
  DEAL_SOFT_SEARCH,
} from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import type { DealDecisionOutcome } from "@/types/deal";

const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
];

const NEXT_UP = [
  "Your real HP monthly for this car",
  "Your real PCP monthly with final payment",
  "Build cover to tailor the deal",
  "Reserve when you're ready",
];

function mockOutcome(
  income: number,
  vehiclePrice: number,
): {
  outcome: DealDecisionOutcome;
  apr: number;
  extraDepositNeeded?: number;
} {
  // Prototype triggers: income under £12k → refer (supportive callback UI,
  // never a blunt decline screen).
  if (income < 12000) {
    return { outcome: "refer", apr: 0 };
  }
  if (income * 4 < vehiclePrice) {
    const maxAdvance = income * 3.5;
    const extra = Math.max(500, Math.round(vehiclePrice - maxAdvance - 2000));
    return { outcome: "approved_less", apr: 14.9, extraDepositNeeded: extra };
  }
  return { outcome: "approved", apr: 11.9 };
}

function splitDob(iso?: string): [string, string, string] {
  const [y = "", m = "", d = ""] = iso?.split("-") ?? [];
  return [d, m, y];
}

function ageOn(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) {
    age -= 1;
  }
  return age;
}

type Errors = Partial<
  Record<
    "name" | "dob" | "postcode" | "address" | "employment" | "income",
    string
  >
>;

function SecureBadge() {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-surface-soft px-3.5 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-primary">
        <Lock className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="text-label">Secure soft check</p>
        <p className="text-caption text-muted">
          Will not affect your credit score
        </p>
      </div>
    </div>
  );
}

function ResultHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-card bg-navy px-5 py-7 text-center text-white shadow-card">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-oakwood/25 blur-3xl"
      />
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15">
        <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
      </span>
      <p className="mt-3 text-caption uppercase tracking-[0.08em] text-white/75">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-h5 text-white">{title}</h2>
      <p className="mt-1 text-body-sm text-white/80">{body}</p>
      {children}
    </div>
  );
}

export function DealDecisionStep() {
  const { draft, vehicle, setDecision, setCashDeposit } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("decision");
  const existing = draft.decision;
  const nameId = useId();
  const dobId = useId();
  const postcodeId = useId();
  const addressId = useId();
  const incomeId = useId();
  const employmentId = useId();
  const [fullName, setFullName] = useState(existing?.fullName ?? "");
  const [[day, month, year], setDob] = useState(
    splitDob(existing?.dateOfBirth),
  );
  const [postcode, setPostcode] = useState(existing?.postcode ?? "");
  const [addressLine, setAddressLine] = useState(existing?.addressLine ?? "");
  const [employmentStatus, setEmploymentStatus] = useState(
    existing?.employmentStatus ?? "",
  );
  const [yearlyIncome, setYearlyIncome] = useState(
    existing?.yearlyIncome ? String(existing.yearlyIncome) : "",
  );
  const [lookupHint, setLookupHint] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<"form" | "loading" | "result">(
    existing?.outcome ? "result" : "form",
  );
  const [result, setResult] = useState(existing);
  const firstRender = useRef(true);

  // Each phase swap replaces the page content, so start the customer at the
  // top instead of mid-page where the submit button was.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  /** Drop a field's error as soon as the customer edits it. */
  const clear = (key: keyof Errors) =>
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );
  const income = Number(yearlyIncome.replace(/[,£\s]/g, ""));

  function dobIso(): string | null {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (!d || !m || year.length !== 4) {
      return null;
    }
    const date = new Date(y, m - 1, d);
    if (date.getDate() !== d || date.getMonth() !== m - 1) {
      return null;
    }
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function validate(): Errors {
    const next: Errors = {};
    if (fullName.trim().split(/\s+/).length < 2) {
      next.name = "Enter your first and last name.";
    }
    const iso = dobIso();
    if (!iso) {
      next.dob = "Enter a real date of birth, for example 27 03 1988.";
    } else if (ageOn(new Date(iso)) < 18) {
      next.dob = "You must be 18 or over to apply for finance.";
    }
    if (postcode.trim().replace(/\s/g, "").length < 5) {
      next.postcode = "Enter your full UK postcode.";
    }
    if (addressLine.trim().length < 4) {
      next.address = "Find or enter your address.";
    }
    if (!employmentStatus) {
      next.employment = "Choose your employment status.";
    }
    if (!Number.isFinite(income) || income <= 0) {
      next.income = "Enter your yearly income before tax.";
    }
    return next;
  }

  function lookupAddress() {
    const code = postcode.trim().toUpperCase();
    if (code.replace(/\s/g, "").length < 5) {
      setErrors((current) => ({
        ...current,
        postcode: "Enter your full UK postcode.",
      }));
      return;
    }
    setErrors((current) => ({
      ...current,
      postcode: undefined,
      address: undefined,
    }));
    setAddressLine(`1 Example Street, Sampletown, ${code}`);
    setLookupHint("Prototype lookup. Check and edit the address if needed.");
  }

  function runCheck() {
    const found = validate();
    setErrors(found);
    const fieldIds: Record<keyof Errors, string> = {
      name: nameId,
      dob: dobId,
      postcode: postcodeId,
      address: addressId,
      employment: employmentId,
      income: incomeId,
    };
    const first = (Object.keys(fieldIds) as (keyof Errors)[]).find(
      (key) => found[key],
    );
    if (first) {
      document.getElementById(fieldIds[first])?.focus();
      return;
    }
    setPhase("loading");
    window.setTimeout(() => {
      const decision = mockOutcome(income, vehicle.cashPrice);
      const next = {
        fullName: fullName.trim(),
        dateOfBirth: dobIso() ?? "",
        postcode: postcode.trim().toUpperCase(),
        addressLine: addressLine.trim() || undefined,
        employmentStatus,
        yearlyIncome: income,
        ...decision,
      };
      setDecision(next);
      setResult(next);
      setPhase("result");
    }, 1400);
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary"
          aria-hidden
        />
        <p className="text-body font-semibold!" role="status">
          {DEAL_DECISION_LOADING}
        </p>
        <p className="max-w-xs text-caption text-muted">{DEAL_SOFT_SEARCH}</p>
      </div>
    );
  }

  if (phase === "result" && result?.outcome) {
    const editDetails = () => setPhase("form");

    if (result.outcome === "approved") {
      return (
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 pb-5">
            <ResultHero
              eyebrow="Decision in principle"
              title="You're approved"
              body="Based on the information you've given us."
            >
              <div className="relative mt-5 rounded-[20px] bg-white/10 px-4 py-3.5">
                <p className="text-caption text-white/75">Your personal APR</p>
                <p className="financial-number financial-number--compact mt-1 text-white">
                  {(result.apr ?? 11.9).toFixed(1)}%
                </p>
                <p className="mt-1 text-caption text-white/75">
                  Final rate set at full application.
                </p>
              </div>
              <p className="mt-4 text-caption text-white/80">
                No credit footprint. No obligation.
              </p>
            </ResultHero>

            <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
              <p className="text-label">What we&apos;ll show you next</p>
              <ul className="mt-2 space-y-1.5">
                {NEXT_UP.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-body-sm"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-success"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DealStepFooter
            onBack={editDetails}
            backLabel="Edit details"
            onContinue={() => goNext("cover")}
            continueLabel="Build your cover"
          />
        </div>
      );
    }

    if (result.outcome === "approved_less") {
      const extra = result.extraDepositNeeded ?? 0;
      return (
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 pb-5">
            <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
              <p className="text-caption uppercase tracking-[0.08em] text-muted">
                Decision in principle
              </p>
              <h2 className="mt-1 text-h5">
                {DEAL_DECISION_APPROVED_LESS_TITLE}
              </h2>
              <p className="mt-1 text-body-sm text-muted">
                {DEAL_DECISION_APPROVED_LESS_BODY}
              </p>
              {extra > 0 ? (
                <div className="mt-4 flex items-baseline justify-between gap-3 rounded-[14px] bg-page-tint px-4 py-3">
                  <span className="text-body-sm text-muted">
                    Extra deposit for this car
                  </span>
                  <FinancialNumber value={formatPounds(extra)} size="sm" />
                </div>
              ) : null}
            </div>
            <Button
              href={getSearchUrl({ affordable: 1 })}
              variant="tertiary"
              className="w-full"
            >
              View cars within my budget
            </Button>
          </div>
          <DealStepFooter
            onBack={editDetails}
            backLabel="Edit details"
            continueLabel={
              extra > 0 ? `Add ${formatPounds(extra)} and continue` : "Continue"
            }
            onContinue={() => {
              if (extra > 0) {
                setCashDeposit(draft.cashDeposit + extra);
              }
              goNext("cover");
            }}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 pb-5">
          <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">
              <PhoneCall className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-3 text-h5">{DEAL_DECISION_REFER_TITLE}</h2>
            <p className="mt-1 text-body-sm text-muted">
              {DEAL_DECISION_REFER_BODY}
            </p>
            <p className="mt-3 text-caption text-muted">{DEAL_SOFT_SEARCH}</p>
          </div>
          <Button
            variant="tertiary"
            className="w-full"
            onClick={() => goNext("cover")}
          >
            Keep building my deal
          </Button>
        </div>
        <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex gap-2 border-t border-border bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-6 sm:px-6">
          <Button
            variant="tertiary"
            className="btn-compact shrink-0 px-4"
            onClick={editDetails}
          >
            Edit details
          </Button>
          <Button
            href={supportRoutes.bookingEnquiry}
            className="btn-compact min-w-0 flex-1"
          >
            Request a callback
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        runCheck();
      }}
    >
      <div className="flex-1 pb-5">
        <DealCard className="space-y-5">
          <SecureBadge />

          <Field htmlFor={nameId} label="Full name" error={errors.name}>
            <Input
              id={nameId}
              value={fullName}
              autoComplete="name"
              error={Boolean(errors.name)}
              onChange={(event) => {
                setFullName(event.target.value);
                clear("name");
              }}
            />
          </Field>

          <fieldset
            aria-describedby={errors.dob ? `${dobId}-error` : undefined}
          >
            <legend className="text-label">Date of birth</legend>
            <div className="mt-1.5 grid grid-cols-[1fr_1fr_1.6fr] gap-2">
              {(
                [
                  ["Day", "DD", day, 2, "bday-day"],
                  ["Month", "MM", month, 2, "bday-month"],
                  ["Year", "YYYY", year, 4, "bday-year"],
                ] as const
              ).map(([label, placeholder, value, max, auto], index) => (
                <label key={label} className="block">
                  <span className="sr-only">{label}</span>
                  <Input
                    id={index === 0 ? dobId : undefined}
                    inputMode="numeric"
                    autoComplete={auto}
                    maxLength={max}
                    placeholder={placeholder}
                    value={value}
                    error={Boolean(errors.dob)}
                    className="text-center tabular-number"
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "");
                      clear("dob");
                      setDob((current) => {
                        const next = [...current] as [string, string, string];
                        next[index] = digits;
                        return next;
                      });
                    }}
                  />
                </label>
              ))}
            </div>
            {errors.dob ? (
              <p
                id={`${dobId}-error`}
                className="mt-1.5 text-caption text-danger"
                role="alert"
              >
                {errors.dob}
              </p>
            ) : null}
          </fieldset>

          <div className="space-y-3">
            <Field
              htmlFor={postcodeId}
              label="Postcode"
              error={errors.postcode}
            >
              <div className="flex gap-2">
                <Input
                  id={postcodeId}
                  className="flex-1 uppercase"
                  value={postcode}
                  autoComplete="postal-code"
                  error={Boolean(errors.postcode)}
                  onChange={(event) => {
                    setPostcode(event.target.value);
                    setLookupHint(null);
                    clear("postcode");
                  }}
                />
                <Button
                  type="button"
                  variant="tertiary"
                  className="shrink-0"
                  onClick={lookupAddress}
                >
                  Find address
                </Button>
              </div>
            </Field>
            <Field
              htmlFor={addressId}
              label="Address"
              hint={lookupHint ?? undefined}
              error={errors.address}
            >
              <Input
                id={addressId}
                value={addressLine}
                autoComplete="street-address"
                placeholder="Find from your postcode, or type it"
                error={Boolean(errors.address)}
                onChange={(event) => {
                  setAddressLine(event.target.value);
                  clear("address");
                }}
              />
            </Field>
          </div>

          <div id={employmentId} tabIndex={-1} className="outline-none">
            <DealChipGroup
              label="Employment status"
              value={employmentStatus}
              options={EMPLOYMENT_OPTIONS}
              columns={2}
              onChange={(value) => {
                setEmploymentStatus(value);
                clear("employment");
              }}
            />
            {errors.employment ? (
              <p className="mt-1.5 text-caption text-danger" role="alert">
                {errors.employment}
              </p>
            ) : null}
          </div>

          <Field
            htmlFor={incomeId}
            label="Gross annual income"
            hint="Before tax, per year"
            error={errors.income}
          >
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                £
              </span>
              <Input
                id={incomeId}
                inputMode="numeric"
                className="pl-7 tabular-number"
                value={yearlyIncome}
                placeholder="32,000"
                error={Boolean(errors.income)}
                onChange={(event) => {
                  setYearlyIncome(event.target.value);
                  clear("income");
                }}
              />
            </div>
          </Field>

          <p className="text-caption text-muted">
            Powered by iVendi. The soft search uses Autoconvert underwriting
            rules. We only run a hard search if you choose to go ahead with an
            application.
          </p>
        </DealCard>
      </div>

      <DealStepFooter
        onBack={() => goBack("budget")}
        onContinue={runCheck}
        continueLabel={DEAL_RUN_SOFT_CHECK}
        submit
      />
    </form>
  );
}
