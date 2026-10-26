"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Badge";
import { IconShare } from "@/components/ui/icons";
import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber } from "@/lib/format/money";
import { getVehicleIdentity } from "@/lib/vehicles/labels";
import type { VehicleDetail } from "@/types/vehicle-detail";

const SPEC_CHIP =
  "border-primary/20! bg-primary-soft! px-3 py-1.5 text-body-sm font-semibold! text-primary";

export function VehicleHeader({ vehicle }: { vehicle: VehicleDetail }) {
  const [shared, setShared] = useState<"idle" | "copied">("idle");
  const { title, subtitle } = getVehicleIdentity(vehicle);
  const badges = [
    String(vehicle.year),
    `${formatNumber(vehicle.mileage)} miles`,
    vehicle.fuelType,
    vehicle.transmission,
    vehicle.bodyStyle,
  ].filter((label) => Boolean(label));

  function shareCar() {
    const url = window.location.href;
    const text = `${title} at Oakwood`;
    if (navigator.share) {
      void navigator.share({ title: text, url }).catch(() => undefined);
      return;
    }
    void navigator.clipboard.writeText(url).then(() => setShared("copied"));
  }

  return (
    <header className="vdp-hero__header -mt-3 min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <VehicleAvailabilityBadge availability={vehicle.availability} />
        {vehicle.registration ? (
          <p className="text-caption font-semibold tracking-[0.04em] text-muted uppercase">
            {vehicle.registration}
          </p>
        ) : null}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <h1 className="min-w-0 text-[1.75rem] font-medium leading-tight tracking-[-0.03em] text-ink sm:text-[2rem]">
          {title}
        </h1>
        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-primary hover:bg-primary-soft"
          aria-label={shared === "copied" ? "Link copied" : "Share this car"}
          onClick={shareCar}
        >
          <IconShare />
        </button>
      </div>
      {subtitle ? (
        <p className="mt-1 text-body-sm text-muted">{subtitle}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {badges.map((label) => (
          <Chip key={label} className={SPEC_CHIP}>
            {label}
          </Chip>
        ))}
      </div>
    </header>
  );
}
