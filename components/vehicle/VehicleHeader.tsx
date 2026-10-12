import { Chip } from "@/components/ui/Badge";
import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber } from "@/lib/format/money";
import { getVehicleIdentity } from "@/lib/vehicles/labels";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleHeader({ vehicle }: { vehicle: VehicleDetail }) {
  const { title, subtitle } = getVehicleIdentity(vehicle);
  const badges = [
    String(vehicle.year),
    `${formatNumber(vehicle.mileage)} miles`,
    vehicle.fuelType,
    vehicle.transmission,
    vehicle.bodyStyle,
  ].filter(Boolean);

  return (
    <header className="vdp-hero__header min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <VehicleAvailabilityBadge availability={vehicle.availability} />
        {vehicle.registration ? (
          <p className="text-caption font-semibold tracking-[0.04em] text-muted uppercase">
            {vehicle.registration}
          </p>
        ) : null}
      </div>
      <h1 className="mt-2 text-[1.75rem] font-medium leading-tight tracking-[-0.03em] text-ink sm:text-[2rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-body-sm text-muted">{subtitle}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {badges.map((badge) => (
          <Chip key={badge} className="border-transparent bg-page-tint px-2.5 py-1 text-caption text-ink">
            {badge}
          </Chip>
        ))}
      </div>
    </header>
  );
}
