"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { getVehicleUrl } from "@/config/routes";
import { formatNumber, formatPounds } from "@/lib/format/money";
import type { CalculatorVehicle } from "@/features/finance/calculator/types";

export function CalculatorVehicleCard({
  vehicle,
}: {
  vehicle: CalculatorVehicle;
}) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <Card as="section" className="overflow-hidden p-0">
      <div className="relative aspect-[16/10] bg-page">
        <Image
          src={vehicle.imageSrc}
          alt={vehicle.imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 420px, 100vw"
          unoptimized={vehicle.imageSrc.endsWith(".svg")}
        />
      </div>
      <div className="p-4">
        <h2 className="text-h3">{title}</h2>
        {vehicle.derivative ? (
          <p className="mt-1 text-body-sm text-muted">{vehicle.derivative}</p>
        ) : null}
        <p className="mt-3 text-body-sm text-muted">
          {formatNumber(vehicle.mileage)} miles
        </p>
        <p className="mt-1">
          <span className="text-caption text-muted">Listed cash price</span>
          <br />
          <FinancialNumber value={formatPounds(vehicle.cashPrice)} />
        </p>
        <p className="mt-3">
          <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
            View vehicle
          </Button>
        </p>
      </div>
    </Card>
  );
}
