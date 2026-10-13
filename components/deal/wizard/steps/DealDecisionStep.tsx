"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { getSearchUrl, supportRoutes } from "@/config/routes";
import {
  DEAL_DECISION_APPROVED_BODY,
  DEAL_DECISION_APPROVED_LESS_BODY,
  DEAL_DECISION_APPROVED_LESS_TITLE,
  DEAL_DECISION_APPROVED_TITLE,
  DEAL_DECISION_LOADING,
  DEAL_DECISION_REFER_BODY,
  DEAL_DECISION_REFER_TITLE,
  DEAL_SEE_MY_QUOTE,
  DEAL_SOFT_SEARCH,
} from "@/lib/deal/copy";
import { formatAprFloor, formatPounds } from "@/lib/format/money";
import type { DealDecisionOutcome } from "@/types/deal";

const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
];

function mockOutcome(income: number, vehiclePrice: number): {
  outcome: DealDecisionOutcome;
  apr: number;
  extraDepositNeeded?: number;
} {
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

export function DealDecisionStep() {
  const { draft, vehicle, setDecision, applyDepositGap, setCashDeposit } =
    useDealBuilder();
  const { goNext, goBack, goTo } = useDealStepNavigation("decision");
  const existing = draft.decision;
  const [fullName, setFullName] = useState(existing?.fullName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(existing?.dateOfBirth ?? "");
  const [postcode, setPostcode] = useState(existing?.postcode ?? "");
  const [addressLine, setAddressLine] = useState(existing?.addressLine ?? "");
  const [employmentStatus, setEmploymentStatus] = useState(
    existing?.employmentStatus ?? "",
  );
  const [yearlyIncome, setYearlyIncome] = useState(
    existing?.yearlyIncome ? String(existing.yearlyIncome) : "",
  );
  const [phase, setPhase] = useState<"form" | "loading" | "result">(
    existing?.outcome ? "result" : "form",
  );
  const [result, setResult] = useState(existing);

  const canSubmit =
    fullName.trim().length > 1 &&
    Boolean(dateOfBirth) &&
    postcode.trim().length >= 5 &&
    Boolean(employmentStatus) &&
    Number(yearlyIncome) > 0;

  function runCheck() {
    if (!canSubmit) {
      return;
    }
    setPhase("loading");
    window.setTimeout(() => {
      const income = Number(yearlyIncome);
      const decision = mockOutcome(income, vehicle.cashPrice);
      const next = {
        fullName: fullName.trim(),
        dateOfBirth,
        postcode: postcode.trim().toUpperCase(),
        addressLine: addressLine.trim() || undefined,
        employmentStatus,
        yearlyIncome: income,
        ...decision,
      };
      setDecision(next);
      setResult(next);
      setPhase("result");
    }, 1200);
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-hidden
        />
        <p className="text-body" role="status">
          {DEAL_DECISION_LOADING}
        </p>
        <p className="text-caption text-muted">{DEAL_SOFT_SEARCH}</p>
      </div>
    );
  }

  if (phase === "result" && result?.outcome) {
    if (result.outcome === "approved") {
      return (
        <div className="space-y-4">
          <h2 className="text-h3">{DEAL_DECISION_APPROVED_TITLE}</h2>
          <p className="text-body-sm text-muted">{DEAL_DECISION_APPROVED_BODY}</p>
          <p className="text-caption text-muted">{DEAL_SOFT_SEARCH}</p>
          <div className="rounded-md border border-border bg-page p-4">
            <p className="text-caption text-muted">Your rate, or better</p>
            <p className="text-h2 text-primary">
              {formatAprFloor(result.apr ?? 11.9)}
            </p>
          </div>
          <Button className="w-full" onClick={() => goTo("quote")}>
            {DEAL_SEE_MY_QUOTE}
          </Button>
          <DealStepFooter
            onBack={() => setPhase("form")}
            onContinue={() => goNext("cover")}
            continueLabel="Continue to cover"
          />
        </div>
      );
    }

    if (result.outcome === "approved_less") {
      return (
        <div className="space-y-4">
          <h2 className="text-h3">{DEAL_DECISION_APPROVED_LESS_TITLE}</h2>
          <p className="text-body-sm text-muted">
            {DEAL_DECISION_APPROVED_LESS_BODY}
          </p>
          {result.extraDepositNeeded ? (
            <div className="rounded-md border border-border bg-page p-4">
              <p className="text-caption text-muted">
                Extra deposit needed for this car
              </p>
              <FinancialNumber
                value={formatPounds(result.extraDepositNeeded)}
                size="md"
              />
              <Button
                className="mt-3 w-full"
                variant="secondary"
                onClick={() => {
                  setCashDeposit(
                    draft.cashDeposit + (result.extraDepositNeeded ?? 0),
                  );
                  applyDepositGap();
                  goNext("cover");
                }}
              >
                Add deposit and continue
              </Button>
            </div>
          ) : null}
          <Button
            href={getSearchUrl({ affordable: 1 })}
            variant="secondary"
            className="w-full"
          >
            View cars within budget
          </Button>
          <DealStepFooter
            onBack={() => setPhase("form")}
            onContinue={() => goNext("cover")}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-h3">{DEAL_DECISION_REFER_TITLE}</h2>
        <p className="text-body-sm text-muted">{DEAL_DECISION_REFER_BODY}</p>
        <p className="text-caption text-muted">{DEAL_SOFT_SEARCH}</p>
        <Button href={supportRoutes.bookingEnquiry} className="w-full">
          Request a callback
        </Button>
        <DealStepFooter
          onBack={() => setPhase("form")}
          onContinue={() => goNext("cover")}
          continueLabel="Continue anyway"
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="rounded-md bg-primary-soft px-3 py-2 text-body-sm text-ink">
        {DEAL_SOFT_SEARCH}
      </p>

      <label className="block">
        <span className="text-label">Full name</span>
        <input
          className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
          value={fullName}
          autoComplete="name"
          onChange={(event) => setFullName(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-label">Date of birth</span>
        <input
          type="date"
          className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
          value={dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-label">Postcode</span>
        <input
          className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3 uppercase"
          value={postcode}
          autoComplete="postal-code"
          onChange={(event) => setPostcode(event.target.value)}
          onBlur={() => {
            if (postcode.trim().length >= 5 && !addressLine) {
              setAddressLine(`1 Example Street, ${postcode.trim().toUpperCase()}`);
            }
          }}
        />
      </label>

      <label className="block">
        <span className="text-label">Address</span>
        <input
          className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
          value={addressLine}
          autoComplete="street-address"
          onChange={(event) => setAddressLine(event.target.value)}
          placeholder="Looked up from postcode"
        />
      </label>

      <DealChipGroup
        label="Employment status"
        value={employmentStatus}
        options={EMPLOYMENT_OPTIONS}
        onChange={setEmploymentStatus}
      />

      <label className="block">
        <span className="text-label">Yearly income before tax</span>
        <input
          className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
          inputMode="numeric"
          value={yearlyIncome}
          onChange={(event) => setYearlyIncome(event.target.value)}
        />
      </label>

      <DealStepFooter
        onBack={() => goBack("budget")}
        onContinue={runCheck}
        continueDisabled={!canSubmit}
        continueLabel="Check my options"
      />
    </div>
  );
}
