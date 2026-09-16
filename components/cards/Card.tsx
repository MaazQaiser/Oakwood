import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  type FinanceDisplayState,
  FinancialNumber,
  MonthlyPayment,
} from "@/components/finance/FinancePrimitives";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconPin } from "@/components/ui/icons";
import { VehicleAvailabilityBadge } from "@/components/vehicle/VehicleAvailabilityBadge";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { getVehicleUrl } from "@/config/routes";
import type { Vehicle } from "@/types/vehicle";
import Link from "next/link";

export function PromoPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-primary-soft px-6 py-10 md:px-12 md:py-14",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
  padded = true,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  padded?: boolean;
  "aria-label"?: string;
}) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={cn(
        "rounded-2xl border border-border/80 bg-surface shadow-sm",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function ContentCard({
  title,
  children,
  href,
}: {
  title: string;
  children?: ReactNode;
  href?: string;
}) {
  const heading = <h2 className="text-h5">{title}</h2>;

  return (
    <Card as="article">
      {href ? <a href={href}>{heading}</a> : heading}
      {children ? <div className="mt-2 text-body-sm text-muted">{children}</div> : null}
    </Card>
  );
}

export function VehicleCard({
  vehicle,
  monthly,
  state = "representative",
  gapAmount,
  action,
  toolbar,
  financeActions,
  imagePriority = false,
}: {
  vehicle: Vehicle;
  monthly?: number;
  state?: FinanceDisplayState;
  gapAmount?: number;
  action?: ReactNode;
  toolbar?: ReactNode;
  financeActions?: ReactNode;
  imagePriority?: boolean;
}) {
  const imageLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const monthlyAmount = monthly ?? vehicle.monthlyPayment;
  const availabilityLabel =
    vehicle.availability === "reserved"
      ? "Reserved"
      : vehicle.availability === "sold"
        ? "Sold"
        : vehicle.availability === "expired"
          ? "Unavailable"
          : undefined;

  return (
    <Card
      as="article"
      padded={false}
      className="flex h-full flex-col overflow-hidden border-0 p-4 shadow-sm"
      aria-label={
        availabilityLabel
          ? `${imageLabel}, ${availabilityLabel}`
          : undefined
      }
    >
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-page-tint">
          <Image
            src={vehicle.image ?? "/images/vehicle-placeholder.svg"}
            alt={imageLabel}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={imagePriority}
            unoptimized={(vehicle.image ?? "/images/vehicle-placeholder.svg").endsWith(".svg")}
            className="object-cover"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-surface px-2.5 py-1 text-caption text-ink shadow-sm">
            {vehicle.year}
          </span>
          {vehicle.availability !== "available" ? (
            <VehicleAvailabilityBadge availability={vehicle.availability} />
          ) : null}
        </div>
        {toolbar ? (
          <div className="absolute right-3 top-3">{toolbar}</div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-1 pb-1 pt-4">
        <div>
          <h3 className="text-h6">
            <Link href={getVehicleUrl(vehicle)} className="text-ink no-underline hover:text-primary">
              {vehicle.make} {vehicle.model}
            </Link>
          </h3>
          {vehicle.derivative ? (
            <p className="mt-1 text-body-sm text-muted">{vehicle.derivative}</p>
          ) : null}
        </div>
        <MonthlyPayment
          amount={monthlyAmount}
          state={state}
          gapAmount={gapAmount}
          size="md"
        />
        <p className="text-body-sm text-muted">
          <FinancialNumber
            value={formatPounds(vehicle.cashPrice)}
            size="sm"
            className="text-muted"
          />{" "}
          cash price
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted">
          <span>{formatNumber(vehicle.mileage)} miles</span>
          <span>{vehicle.fuelType}</span>
          <span>{vehicle.transmission}</span>
        </div>
        <p className="flex items-center gap-1.5 text-caption text-muted">
          <IconPin className="h-3.5 w-3.5" />
          {vehicle.locationName}
        </p>
        {financeActions ? <div>{financeActions}</div> : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {action ?? (
            <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
              View car
              <IconArrow />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
