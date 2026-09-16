import { listVehicles } from "@/lib/vehicles/query";
import type { Vehicle } from "@/types/vehicle";

export function listLocationStock(locationSlug: string): Vehicle[] {
  return listVehicles().filter(
    (vehicle) =>
      vehicle.locationSlug === locationSlug &&
      vehicle.availability === "available",
  );
}

export function countLocationStock(locationSlug: string): number {
  return listLocationStock(locationSlug).length;
}
