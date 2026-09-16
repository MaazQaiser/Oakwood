import { getModelUrl } from "@/config/routes";
import type { Vehicle } from "@/types/vehicle";

/** Mock calendar date aligned with the catalogue year. Avoids Date.now() in SSR. */
export const CATALOGUE_DATE = "2026-09-15";

/** Sold vehicle URLs keep resolving for this many days, then redirect to the model page. */
export const SOLD_URL_RETENTION_DAYS = 90;

function utcDay(value: string): number {
  return Date.parse(`${value.slice(0, 10)}T00:00:00Z`);
}

export function daysSinceSold(
  soldAt: string,
  today: string = CATALOGUE_DATE,
): number {
  const start = utcDay(soldAt);
  const end = utcDay(today);
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }
  return Math.floor((end - start) / 86_400_000);
}

export function shouldRedirectSoldVehicle(vehicle: Vehicle): boolean {
  if (vehicle.availability !== "sold" && vehicle.availability !== "expired") {
    return false;
  }
  if (!vehicle.soldAt) {
    return false;
  }
  return daysSinceSold(vehicle.soldAt) > SOLD_URL_RETENTION_DAYS;
}

export function getSoldRedirectUrl(vehicle: Vehicle): string {
  return getModelUrl(vehicle.make, vehicle.model, vehicle.category === "van" ? "vans" : "cars");
}

export function shouldIndexVehicle(vehicle: Vehicle): boolean {
  return vehicle.availability === "available" || vehicle.availability === "reserved";
}

export function isReservable(vehicle: Vehicle): boolean {
  return vehicle.availability === "available";
}
