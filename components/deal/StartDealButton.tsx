"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { createDealAction } from "@/features/deal/actions";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getDealUrl } from "@/config/routes";
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
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={className}>
      <Button
        className="w-full"
        variant={variant}
        busy={busy}
        onClick={() => {
          setBusy(true);
          setFailed(false);
          trackEvent(analyticsEvents.financeCtaClicked, { action: "build-deal" });
          void createDealAction({
            stockId,
            cashDeposit: cashDeposit ?? finance.deposit,
            term: term ?? finance.term,
            financeType,
          })
            .then((result) => {
              if (!result.ok) {
                setBusy(false);
                setFailed(true);
                return;
              }
              // Full navigation. A client router push after this action was
              // getting dropped, so the button looked like it did nothing.
              window.location.assign(getDealUrl(result.dealId, "part-exchange"));
            })
            .catch(() => {
              setBusy(false);
              setFailed(true);
            });
        }}
      >
        {label}
      </Button>
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
