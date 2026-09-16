import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Alert } from "@/components/ui/Alert";
import { formatPounds } from "@/lib/format/money";
import {
  PX_EQUITY_TOWARDS_DEPOSIT,
  PX_NEGATIVE_EQUITY_EXPLAIN,
  PX_NEGATIVE_EQUITY_LABEL,
  PX_NEGATIVE_EQUITY_NEXT,
} from "@/lib/part-exchange/copy";
import type { PxEquityType, PxIdentifiedVehicle } from "@/types/part-exchange";

export function PxEquitySummary({
  estimatedValue,
  settlementFigure,
  equity,
  shortfall,
  equityType,
  vehicle,
}: {
  estimatedValue: number;
  settlementFigure: number;
  equity: number;
  shortfall: number;
  equityType: PxEquityType;
  vehicle?: PxIdentifiedVehicle;
}) {
  return (
    <div className="space-y-4">
      {vehicle ? (
        <p className="text-body-sm text-muted">
          {vehicle.make} {vehicle.model}
        </p>
      ) : null}
      <dl className="space-y-2 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Estimated value</dt>
          <dd>
            <FinancialNumber value={formatPounds(estimatedValue)} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Settlement figure</dt>
          <dd>
            <FinancialNumber value={formatPounds(settlementFigure)} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-label">
            {equityType === "negative" ? "Shortfall" : "Your equity"}
          </dt>
          <dd>
            <FinancialNumber
              value={
                equityType === "negative"
                  ? `−${formatPounds(shortfall)}`
                  : formatPounds(equity)
              }
              size="sm"
            />
          </dd>
        </div>
      </dl>
      {equityType === "negative" ? (
        <Alert title={`${PX_NEGATIVE_EQUITY_LABEL}: −${formatPounds(shortfall)}`} tone="warning">
          {PX_NEGATIVE_EQUITY_EXPLAIN} {PX_NEGATIVE_EQUITY_NEXT}
        </Alert>
      ) : equityType === "positive" ? (
        <Alert title={PX_EQUITY_TOWARDS_DEPOSIT(formatPounds(equity))} tone="success">
          This amount can be used towards your deposit. It is not a guaranteed
          purchase price.
        </Alert>
      ) : (
        <p className="text-body-sm text-muted">
          Estimated value and settlement are the same, so there is no extra
          deposit from this car.
        </p>
      )}
    </div>
  );
}
