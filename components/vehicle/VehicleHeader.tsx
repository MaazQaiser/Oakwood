import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { getVehicleIdentity } from "@/lib/vehicles/labels";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleHeader({ vehicle }: { vehicle: VehicleDetail }) {
  const { title, subtitle } = getVehicleIdentity(vehicle);

  return (
    <header className="vdp-hero__header min-w-0 rounded-[28px] bg-[#ECF3F8] p-5 sm:p-7">
      <VehicleAvailabilityBadge availability={vehicle.availability} />
      <h1 className="mt-3 min-w-0 text-[2rem] font-medium leading-[1.1em] tracking-[-0.03em] text-navy sm:text-[2.6rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-[0.95rem] text-muted">{subtitle}</p>
      ) : null}
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Key details">
        <li className="rounded-[10px] bg-primary px-3 py-1.5 text-sm font-semibold tabular-nums text-white">
          {formatNumber(vehicle.mileage)} miles
        </li>
        {[String(vehicle.year), vehicle.fuelType, vehicle.transmission].map((item) => (
          <li
            key={item}
            className="rounded-[10px] bg-white px-3 py-1.5 text-sm font-semibold text-[#002852]"
          >
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-5 flex items-baseline gap-2 border-t border-[#002852]/10 pt-4">
        <span className="text-[1.6rem] font-semibold tabular-nums tracking-[-0.03em] text-[#002852]">
          {formatPounds(vehicle.cashPrice)}
        </span>
        <span className="text-sm text-muted">cash price</span>
      </p>
    </header>
  );
}
