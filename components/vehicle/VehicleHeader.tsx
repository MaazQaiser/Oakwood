"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber } from "@/lib/format/money";
import { getVehicleIdentity } from "@/lib/vehicles/labels";
import { cn } from "@/lib/cn";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleHeader({ vehicle }: { vehicle: VehicleDetail }) {
  const [shared, setShared] = useState<"idle" | "copied">("idle");
  const { title, subtitle } = getVehicleIdentity(vehicle);
  const mileageLabel = `${formatNumber(vehicle.mileage)} miles`;
  const badges = [
    { label: String(vehicle.year), emphasis: false },
    { label: mileageLabel, emphasis: true },
    { label: vehicle.fuelType, emphasis: false },
    { label: vehicle.transmission, emphasis: false },
    { label: vehicle.bodyStyle, emphasis: false },
  ].filter((badge) => Boolean(badge.label));

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
          <Chip
            key={badge.label}
            className={cn(
              badge.emphasis
                ? "border-primary/20 bg-primary-soft px-3 py-1.5 text-body-sm font-semibold text-primary"
                : "border-transparent bg-page-tint px-2.5 py-1 text-caption text-ink",
            )}
          >
            {badge.label}
          </Chip>
        ))}
      </div>
      <div className="mt-3">
        <Button
          type="button"
          variant="text"
          className="px-0"
          onClick={() => {
            const url = window.location.href;
            const text = `${title} at Oakwood`;
            if (navigator.share) {
              void navigator.share({ title: text, url }).catch(() => undefined);
              return;
            }
            void navigator.clipboard.writeText(url).then(() => setShared("copied"));
          }}
        >
          {shared === "copied" ? "Link copied" : "Share this car"}
        </Button>
      </div>
    </header>
  );
}
