import { Button } from "@/components/ui/Button";
import { ReservationVehicleSummary } from "@/components/reservation/ReservationVehicleSummary";
import { reservationCopy } from "@/lib/reservation/copy";
import {
  formatReservationDate,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { getUsedCarsUrl, getVehicleUrl } from "@/config/routes";
import type { ReservationPageModel } from "@/features/reservation/load";

export function RefundConfirmation({ model }: { model: ReservationPageModel }) {
  const vehicle = model.vehicle;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">Refund requested</h1>
        <p className="mt-2 text-body">{reservationCopy.refundReceived}</p>
        <p className="mt-2 text-body-sm text-muted">
          {reservationCopy.refundSubmitted}
        </p>
      </header>
      {vehicle ? (
        <ReservationVehicleSummary
          vehicle={vehicle}
          amount={model.amount}
          holdDurationDays={model.holdDurationDays}
        />
      ) : null}
      <dl className="space-y-2 rounded-lg border border-border bg-surface p-4 text-body-sm">
        {model.refundRequestedAtIso ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Request date</dt>
            <dd>{formatReservationDate(model.refundRequestedAtIso)}</dd>
          </div>
        ) : null}
        {model.reference ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reservation reference</dt>
            <dd>{model.reference}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Refund amount</dt>
          <dd>{reservationAmountLabel(model.amount)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Vehicle status</dt>
          <dd>Released</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        {vehicle ? (
          <Button href={getVehicleUrl(vehicle)} variant="secondary">
            View vehicle
          </Button>
        ) : null}
        <Button href={getUsedCarsUrl()}>Browse cars</Button>
      </div>
    </div>
  );
}
