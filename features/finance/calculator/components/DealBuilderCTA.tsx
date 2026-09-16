"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createDealAction } from "@/features/deal/actions";
import { getDealUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { CALCULATOR_DEAL_BUILDER_CTA } from "@/lib/finance/calculator-copy";
import type { FinanceProductType } from "@/types/finance";

export function DealBuilderCTA({
  stockId,
  cashDeposit,
  term,
  financeType,
  annualMileage,
  onClick,
}: {
  stockId: string;
  cashDeposit: number;
  term: number;
  financeType: FinanceProductType;
  annualMileage?: number;
  onClick?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div>
      <Button
        className="w-full"
        busy={busy}
        onClick={() => {
          onClick?.();
          setBusy(true);
          setError(false);
          trackEvent(analyticsEvents.financeDealBuilderClicked, {
            stockId,
            financeType,
            term,
          });
          void createDealAction({
            stockId,
            cashDeposit,
            term,
            financeType,
            annualMileage: financeType === "pcp" ? annualMileage : undefined,
          }).then((result) => {
            if (!result.ok) {
              setBusy(false);
              setError(true);
              return;
            }
            router.push(getDealUrl(result.dealId));
          });
        }}
      >
        {CALCULATOR_DEAL_BUILDER_CTA}
      </Button>
      {error ? (
        <p className="mt-2 text-caption text-danger" role="alert">
          We couldn't open Deal Builder for this vehicle. Try again, or view the
          vehicle page.
        </p>
      ) : null}
    </div>
  );
}
