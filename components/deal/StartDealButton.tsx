"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { DEAL_VDP_CARD_CTA } from "@/lib/deal/copy";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { FinanceProductType } from "@/types/finance";

export function StartDealButton({
  stockId,
  className,
  variant = "primary",
  cashDeposit,
  term,
  financeType,
  label = DEAL_VDP_CARD_CTA,
}: {
  stockId: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
  label?: string;
}) {
  const finance = useCustomerFinance();
  const [failed, setFailed] = useState(false);
  const deposit = cashDeposit ?? finance.deposit;
  const months = term ?? finance.term;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("dealError")) setFailed(true);
  }, []);

  return (
    <div className={className}>
      <form
        action="/api/deal/start"
        method="post"
        onSubmit={() => {
          trackEvent(analyticsEvents.financeCtaClicked, { action: "build-deal" });
        }}
      >
        <input type="hidden" name="stockId" value={stockId} />
        <input type="hidden" name="cashDeposit" value={String(deposit)} />
        <input type="hidden" name="term" value={String(months)} />
        {financeType ? (
          <input type="hidden" name="financeType" value={financeType} />
        ) : null}
        <Button className="w-full" variant={variant} type="submit">
          {label}
        </Button>
      </form>
      {failed ? (
        <p className="mt-2 text-caption text-danger" role="alert">
          We couldn&apos;t open your deal. Please try again.
        </p>
      ) : null}
    </div>
  );
}

export function StartVehicleDealButton({
  className,
  variant = "primary",
  label,
}: {
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
  label?: string;
}) {
  const { vehicle, financeType, deposit, term } = useVehicleDeal();

  return (
    <StartDealButton
      stockId={vehicle.stockId}
      cashDeposit={deposit}
      term={term}
      financeType={financeType}
      className={className}
      variant={variant}
      label={label}
    />
  );
}
