import { Chip } from "@/components/ui/Badge";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { CompareVehicleButton } from "@/components/vehicle/CompareVehicleButton";
import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleHeader({ vehicle }: { vehicle: VehicleDetail }) {
  const heading = [vehicle.make, vehicle.model, vehicle.derivative]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="vdp-hero__header min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-h3">{heading}</h2>
          <p className="mt-2 text-body-sm text-muted">
            {vehicle.year} · {formatNumber(vehicle.mileage)} miles · {vehicle.fuelType} ·{" "}
            {vehicle.transmission}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SaveVehicleButton
            vehicleName={`${vehicle.make} ${vehicle.model}`}
            stockId={vehicle.stockId}
            category={vehicle.category}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <VehicleAvailabilityBadge availability={vehicle.availability} />
        <Chip>{vehicle.year}</Chip>
        <Chip>{formatNumber(vehicle.mileage)} miles</Chip>
        <Chip>{vehicle.fuelType}</Chip>
        <Chip>{vehicle.transmission}</Chip>
      </div>
      <CompareVehicleButton
        vehicleName={`${vehicle.make} ${vehicle.model}`}
        stockId={vehicle.stockId}
        category={vehicle.category}
        appearance="button"
        className="mt-4"
      />
    </header>
  );
}
