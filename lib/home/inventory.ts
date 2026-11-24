import { listVehicles } from "@/lib/vehicles/query";
import type { VehicleCategory } from "@/types/vehicle";

export function countAvailableStock(category: VehicleCategory = "car"): number {
  return listVehicles(category).filter(
    (vehicle) => vehicle.availability === "available",
  ).length;
}

/** Homepage proof strip and guarantee copy — live mock stock count. */
export function homeStockProofLead(category: VehicleCategory = "car"): string {
  const count = countAvailableStock(category);
  if (count <= 0) {
    return category === "van" ? "Vans in stock" : "Cars in stock";
  }
  const noun = category === "van" ? "vans" : "cars";
  return `${count} ${noun} in stock`;
}

export function homeFindCarCtaLabel(
  primaryLabel: string,
  category: VehicleCategory = "car",
): string {
  const count = countAvailableStock(category);
  return count > 0 ? `${primaryLabel}, ${count} available` : primaryLabel;
}