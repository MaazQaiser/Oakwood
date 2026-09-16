import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { getVehicleUrl } from "@/config/routes";
import { formatNumber, formatPounds } from "@/lib/format/money";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import type { DealVehicleSummary } from "@/types/deal";

export function ReservationVehicleSummary({
  vehicle,
  amount,
  holdDurationDays,
}: {
  vehicle: DealVehicleSummary;
  amount: number;
  holdDurationDays: number;
}) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <Card as="section" className="overflow-hidden p-0" padded={false}>
      <div className="relative aspect-[16/10] bg-page">
        <Image
          src={vehicle.imageSrc}
          alt={vehicle.imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 420px, 100vw"
          unoptimized={vehicle.imageSrc.endsWith(".svg")}
        />
      </div>
      <div className="p-4">
        <h2 className="text-h3">{title}</h2>
        {vehicle.derivative ? (
          <p className="mt-1 text-body-sm text-muted">{vehicle.derivative}</p>
        ) : null}
        <p className="mt-3 text-body-sm text-muted">
          {formatNumber(vehicle.mileage)} miles
        </p>
        <p className="text-body-sm text-muted">
          {vehicle.fuelType} · {vehicle.transmission}
        </p>
        <p className="mt-1 text-caption text-muted">{vehicle.locationName}</p>
        <p className="mt-4">
          <FinancialNumber value={formatPounds(vehicle.cashPrice)} />
        </p>
        <dl className="mt-4 space-y-2 text-body-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reservation</dt>
            <dd>{reservationAmountLabel(amount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Hold</dt>
            <dd>{formatHoldPeriod(holdDurationDays)}</dd>
          </div>
        </dl>
        <p className="mt-3">
          <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
            View vehicle
          </Button>
        </p>
      </div>
    </Card>
  );
}
