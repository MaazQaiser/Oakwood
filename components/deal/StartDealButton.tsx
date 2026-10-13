"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      className={className}
      variant={variant}
      busy={busy}
      onClick={() => {
        setBusy(true);
        trackEvent(analyticsEvents.financeCtaClicked, { action: "build-deal" });
        void createDealAction({
          stockId,
          cashDeposit: cashDeposit ?? finance.deposit,
          term: term ?? finance.term,
          financeType,
        }).then((result) => {
          if (!result.ok) {
            setBusy(false);
            return;
          }
          router.push(getDealUrl(result.dealId, "part-exchange"));
        });
      }}
    >
      {label}
    </Button>
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
