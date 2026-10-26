"use client";

import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber } from "@/lib/format/money";
import { getVehicleIdentity } from "@/lib/vehicles/labels";
import type { VehicleDetail } from "@/types/vehicle-detail";

const specs = [
  { key: "year", label: "Year" },
  { key: "mileage", label: "Mileage" },
  { key: "fuel", label: "Fuel" },
  { key: "transmission", label: "Transmission" },
] as const;

export function VdpV2TitleAndSpecs({ vehicle }: { vehicle: VehicleDetail }) {
  const { title, subtitle } = getVehicleIdentity(vehicle);

  const values: Record<(typeof specs)[number]["key"], string> = {
    year: String(vehicle.year),
    mileage: `${formatNumber(vehicle.mileage)} miles`,
    fuel: vehicle.fuelType,
    transmission: vehicle.transmission,
  };

  return (
    <header className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <VehicleAvailabilityBadge availability={vehicle.availability} />
        {vehicle.registration ? (
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#68778B]">
            {vehicle.registration}
          </p>
        ) : null}
      </div>
      <h1 className="mt-2 text-[26px] font-bold leading-8 text-[#102747]">{title}</h1>
      {subtitle ? (
        <p className="mt-1.5 text-[14px] leading-[21px] text-[#34445B]">{subtitle}</p>
      ) : null}
      <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-3">
        {specs.map((item) => (
          <div key={item.key} className="min-w-0">
            <dt className="text-[13px] leading-[18px] text-[#68778B]">{item.label}</dt>
            <dd className="text-[13px] font-semibold leading-[18px] text-[#102747]">
              {values[item.key]}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
