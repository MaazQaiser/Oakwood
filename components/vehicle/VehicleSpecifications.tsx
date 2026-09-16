import { formatNumber } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleSpecifications({ vehicle }: { vehicle: VehicleDetail }) {
  const items = [
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: `${formatNumber(vehicle.mileage)} miles` },
    { label: "Fuel", value: vehicle.fuelType },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Body type", value: vehicle.bodyStyle },
    { label: "Colour", value: vehicle.colour },
    vehicle.doors ? { label: "Doors", value: String(vehicle.doors) } : null,
    vehicle.seats ? { label: "Seats", value: String(vehicle.seats) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const extra = vehicle.fullSpecification;

  return (
    <section
      aria-labelledby="key-spec-heading"
      className="vdp-hero__specs rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="key-spec-heading" className="text-h3">
        Key specification
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-caption text-muted">{item.label}</dt>
            <dd className="mt-1 text-body-sm">{item.value}</dd>
          </div>
        ))}
      </dl>
      {extra ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-body-sm text-primary">
            View full specification
          </summary>
          <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {extra.engine ? (
              <div>
                <dt className="text-caption text-muted">Engine</dt>
                <dd className="mt-1 text-body-sm">{extra.engine}</dd>
              </div>
            ) : null}
            {extra.economy ? (
              <div>
                <dt className="text-caption text-muted">Economy</dt>
                <dd className="mt-1 text-body-sm">{extra.economy}</dd>
              </div>
            ) : null}
            {extra.co2 ? (
              <div>
                <dt className="text-caption text-muted">CO2</dt>
                <dd className="mt-1 text-body-sm">{extra.co2}</dd>
              </div>
            ) : null}
            {extra.previousOwners !== undefined ? (
              <div>
                <dt className="text-caption text-muted">Previous keepers</dt>
                <dd className="mt-1 text-body-sm">{extra.previousOwners}</dd>
              </div>
            ) : null}
          </dl>
        </details>
      ) : null}
    </section>
  );
}
