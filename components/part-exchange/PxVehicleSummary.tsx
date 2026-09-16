import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/format/money";
import { PX_NOT_MY_CAR } from "@/lib/part-exchange/copy";
import {
  formatVehicleLine,
  formatVehicleMeta,
} from "@/lib/part-exchange/valuation";
import type { PxIdentifiedVehicle } from "@/types/part-exchange";

export function PxVehicleSummary({
  vehicle,
  mileage,
  onNotMyCar,
}: {
  vehicle: Pick<
    PxIdentifiedVehicle,
    "year" | "make" | "model" | "variant" | "fuelType" | "transmission"
  >;
  mileage?: number;
  onNotMyCar?: () => void;
}) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-surface p-4">
      <p className="text-h3">{formatVehicleLine(vehicle)}</p>
      {vehicle.variant ? (
        <p className="mt-1 text-body">{vehicle.variant}</p>
      ) : null}
      <p className="mt-1 text-body-sm text-muted">
        {formatVehicleMeta({
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
        })}
        {mileage !== undefined ? ` · ${formatNumber(mileage)} miles` : ""}
      </p>
      {onNotMyCar ? (
        <Button variant="text" className="mt-3 px-0" onClick={onNotMyCar}>
          {PX_NOT_MY_CAR}
        </Button>
      ) : null}
    </div>
  );
}
