"use client";

import { useState } from "react";
import { IconChevron } from "@/components/ui/icons";
import { getVehicleIdentity } from "@/lib/vehicles/labels";
import { formatNumber } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleAbout({ vehicle }: { vehicle: VehicleDetail }) {
  const [expanded, setExpanded] = useState(false);
  const { title } = getVehicleIdentity(vehicle);

  const paragraphs = [
    `A ${vehicle.year} ${title} with ${formatNumber(vehicle.mileage)} miles on the clock. ${vehicle.fuelType}, ${vehicle.transmission.toLowerCase()}, ${vehicle.bodyStyle.toLowerCase()} in ${vehicle.colour.toLowerCase()}.`,
    vehicle.preparation.completed
      ? `Our technicians have taken it through a full inspection${vehicle.inspection.available ? ", it has been through the AA's independent check," : ""} and it leaves us with a fresh MOT and documented preparation.`
      : `MOT status: ${vehicle.mot.latestResult}. Valid until ${vehicle.motStatus.validUntil}.`,
    vehicle.serviceHistory.summary,
  ].filter(Boolean);

  const visible = expanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <section aria-labelledby="about-car-heading" className="min-w-0">
      <h2
        id="about-car-heading"
        className="text-[1.75rem] font-medium leading-[1.15em] tracking-[-0.03em] text-navy sm:text-[2rem]"
      >
        About this {vehicle.model}
      </h2>
      <div className="mt-4 max-w-2xl space-y-3 text-[0.95rem] leading-relaxed text-secondary">
        {visible.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      {paragraphs.length > 2 ? (
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Read full description"}
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#ECF3F8]">
            <IconChevron className={expanded ? "rotate-180" : undefined} />
          </span>
        </button>
      ) : null}
    </section>
  );
}
