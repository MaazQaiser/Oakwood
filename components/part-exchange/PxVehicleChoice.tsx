import Image from "next/image";
import { cn } from "@/lib/cn";
import { vehicleCardImage } from "@/lib/media/stock";
import { pxVehicleKey } from "@/lib/part-exchange/lookup";
import {
  formatVehicleLine,
  formatVehicleMeta,
} from "@/lib/part-exchange/valuation";
import type { PxIdentifiedVehicle } from "@/types/part-exchange";

function choiceImage(vehicle: PxIdentifiedVehicle): string {
  const suv = /qashqai|tucson|sportage|kuga/i.test(vehicle.model);
  return vehicleCardImage({
    stockId: `${vehicle.year}${vehicle.make}${vehicle.model}`,
    bodyStyle: suv ? "SUV" : "Hatchback",
  });
}

export function PxVehicleChoice({
  options,
  selected,
  onSelect,
}: {
  options: PxIdentifiedVehicle[];
  selected?: PxIdentifiedVehicle;
  onSelect: (vehicle: PxIdentifiedVehicle) => void;
}) {
  const selectedKey = selected ? pxVehicleKey(selected) : undefined;

  return (
    <div
      role="radiogroup"
      aria-label="Car you are exchanging"
      className="mt-6 grid gap-3 sm:grid-cols-2"
    >
      {options.map((vehicle) => {
        const key = pxVehicleKey(vehicle);
        const active = key === selectedKey;
        const line = formatVehicleLine(vehicle);

        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(vehicle)}
            className={cn(
              "overflow-hidden rounded-[14px] border bg-white text-left transition-colors",
              active
                ? "border-[#002852] ring-2 ring-[#002852]/20"
                : "border-border hover:border-[#8EBFDF]",
            )}
          >
            <div className="relative aspect-[16/10] bg-[#ECF3F8]">
              <Image
                src={choiceImage(vehicle)}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-[1rem] font-medium leading-snug text-ink">{line}</p>
              {vehicle.variant ? (
                <p className="mt-1 text-body-sm text-muted">{vehicle.variant}</p>
              ) : null}
              <p className="mt-1 text-caption text-muted">
                {formatVehicleMeta({
                  fuelType: vehicle.fuelType,
                  transmission: vehicle.transmission,
                })}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
