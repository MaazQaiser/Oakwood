"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Card } from "@/components/cards/Card";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { getVehicleUrl } from "@/config/routes";
import { formatNumber, formatPounds } from "@/lib/format/money";

export function VehicleDealSummary() {
  const { vehicle } = useDealBuilder();
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <Card as="section" className="overflow-hidden p-0">
      <div className="flex gap-3 p-3 md:block md:p-0">
        <div className="relative h-20 w-[5.5rem] shrink-0 overflow-hidden rounded-md bg-page md:h-auto md:w-full md:rounded-none md:aspect-[16/10]">
          <Image
            src={vehicle.imageSrc}
            alt={vehicle.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 420px, 88px"
          />
        </div>
        <div className="min-w-0 flex-1 md:p-4">
          <h2 className="text-h3">{title}</h2>
          {vehicle.derivative ? (
            <p className="mt-1 text-body-sm text-muted">{vehicle.derivative}</p>
          ) : null}
          <p className="mt-2 text-body-sm text-muted md:mt-3">
            {formatNumber(vehicle.mileage)} miles
            <span className="md:hidden">
              {" · "}
              {vehicle.fuelType}
            </span>
          </p>
          <p className="hidden text-body-sm text-muted md:block">
            {vehicle.fuelType} · {vehicle.transmission}
          </p>
          <p className="mt-1 text-caption text-muted">{vehicle.locationName}</p>
          <p className="mt-2 md:mt-4">
            <span className="text-caption text-muted">Cash price</span>
            {" "}
            <FinancialNumber value={formatPounds(vehicle.cashPrice)} size="sm" />
          </p>
          <p className="mt-2 md:mt-3">
            <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
              View vehicle
            </Button>
          </p>
        </div>
      </div>
    </Card>
  );
}
