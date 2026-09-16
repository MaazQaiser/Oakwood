"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { RefundReasonSelector } from "@/components/reservation/RefundReasonSelector";
import { requestReservationRefundAction } from "@/features/reservation/actions";
import type { ReservationPageModel } from "@/features/reservation/load";
import { getReserveUrl, supportRoutes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { reservationCopy } from "@/lib/reservation/copy";
import { reservationAmountLabel } from "@/lib/reservation/format";
import { toTelHref } from "@/lib/format/phone";
import type { RefundReasonCode } from "@/types/reservation";

export function RefundRequest({ model }: { model: ReservationPageModel }) {
  const router = useRouter();
  const [step, setStep] = useState<"reason" | "intercept">("reason");
  const [reason, setReason] = useState<RefundReasonCode>();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const stockId = model.vehicle?.stockId;

  function submit() {
    if (!reason || pending) {
      return;
    }
    trackEvent(analyticsEvents.refundSubmitted, { reason });
    startTransition(() => {
      void requestReservationRefundAction({ reason }).then((result) => {
        if (!result.ok) {
          setError("We could not submit your refund request. Try again.");
          return;
        }
        trackEvent(analyticsEvents.refundConfirmed);
        if (stockId) {
          router.push(getReserveUrl(stockId, "manage"));
        }
      });
    });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">{reservationCopy.refundHeading}</h1>
        <p className="mt-2 text-body">{reservationCopy.refundSupporting}</p>
      </header>
      <dl className="space-y-2 rounded-lg border border-border bg-surface p-4 text-body-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Reservation</dt>
          <dd>{reservationAmountLabel(model.amount)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Refund</dt>
          <dd>{reservationAmountLabel(model.amount)}</dd>
        </div>
      </dl>

      {step === "reason" ? (
        <>
          <RefundReasonSelector value={reason} onChange={setReason} />
          {error ? <Alert title={error} tone="warning" /> : null}
          <Button
            className="w-full sm:w-auto"
            disabled={!reason || pending}
            onClick={() => {
              trackEvent(analyticsEvents.refundStarted);
              setStep("intercept");
            }}
          >
            Continue
          </Button>
        </>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
          <p className="text-body">{reservationCopy.intercept}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {model.contact.telephone ? (
              <Button
                href={toTelHref(model.contact.telephone)}
                onClick={() =>
                  trackEvent(analyticsEvents.reservationContactClicked, {
                    channel: "call",
                  })
                }
              >
                Call Oakwood
              </Button>
            ) : (
              <Button href={supportRoutes.bookingEnquiry}>Call Oakwood</Button>
            )}
            <Button
              variant="secondary"
              disabled={pending}
              onClick={submit}
            >
              {reservationCopy.continueRefund}
            </Button>
          </div>
          <p className="mt-4">
            <Button
              variant="text"
              className="px-0"
              onClick={submit}
              disabled={pending}
            >
              Request refund
            </Button>
          </p>
        </div>
      )}
    </div>
  );
}
