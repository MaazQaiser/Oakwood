"use client";

import Image from "next/image";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { formatPounds } from "@/lib/format/money";

export function DealPinnedVehicle() {
  const { vehicle } = useDealBuilder();
  const title = `${vehicle.make} ${vehicle.model}`;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
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
