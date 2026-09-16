"use client";

import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { FinanceConstraintMessage } from "@/components/deal/FinanceConstraintMessage";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { ShareDeal } from "@/components/deal/ShareDeal";
import {
  DEAL_APPLICATION_BOUNDARY,
  DEAL_ILLUSTRATION_PERSONALISED,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  DEAL_UPDATING,
} from "@/lib/deal/copy";
import { formatAprFloor, formatPounds, formatTerm } from "@/lib/format/money";
import { listSelectedProducts } from "@/lib/deal/products";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { getEligibilityUrl, getUsedCarsUrl, routes } from "@/config/routes";
import { cn } from "@/lib/cn";

export function DealCta() {
  const {
    dealId,
    calculation,
    needsEligibility,
    vehicleUnavailable,
    finance,
    vehicle,
  } = useDealBuilder();
  const invalid = Boolean(calculation && !calculation.valid);

  if (vehicleUnavailable) {
    return (
      <Button href={`${getUsedCarsUrl()}#similar-cars`} className="w-full">
        View similar cars
      </Button>
    );
  }

  if (finance.expired) {
    return (
      <Button href={getEligibilityUrl()} className="w-full">
        Check eligibility again
      </Button>
    );
  }

  if (needsEligibility) {
    return (
      <Button href={getEligibilityUrl()} className="w-full">
        Check my eligibility
      </Button>
    );
  }

  if (invalid) {
    return (
      <StartReservationButton
        stockId={vehicle.stockId}
        dealId={dealId}
        className="w-full"
      />
    );
  }

  return (
    <StartReservationButton
      stockId={vehicle.stockId}
      dealId={dealId}
      className="w-full"
    />
  );
}

export function DealSummary({ sticky = false }: { sticky?: boolean }) {
  const {
    vehicle,
    draft,
    calculation,
    phase,
    finance,
  } = useDealBuilder();
  const personalised = finance.hasProfile;
  const updating = phase === "RECALCULATING";
  const products = listSelectedProducts(draft.productIds);

  return (
    <aside
      aria-labelledby="deal-summary-heading"
      className={cn(
        "rounded-lg border border-border bg-surface p-4 md:p-5",
        sticky && "lg:sticky lg:top-24",
      )}
    >
      <h2 id="deal-summary-heading" className="text-h3">
        Your deal
      </h2>
      <p className="mt-1 text-caption text-muted">
        {personalised
          ? "Estimated monthly payment"
          : "Representative finance illustration"}
      </p>
      <p
        className={cn("mt-3 text-primary", updating && "opacity-60")}
        aria-busy={updating}
      >
        <FinancialNumber
          value={formatPounds(calculation?.monthlyPayment ?? 0)}
          suffix="/month"
          size="lg"
        />
      </p>
      {updating ? (
        <p className="mt-1 text-caption text-muted" role="status">
          {DEAL_UPDATING}
        </p>
      ) : null}
      {personalised && finance.profile ? (
        <p className="mt-2 text-caption text-muted">
          Based on your finance profile. Your rate, {formatAprFloor(finance.profile.apr)}.
        </p>
      ) : (
        <p className="mt-2 text-caption text-muted">
          {DEAL_ILLUSTRATION_REPRESENTATIVE}
        </p>
      )}

      <dl className="mt-5 space-y-2 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Vehicle</dt>
          <dd>
            <FinancialNumber value={formatPounds(vehicle.cashPrice)} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            {calculation?.pxEquity ? "Cash deposit" : "Deposit"}
          </dt>
          <dd>
            <FinancialNumber
              value={formatPounds(calculation?.cashDeposit ?? draft.cashDeposit)}
              size="sm"
            />
          </dd>
        </div>
        {calculation?.pxEquity ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Part exchange</dt>
            <dd>
              <FinancialNumber value={formatPounds(calculation.pxEquity)} size="sm" />
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
        {calculation && calculation.pxNegativeEquity > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Negative equity</dt>
            <dd>
              <FinancialNumber
                value={`−${formatPounds(calculation.pxNegativeEquity)}`}
                size="sm"
              />
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Amount financed</dt>
          <dd>
            <FinancialNumber
              value={formatPounds(calculation?.amountFinanced ?? 0)}
              size="sm"
            />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            {draft.financeType === "pcp" ? "PCP" : "HP"}
          </dt>
          <dd>{formatTerm(draft.term)}</dd>
        </div>
        {draft.financeType === "pcp" && draft.annualMileage ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Annual mileage</dt>
            <dd>{draft.annualMileage.toLocaleString("en-GB")} miles</dd>
          </div>
        ) : null}
        {calculation?.finalPayment !== undefined && draft.financeType === "pcp" ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Final payment</dt>
            <dd>
              <FinancialNumber
                value={formatPounds(calculation.finalPayment)}
                size="sm"
              />
            </dd>
          </div>
        ) : null}
        {products.map((product) => (
          <div key={product.id} className="flex justify-between gap-4">
            <dt className="text-muted">{product.name}</dt>
            <dd>
              <FinancialNumber value={formatPounds(product.price)} size="sm" />
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-label">Total amount payable</dt>
          <dd>
            <FinancialNumber
              value={formatPounds(calculation?.totalPayable ?? 0)}
              size="sm"
            />
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <FinanceConstraintMessage />
      </div>

      <div className="mt-5">
        <div className="hidden lg:block">
          <DealCta />
        </div>
        <p className="mt-2 text-caption text-muted">{DEAL_APPLICATION_BOUNDARY}</p>
        {personalised ? (
          <p className="mt-2 text-caption text-muted">
            {DEAL_ILLUSTRATION_PERSONALISED}
          </p>
        ) : null}
        <p className="mt-3">
          <a
            href={routes.statusDisclosure}
            className="text-caption text-primary underline-offset-4 hover:underline"
          >
            Status disclosure
          </a>
          {" · "}
          <a
            href={routes.vehiclePurchaseTerms}
            className="text-caption text-primary underline-offset-4 hover:underline"
          >
            Vehicle purchase terms
          </a>
        </p>
      </div>

      <div className="mt-4 flex flex-col items-start gap-1">
        <SaveDeal />
        <ShareDeal />
      </div>
    </aside>
  );
}
