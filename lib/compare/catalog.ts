import { findVehicleByStockId } from "@/lib/vehicles/query";
import type { Vehicle } from "@/types/vehicle";
import { COMPARE_MAX } from "@/lib/compare/copy";

export function isComparableVehicle(
  vehicle: Vehicle | undefined,
): vehicle is Vehicle {
  return (
    vehicle !== undefined &&
    vehicle.category === "car" &&
    vehicle.availability === "available"
  );
}

export function pruneCompareIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) {
      continue;
    }
    const vehicle = findVehicleByStockId(id);
    if (!isComparableVehicle(vehicle)) {
      continue;
    }
    seen.add(id);
    next.push(id);
    if (next.length === COMPARE_MAX) {
      break;
    }
  }
  return next;
}

export function resolveCompareVehicles(ids: string[]): Vehicle[] {
  return pruneCompareIds(ids)
    .map((id) => findVehicleByStockId(id))
    .filter(isComparableVehicle);
}
