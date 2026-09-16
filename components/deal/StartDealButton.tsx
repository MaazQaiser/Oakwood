"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { createDealAction } from "@/features/deal/actions";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getDealUrl, getEligibilityUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { FinanceProductType } from "@/types/finance";

export function StartDealButton({
  stockId,
  className,
  variant = "primary",
  cashDeposit,
  term,
  financeType,
}: {
  stockId: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
}) {
  const finance = useCustomerFinance();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const hasProfile = finance.mode !== "anonymous";

  if (!hasProfile) {
    return (
      <Button
        href={getEligibilityUrl()}
        variant={variant}
        className={className}
        onClick={() =>
          trackEvent(analyticsEvents.financeCtaClicked, { action: "eligibility" })
        }
      >
        Check my eligibility
      </Button>
    );
  }

  return (
    <Button
      className={className}
      variant={variant}
      busy={busy}
      onClick={() => {
        setBusy(true);
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
          router.push(getDealUrl(result.dealId));
        });
      }}
    >
      Build my deal
    </Button>
  );
}

export function StartVehicleDealButton({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
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
    />
  );
}
