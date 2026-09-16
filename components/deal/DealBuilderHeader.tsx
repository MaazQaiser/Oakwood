"use client";

import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { getFinanceCalculatorUrl, getVehicleUrl } from "@/config/routes";
import {
  DEAL_HEADING,
  DEAL_PROFILE_SUPPORTING,
  DEAL_SUPPORTING,
} from "@/lib/deal/copy";

export function DealBuilderHeader() {
  const { vehicle, finance } = useDealBuilder();

  return (
    <header className="border-b border-border pb-6">
      <p>
        <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
          Back to vehicle
        </Button>
      </p>
      <h1 className="mt-3 text-h2">{DEAL_HEADING}</h1>
      <p className="mt-2 max-w-2xl text-body text-muted">{DEAL_SUPPORTING}</p>
      {finance.hasProfile ? (
        <p className="mt-2 text-caption text-muted">{DEAL_PROFILE_SUPPORTING}</p>
      ) : null}
      <p className="mt-3">
        <Button
          href={getFinanceCalculatorUrl({ stockId: vehicle.stockId })}
          variant="text"
          className="px-0"
        >
          Open the finance calculator
        </Button>
      </p>
    </header>
  );
}
