"use client";

import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { cn } from "@/lib/cn";
import {
  DEAL_EMAIL_DEAL,
  DEAL_ILLUSTRATION_PERSONALISED,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  DEAL_RESERVE_CAR,
} from "@/lib/deal/copy";
import { listSelectedProducts } from "@/lib/deal/products";
import {
  formatApr,
  formatPounds,
  formatTerm,
} from "@/lib/format/money";

export function DealQuoteStep() {
  const {
    draft,
    calculation,
    finance,
    setFinanceType,
    vehicle,
  } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("quote");
  const personalised = finance.hasProfile || Boolean(draft.decision?.apr);
  const apr = draft.decision?.apr ?? finance.profile?.apr ?? 16.9;
  const products = listSelectedProducts(draft.productIds);

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Finance type"
        className="grid grid-cols-2 gap-2"
      >
        {(
          [
            { id: "hp" as const, label: "HP" },
            { id: "pcp" as const, label: "PCP" },
          ] as const
        ).map((tab) => {
          const selected = draft.financeType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "min-h-11 rounded-md border text-button",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border-strong bg-surface",
              )}
              onClick={() => setFinanceType(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <p className="text-caption text-muted">No 0% option online.</p>

      <div className="rounded-lg border border-border bg-page p-4 text-center">
        <p className="text-caption text-muted">Monthly payment</p>
        <FinancialNumber
          value={formatPounds(calculation?.monthlyPayment ?? 0)}
          suffix="/month"
          size="lg"
          className="text-primary"
        />
        <p className="mt-1 text-body-sm text-muted">{formatApr(apr)} APR</p>
      </div>

      <ol className="space-y-3">
        <li className="rounded-md border border-border p-3">
          <p className="text-caption text-muted">Up front</p>
          <p className="text-label">
            Deposit {formatPounds(calculation?.totalDeposit ?? draft.cashDeposit)}
          </p>
        </li>
        <li className="rounded-md border border-border p-3">
          <p className="text-caption text-muted">Monthly</p>
          <p className="text-label">
            {formatTerm(draft.term)} ×{" "}
            {formatPounds(calculation?.monthlyPayment ?? 0)}
          </p>
        </li>
        <li className="rounded-md border border-border p-3">
          <p className="text-caption text-muted">End of term</p>
          <p className="text-label">
            {draft.financeType === "pcp"
              ? `Optional final payment ${formatPounds(calculation?.finalPayment ?? 0)}`
              : "You own the car once all payments are made"}
          </p>
        </li>
      </ol>

      <div className="rounded-md border border-border bg-page p-4 space-y-2 text-body-sm">
        <p className="text-label">Finance example</p>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Cash price</span>
          <span>{formatPounds(vehicle.cashPrice)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Amount financed</span>
          <span>{formatPounds(calculation?.amountFinanced ?? 0)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Total payable</span>
          <span>{formatPounds(calculation?.totalPayable ?? 0)}</span>
        </div>
        {products.length ? (
          <div className="flex justify-between gap-3">
            <span className="text-muted">Cover</span>
            <span>{products.map((item) => item.name).join(", ")}</span>
          </div>
        ) : null}
        <p className="pt-2 text-caption text-muted">
          {personalised
            ? DEAL_ILLUSTRATION_PERSONALISED
            : DEAL_ILLUSTRATION_REPRESENTATIVE}
        </p>
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={() => goNext("reserve")}>
          {DEAL_RESERVE_CAR}
        </Button>
        <div className="rounded-md border border-border p-3">
          <p className="text-label">{DEAL_EMAIL_DEAL}</p>
          <SaveDeal />
        </div>
      </div>

      <DealStepFooter
        onBack={() => goBack("cover")}
        onContinue={() => goNext("reserve")}
        continueLabel={DEAL_RESERVE_CAR}
      />
    </div>
  );
}
