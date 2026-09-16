"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { getEligibilityUrl, getSearchUrl, getUsedCarsUrl } from "@/config/routes";
import { formatPounds } from "@/lib/format/money";
import {
  CALCULATOR_BROWSE_BUDGET,
  CALCULATOR_INCREASE_DEPOSIT,
  CALCULATOR_TRY_AGAIN,
  CALCULATOR_UNAVAILABLE_BODY,
  CALCULATOR_UNAVAILABLE_TITLE,
  CALCULATOR_VEHICLE_NOT_FINANCEABLE,
  CALCULATOR_VEHICLE_NOT_FINANCEABLE_NEXT,
} from "@/lib/finance/calculator-copy";
import type { DealConstraintMessage } from "@/types/deal";
import type { FinanceCalculatorStatus } from "@/features/finance/calculator/types";

export function CalculatorConstraints({
  status,
  constraints,
  onIncreaseDeposit,
  onRetry,
}: {
  status: FinanceCalculatorStatus;
  constraints: DealConstraintMessage[];
  onIncreaseDeposit: () => void;
  onRetry: () => void;
}) {
  if (status === "unavailable") {
    return (
      <Alert title={CALCULATOR_UNAVAILABLE_TITLE} tone="warning">
        <p>{CALCULATOR_UNAVAILABLE_BODY}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={onRetry}>
            {CALCULATOR_TRY_AGAIN}
          </Button>
          <Button href={getEligibilityUrl()} variant="secondary" size="sm">
            Check my eligibility
          </Button>
        </div>
      </Alert>
    );
  }

  if (status === "not_financeable") {
    return (
      <Alert title={CALCULATOR_VEHICLE_NOT_FINANCEABLE} tone="warning">
        <p>{CALCULATOR_VEHICLE_NOT_FINANCEABLE_NEXT}</p>
        <div className="mt-3">
          <Button href={getUsedCarsUrl()} size="sm">
            Browse available cars
          </Button>
        </div>
      </Alert>
    );
  }

  if (status !== "constraint" || constraints.length === 0) {
    return null;
  }

  const primary = constraints[0];

  return (
    <div aria-live="polite">
      <Alert title={primary.title} tone="warning">
        <p>{primary.body}</p>
        {constraints.slice(1).map((item) => (
          <p key={item.code} className="mt-2">
            {item.title} {item.body}
          </p>
        ))}
        {primary.action === "add_deposit" && primary.depositGap ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={onIncreaseDeposit}>
              {CALCULATOR_INCREASE_DEPOSIT}
              <span className="sr-only">
                {` by ${formatPounds(primary.depositGap)}`}
              </span>
            </Button>
            <Button
              href={getSearchUrl({ affordable: 1 })}
              variant="secondary"
              size="sm"
            >
              {CALCULATOR_BROWSE_BUDGET}
            </Button>
          </div>
        ) : null}
        {primary.action === "choose_vehicle" ? (
          <div className="mt-3">
            <Button href={getUsedCarsUrl()} size="sm">
              {CALCULATOR_BROWSE_BUDGET}
            </Button>
          </div>
        ) : null}
      </Alert>
    </div>
  );
}
