"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { startReservationAction } from "@/features/reservation/actions";
import { reservationConfig } from "@/config/reservation";
import { getReserveUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { reserveCtaLabel } from "@/lib/reservation/format";

export function StartReservationButton({
  stockId,
  dealId,
  className,
  variant = "primary",
}: {
  stockId: string;
  dealId?: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      className={className}
      variant={variant}
      busy={busy}
      onClick={() => {
        setBusy(true);
        trackEvent(analyticsEvents.reservationStarted, { stockId });
        void startReservationAction({ stockId, dealId }).then((result) => {
          if (!result.ok) {
            setBusy(false);
            if (result.reason === "existing_reservation" && result.existingStockId) {
              router.push(getReserveUrl(result.existingStockId, "manage"));
            }
            return;
          }
          router.push(getReserveUrl(result.stockId));
        });
      }}
    >
      {reserveCtaLabel(reservationConfig.amount)}
    </Button>
  );
}
