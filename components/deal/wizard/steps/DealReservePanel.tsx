"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { DealCard } from "@/components/deal/wizard/DealWizardShell";
import { reservationConfig } from "@/config/reservation";
import { routes } from "@/config/routes";
import { STEP4_RESERVE_REFUNDABLE } from "@/lib/deal/step4-copy";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

/** Hands the customer to the standalone reservation page. Payment stays there. */
export function DealReservePanel({ onBack }: { onBack: () => void }) {
  const { vehicle, dealId } = useDealBuilder();
  const fee = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod(reservationConfig.holdDurationDays);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <Button type="button" variant="text" className="min-h-9 self-start px-1" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
        <DealCard className="space-y-3">
          <h2 className="text-h3 text-navy">Reserve this car</h2>
          <p className="text-body-sm text-secondary">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <p className="text-label">{fee} refundable reservation</p>
          <p className="text-body-sm text-muted">{STEP4_RESERVE_REFUNDABLE}</p>
          <p className="text-body-sm text-muted">
            After payment is confirmed, the car is held for {hold} under the
            reservation terms.
          </p>
          <p className="text-body-sm">
            <a
              href={routes.reservationTerms}
              className="text-primary underline-offset-4 hover:underline"
            >
              Reservation terms
            </a>
          </p>
        </DealCard>
        <StartReservationButton
          stockId={vehicle.stockId}
          dealId={dealId}
          className="w-full"
        />
      </div>
    </div>
  );
}
