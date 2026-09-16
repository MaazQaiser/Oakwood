"use client";

import {
  FinanceBadge,
  FinancialNumber,
} from "@/components/finance/FinancePrimitives";
import { formatAprFloor, formatNumber, formatPounds, formatTerm } from "@/lib/format/money";
import {
  CALCULATOR_ESTIMATE_LABEL,
  CALCULATOR_YOUR_RATE_PREFIX,
} from "@/lib/finance/calculator-copy";
import type { DealCalculation } from "@/types/deal";
import type { DealFinanceProfileInput } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";
import type { FinanceCalculatorStatus } from "@/features/finance/calculator/types";

export function CalculatorSummary({
  status,
  calculation,
  vehiclePrice,
  financeType,
  term,
  annualMileage,
  personalised,
  profile,
  representativeApr,
}: {
  status: FinanceCalculatorStatus;
  calculation?: DealCalculation;
  vehiclePrice: number;
  financeType: FinanceProductType;
  term: number;
  annualMileage?: number;
  personalised: boolean;
  profile?: DealFinanceProfileInput;
  representativeApr?: number;
}) {
  const showPayment = status === "ok" && calculation;
  const monthly = showPayment ? calculation.monthlyPayment : undefined;

  return (
    <aside
      aria-labelledby="calculator-summary-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption text-muted">{CALCULATOR_ESTIMATE_LABEL}</p>
          <h2 id="calculator-summary-heading" className="text-h3">
            Monthly payment
          </h2>
        </div>
        <FinanceBadge state={personalised ? "personalised" : "representative"} />
      </div>

      <p className="mt-3 text-primary" aria-live="polite">
        <FinancialNumber
          value={monthly === undefined ? "—" : formatPounds(monthly)}
          suffix={monthly === undefined ? undefined : "/month"}
          size="lg"
        />
      </p>
      {personalised && profile ? (
        <p className="mt-2 text-caption text-muted">
          {CALCULATOR_YOUR_RATE_PREFIX} {formatAprFloor(profile.apr)}
        </p>
      ) : (
        <p className="mt-2 text-caption text-muted">
          Representative finance illustration. Not your rate, and not an approval.
        </p>
      )}

      <dl className="mt-5 space-y-2 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Cash price</dt>
          <dd>
            <FinancialNumber
              value={
                Number.isFinite(vehiclePrice) && vehiclePrice >= 1
                  ? formatPounds(vehiclePrice)
                  : "—"
              }
              size="sm"
            />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            {calculation?.pxEquity ? "Cash deposit" : "Deposit"}
          </dt>
          <dd>
            <FinancialNumber
              value={formatPounds(calculation?.cashDeposit ?? 0)}
              size="sm"
            />
          </dd>
        </div>
        {calculation?.pxEquity ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Part exchange equity</dt>
            <dd>
              <FinancialNumber
                value={`+ ${formatPounds(calculation.pxEquity)}`}
                size="sm"
              />
            </dd>
          </div>
        ) : null}
        {calculation?.pxEquity ? (
          <div className="flex justify-between gap-4">
            <dt className="text-label">Total deposit</dt>
            <dd>
              <FinancialNumber
                value={formatPounds(calculation.totalDeposit)}
                size="sm"
              />
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Amount financed</dt>
          <dd>
            <FinancialNumber
              value={
                showPayment ? formatPounds(calculation.amountFinanced) : "—"
              }
              size="sm"
            />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{financeType === "pcp" ? "PCP" : "HP"}</dt>
          <dd>{formatTerm(term)}</dd>
        </div>
        {personalised && profile ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">APR</dt>
            <dd>
              <span className="financial-number financial-number--sm">
                {formatAprFloor(profile.apr)}
              </span>
            </dd>
          </div>
        ) : (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">APR</dt>
            <dd className="text-right text-caption text-muted">
              Representative — confirmed at eligibility
            </dd>
          </div>
        )}
        {financeType === "pcp" && annualMileage ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Annual mileage</dt>
            <dd>{formatNumber(annualMileage)} miles</dd>
          </div>
        ) : null}
        {financeType === "pcp" && showPayment && calculation.finalPayment !== undefined ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Optional final payment</dt>
            <dd>
              <FinancialNumber
                value={formatPounds(calculation.finalPayment)}
                size="sm"
              />
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-label">Total payable</dt>
          <dd>
            <FinancialNumber
              value={showPayment ? formatPounds(calculation.totalPayable) : "—"}
              size="sm"
            />
          </dd>
        </div>
      </dl>
    </aside>
  );
}
