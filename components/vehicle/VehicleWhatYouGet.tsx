import { IconCheck } from "@/components/ui/icons";
import type { VehicleDetail } from "@/types/vehicle-detail";

const FALLBACK_FEATURES = [
  "Apple CarPlay and Android Auto",
  "Climate control",
  "Parking sensors",
  "Cruise control",
  "Alloy wheels",
  "Bluetooth",
];

export function VehicleWhatYouGet({ vehicle }: { vehicle: VehicleDetail }) {
  const features = [
    vehicle.fuelType,
    vehicle.transmission,
    vehicle.bodyStyle,
    vehicle.fullSpecification?.engine,
    vehicle.doors ? `${vehicle.doors} doors` : null,
    vehicle.seats ? `${vehicle.seats} seats` : null,
    ...FALLBACK_FEATURES,
  ]
    .filter(Boolean)
    .slice(0, 8) as string[];

  return (
    <section aria-labelledby="what-you-get-heading" className="min-w-0">
      <h2
        id="what-you-get-heading"
        className="text-[1.75rem] font-medium leading-[1.15em] tracking-[-0.03em] text-navy sm:text-[2rem]"
      >
        What you get
      </h2>
      <p className="mt-2 text-[0.95rem] text-muted">
        The kit that matters on this {vehicle.make} {vehicle.model}.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex min-h-24 flex-col justify-between gap-3 rounded-[20px] bg-[#ECF3F8] p-4 text-sm font-semibold leading-snug text-[#002852]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-white text-primary">
              <IconCheck />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
