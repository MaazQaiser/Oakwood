import { siteFeatures } from "@/config/features";
import { formatPounds } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehiclePricePositionLine({ vehicle }: { vehicle: VehicleDetail }) {
  if (!siteFeatures.pricePositionLine || !vehicle.pricePosition) {
    return null;
  }

  const { amountBelowAverage, comparableCount } = vehicle.pricePosition;

  return (
    <p className="text-body-sm text-muted" data-feature="price-position-line">
      {formatPounds(amountBelowAverage)} below the average of {comparableCount}{" "}
      comparable cars
    </p>
  );
}