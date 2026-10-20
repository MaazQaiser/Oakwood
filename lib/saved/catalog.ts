import { findVehicleByStockId } from "@/lib/vehicles/query";
import type { Vehicle } from "@/types/vehicle";

export const SAVED_STORAGE_KEY = "oakwood-saved-vehicles";
export const SAVED_MAX = 30;

export function pruneSavedIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) {
      continue;
    }
    if (!findVehicleByStockId(id)) {
      continue;
    }
    seen.add(id);
    next.push(id);
    if (next.length === SAVED_MAX) {
      break;
    }
  }
  return next;
}

export function resolveSavedVehicles(ids: string[]): Vehicle[] {
  return pruneSavedIds(ids).flatMap((id) => {
    const vehicle = findVehicleByStockId(id);
    return vehicle ? [vehicle] : [];
  });
}
