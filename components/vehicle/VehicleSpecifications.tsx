import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleSpecifications({
  vehicle,
  embedded = false,
}: {
  vehicle: VehicleDetail;
  embedded?: boolean;
}) {
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
      className={cn(
        "vdp-hero__specs min-w-0",
        embedded ? "pt-2" : "",
      )}
    >
      {embedded ? (
        <h3 id="key-spec-heading" className="sr-only">
          At a glance
        </h3>
      ) : (
        <h2
          id="key-spec-heading"
          className="text-[1.75rem] font-medium leading-[1.15em] tracking-[-0.03em] text-navy sm:text-[2rem]"
        >
          At a glance
        </h2>
      )}
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-[#E7EEF4] shadow-[0_10px_24px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4] sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 bg-white px-4 py-4">
            <dt className="text-[0.72rem] font-semibold tracking-[0.06em] text-muted uppercase">
              {item.label}
            </dt>
            <dd className="mt-1 text-[0.95rem] font-semibold text-[#002852]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
