import { reservationCopy } from "@/lib/reservation/copy";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

export function ReservationSummary({
  amount,
  holdDurationDays,
  refundable,
  appliedToPurchase,
}: {
  amount: number;
  holdDurationDays: number;
  refundable: boolean;
  appliedToPurchase: boolean;
}) {
  return (
    <section
      aria-labelledby="reservation-summary-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="reservation-summary-heading" className="text-h3">
        Reservation
      </h2>
      <dl className="mt-4 space-y-3 text-body">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Reservation amount</dt>
          <dd className="text-label">{reservationAmountLabel(amount)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Hold period</dt>
          <dd className="text-label">{formatHoldPeriod(holdDurationDays)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Refundable</dt>
          <dd className="text-label">{refundable ? "Yes" : "See terms"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Applied to purchase</dt>
          <dd className="text-label">{appliedToPurchase ? "Yes" : "See terms"}</dd>
        </div>
      </dl>
      <ul className="mt-5 space-y-2 text-body-sm">
        <li>{reservationCopy.fullyRefundable}</li>
        <li>{reservationCopy.appliedToPurchase}</li>
        <li>{`Your car is held for ${formatHoldPeriod(holdDurationDays)}.`}</li>
        <li>{reservationCopy.requestRefund}</li>
      </ul>
    </section>
  );
}
