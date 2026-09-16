import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Alert } from "@/components/ui/Alert";
import { formatPounds } from "@/lib/format/money";
import {
  PX_ESTIMATED_VALUE_LABEL,
  PX_FINAL_OFFER_CAVEAT,
  PX_INSPECTION_CAVEAT,
  PX_ONLINE_VALUATION_LABEL,
} from "@/lib/part-exchange/copy";
import type { PxValuationDeduction } from "@/types/part-exchange";

export function PxValuationResult({
  estimatedValue,
  deductions,
}: {
  estimatedValue: number;
  deductions?: PxValuationDeduction[];
}) {
  const hasDeductions = Boolean(deductions && deductions.length > 0);

  return (
    <div className="mt-6 space-y-4">
      <p className="text-caption text-muted">{PX_ONLINE_VALUATION_LABEL}</p>
      <p>
        <span className="text-label">{PX_ESTIMATED_VALUE_LABEL}</span>
        <br />
        <FinancialNumber value={formatPounds(estimatedValue)} size="lg" />
      </p>
      <Alert title="This is an estimate" tone="info">
        {PX_INSPECTION_CAVEAT} {PX_FINAL_OFFER_CAVEAT}
      </Alert>
      {hasDeductions ? (
        <dl className="space-y-2 text-body-sm">
          {deductions?.map((item) => (
            <div key={item.label} className="flex justify-between gap-4">
              <dt className="text-muted">{item.label}</dt>
              <dd>
                <FinancialNumber
                  value={
                    item.amount < 0
                      ? `−${formatPounds(Math.abs(item.amount))}`
                      : formatPounds(item.amount)
                  }
                  size="sm"
                />
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-border pt-2">
            <dt className="text-label">Estimated value</dt>
            <dd>
              <FinancialNumber value={formatPounds(estimatedValue)} size="sm" />
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
