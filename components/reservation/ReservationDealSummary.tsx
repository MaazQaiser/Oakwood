import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { getDealUrl } from "@/config/routes";
import { reservationCopy } from "@/lib/reservation/copy";
import { formatNumber, formatPounds, formatTerm } from "@/lib/format/money";
import type { ReservationDealSnapshot } from "@/types/reservation";

export function ReservationDealSummary({
  deal,
  dealChanged,
}: {
  deal: ReservationDealSnapshot;
  dealChanged?: boolean;
}) {
  return (
    <section
      aria-labelledby="reservation-deal-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="reservation-deal-heading" className="text-h3">
        Your deal
      </h2>
      {dealChanged ? (
        <div className="mt-3">
          <Alert title="Your deal has changed" tone="warning">
            {reservationCopy.dealChanged}
            <div className="mt-3">
              <Button href={getDealUrl(deal.dealId)} size="sm">
                Back to deal
              </Button>
            </div>
          </Alert>
        </div>
      ) : null}
      <dl className="mt-4 space-y-2 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Vehicle</dt>
          <dd>
            <FinancialNumber value={formatPounds(deal.vehiclePrice)} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Deposit</dt>
          <dd>
            <FinancialNumber value={formatPounds(deal.cashDeposit)} size="sm" />
          </dd>
        </div>
        {deal.pxEquity > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Part exchange</dt>
            <dd>
              <FinancialNumber value={formatPounds(deal.pxEquity)} size="sm" />
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Finance</dt>
          <dd>{deal.financeType === "pcp" ? "PCP" : "HP"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Term</dt>
          <dd>{formatTerm(deal.term)}</dd>
        </div>
        {deal.annualMileage ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Annual mileage</dt>
            <dd>{formatNumber(deal.annualMileage)} miles</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-muted">Estimated monthly payment</dt>
          <dd>
            <FinancialNumber
              value={`${formatPounds(deal.monthlyPayment)}/month`}
              size="sm"
            />
          </dd>
        </div>
      </dl>
    </section>
  );
}
