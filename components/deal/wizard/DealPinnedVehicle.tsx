"use client";

import Image from "next/image";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function DealPinnedVehicle({
  layout = "strip",
}: {
  layout?: "strip" | "card";
}) {
  const { vehicle } = useDealBuilder();
  const title = `${vehicle.make} ${vehicle.model}`;

  if (layout === "card") {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="relative aspect-[16/10] bg-page">
          <Image
            src={vehicle.imageSrc}
            alt={vehicle.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 360px, 100vw"
          />
        </div>
        <div className="space-y-2 p-4">
          <p className="text-h3">
            {vehicle.year} {title}
          </p>
          {vehicle.derivative ? (
            <p className="text-body-sm text-muted">{vehicle.derivative}</p>
          ) : null}
          <p className="text-body-sm text-muted">
            {formatNumber(vehicle.mileage)} miles · {vehicle.fuelType}
          </p>
          <p className="text-caption text-muted">{vehicle.locationName}</p>
          <p className="pt-1">
            <span className="text-caption text-muted">Cash price</span>
            <br />
            <FinancialNumber value={formatPounds(vehicle.cashPrice)} size="md" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-surface p-3",
      )}
    >
      <div className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-page">
        <Image
          src={vehicle.imageSrc}
          alt={vehicle.imageAlt}
          fill
          className="object-cover"
          sizes="72px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-label">
          {vehicle.year} {title}
        </p>
        {vehicle.derivative ? (
          <p className="truncate text-caption text-muted">{vehicle.derivative}</p>
        ) : null}
        <p className="mt-0.5">
          <FinancialNumber value={formatPounds(vehicle.cashPrice)} size="sm" />
        </p>
      </div>
    </div>
  );
}
