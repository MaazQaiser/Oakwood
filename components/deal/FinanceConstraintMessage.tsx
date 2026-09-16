"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { formatPounds } from "@/lib/format/money";
import { getSearchUrl, getUsedCarsUrl } from "@/config/routes";

export function FinanceConstraintMessage() {
  const { calculation, applyDepositGap, phase } = useDealBuilder();
  if (phase !== "INVALID" || !calculation?.constraints.length) {
    return null;
  }

  const primary = calculation.constraints[0];

  return (
    <div aria-live="polite">
      <Alert title={primary.title} tone="warning">
        <p>{primary.body}</p>
        {calculation.constraints.slice(1).map((item) => (
          <p key={item.code} className="mt-2">
            {item.title} {item.body}
          </p>
        ))}
        {primary.action === "add_deposit" && primary.depositGap ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={applyDepositGap}>
              Add {formatPounds(primary.depositGap)} to your deposit
            </Button>
            <Button href={getSearchUrl({ affordable: 1 })} variant="secondary" size="sm">
              Choose a lower-priced vehicle
            </Button>
          </div>
        ) : null}
        {primary.action === "choose_vehicle" ? (
          <div className="mt-3">
            <Button href={getUsedCarsUrl()} size="sm">
              Choose a lower-priced vehicle
            </Button>
          </div>
        ) : null}
      </Alert>
    </div>
  );
}
