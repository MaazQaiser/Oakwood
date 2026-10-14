"use client";

import Image from "next/image";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { formatPounds } from "@/lib/format/money";

/**
 * The car being built stays anchored on every step (spec M1).
 * `strip` is the slim mobile header; `card` is the desktop sidebar.
 */
export function DealPinnedVehicle({
  layout = "card",
  trailing,
}: {
  layout?: "strip" | "card";
  trailing?: React.ReactNode;
}) {
  const { vehicle } = useDealBuilder();
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  if (layout === "card") {
    return (
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-page-tint">
          <Image
            src={vehicle.imageSrc}
            alt={vehicle.imageAlt}
            fill
            className="object-cover"
            sizes="288px"
          />
        </div>
        <p className="mt-3 line-clamp-2 text-body font-semibold! leading-snug tracking-[-0.01em] text-navy">
          {title}
        </p>
        {vehicle.derivative ? (
          <p className="mt-0.5 truncate text-caption text-muted">
            {vehicle.derivative}
          </p>
        ) : null}
        <p className="mt-1.5 tabular-number text-body-sm font-semibold! text-ink">
          {formatPounds(vehicle.cashPrice)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-[10px] bg-page-tint">
        <Image
          src={vehicle.imageSrc}
          alt={vehicle.imageAlt}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-label text-navy">{title}</p>
        <p className="truncate text-caption text-muted">
          <span className="tabular-number font-semibold! text-ink">
            {formatPounds(vehicle.cashPrice)}
          </span>
          {vehicle.derivative ? ` · ${vehicle.derivative}` : null}
        </p>
      </div>
      {trailing}
    </div>
  );
}
