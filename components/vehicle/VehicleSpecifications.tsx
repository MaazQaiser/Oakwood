import { formatNumber } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleSpecifications({ vehicle }: { vehicle: VehicleDetail }) {
  const extra = vehicle.fullSpecification;
  const items = [
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: `${formatNumber(vehicle.mileage)} miles` },
    { label: "Fuel", value: vehicle.fuelType },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Body type", value: vehicle.bodyStyle },
    { label: "Colour", value: vehicle.colour },
    vehicle.doors ? { label: "Doors", value: String(vehicle.doors) } : null,
    vehicle.seats ? { label: "Seats", value: String(vehicle.seats) } : null,
    extra?.engine ? { label: "Engine", value: extra.engine } : null,
    extra?.economy ? { label: "Economy", value: extra.economy } : null,
    extra?.co2 ? { label: "CO2", value: extra.co2 } : null,
    extra?.previousOwners !== undefined
      ? { label: "Previous keepers", value: String(extra.previousOwners) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <section
      aria-labelledby="key-spec-heading"
      className="vdp-hero__specs min-w-0 border-t border-border pt-8"
    >
      <h2 id="key-spec-heading" className="text-h3">
        Key specification
      </h2>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-caption text-muted">{item.label}</dt>
            <dd className="mt-1 text-body-sm font-medium text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
