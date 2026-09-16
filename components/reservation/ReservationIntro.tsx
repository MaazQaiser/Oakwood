"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { Alert } from "@/components/ui/Alert";
import { ReservationVehicleSummary } from "@/components/reservation/ReservationVehicleSummary";
import { ReservationSummary } from "@/components/reservation/ReservationSummary";
import { ReservationDealSummary } from "@/components/reservation/ReservationDealSummary";
import { ReservationTerms } from "@/components/reservation/ReservationTerms";
import { ReservationExpired } from "@/components/reservation/ReservationExpired";
import { ReservationUnavailable } from "@/components/reservation/ReservationUnavailable";
import { ReservationError } from "@/components/reservation/ReservationError";
import { startReservationAction } from "@/features/reservation/actions";
import type { ReservationPageModel } from "@/features/reservation/load";
import {
  getDealUrl,
  getReserveUrl,
} from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  introSupportingCopy,
  reservationCopy,
} from "@/lib/reservation/copy";
import { reservationAmountLabel } from "@/lib/reservation/format";

function ContinueToPayment({
  stockId,
  dealId,
  className,
}: {
  stockId: string;
  dealId?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      className={className}
      busy={busy}
      onClick={() => {
        setBusy(true);
        trackEvent(analyticsEvents.reservationPaymentStarted, { stockId });
        void startReservationAction({ stockId, dealId }).then((result) => {
          if (!result.ok) {
            setBusy(false);
            if (result.reason === "existing_reservation" && result.existingStockId) {
              router.push(getReserveUrl(result.existingStockId, "manage"));
            }
            return;
          }
          router.push(getReserveUrl(result.stockId, "payment"));
        });
      }}
    >
      Continue to payment
    </Button>
  );
}

export function ReservationIntro({ model }: { model: ReservationPageModel }) {
  if (model.phase === "EXPIRED") {
    return <ReservationExpired model={model} />;
  }
  if (model.phase === "SOLD") {
    return <ReservationUnavailable model={model} variant="sold" />;
  }
  if (model.phase === "UNAVAILABLE") {
    return <ReservationUnavailable model={model} />;
  }
  if (model.reconciliationRequired || (model.paymentFailed && model.phase === "ERROR")) {
    return model.paymentFailed ? null : <ReservationError model={model} />;
  }

  const vehicle = model.vehicle;
  if (!vehicle) {
    return <ReservationUnavailable model={model} />;
  }

  const dealHref = model.dealSnapshot
    ? getDealUrl(model.dealSnapshot.dealId)
    : undefined;
  const blocked = Boolean(model.dealChanged || model.existingReservationStockId);

  return (
    <div className="pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-0">
      <header className="max-w-2xl">
        <h1 className="text-h2">
          Reserve this car for {reservationAmountLabel(model.amount)}
        </h1>
        <p className="mt-3 text-body">{introSupportingCopy(model.amount)}</p>
      </header>

      {model.existingReservationStockId ? (
        <div className="mt-6">
          <Alert title="You already have a reservation" tone="info">
            View your current reservation before starting another.
            <div className="mt-3">
              <Button
                href={getReserveUrl(model.existingReservationStockId, "manage")}
                size="sm"
              >
                View my reservation
              </Button>
            </div>
          </Alert>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="space-y-6">
          <ReservationVehicleSummary
            vehicle={vehicle}
            amount={model.amount}
            holdDurationDays={model.holdDurationDays}
          />
          {model.dealSnapshot ? (
            <ReservationDealSummary
              deal={model.dealSnapshot}
              dealChanged={model.dealChanged}
            />
          ) : null}
          <div className="lg:hidden">
            <ReservationSummary
              amount={model.amount}
              holdDurationDays={model.holdDurationDays}
              refundable={model.refundable}
              appliedToPurchase={model.appliedToPurchase}
            />
          </div>
          <ReservationTerms
            amount={model.amount}
            holdDurationDays={model.holdDurationDays}
          />
        </div>
        <div className="hidden space-y-6 lg:block">
          <ReservationSummary
            amount={model.amount}
            holdDurationDays={model.holdDurationDays}
            refundable={model.refundable}
            appliedToPurchase={model.appliedToPurchase}
          />
          {blocked ? (
            <Button className="w-full" disabled>
              Continue to payment
            </Button>
          ) : (
            <ContinueToPayment
              stockId={vehicle.stockId}
              dealId={model.dealSnapshot?.dealId}
              className="w-full"
            />
          )}
          {dealHref ? (
            <Button href={dealHref} variant="secondary" className="w-full">
              Back to deal
            </Button>
          ) : null}
        </div>
      </div>

      {dealHref || blocked ? (
        <div className="mt-8 space-y-3 lg:hidden">
          {blocked ? (
            <Button className="w-full" disabled>
              Continue to payment
            </Button>
          ) : null}
          {dealHref ? (
            <Button href={dealHref} variant="secondary" className="w-full">
              Back to deal
            </Button>
          ) : null}
        </div>
      ) : null}

      {!blocked ? (
        <StickyActionBar>
          <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-3">
            <div className="min-w-0">
              <p className="text-caption text-muted">To pay today</p>
              <p className="text-label">{reservationAmountLabel(model.amount)}</p>
            </div>
            <ContinueToPayment
              stockId={vehicle.stockId}
              dealId={model.dealSnapshot?.dealId}
              className="min-w-0 flex-1"
            />
          </div>
        </StickyActionBar>
      ) : null}
    </div>
  );
}
