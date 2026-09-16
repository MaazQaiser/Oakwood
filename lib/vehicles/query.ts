import { mockVehicles } from "@/lib/mock/data";
import { getVehicleBySlug, getVehicleByStockId } from "@/lib/vehicles/slug";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export function listVehicles(category?: VehicleCategory): Vehicle[] {
  if (!category) {
    return mockVehicles;
  }

  return mockVehicles.filter((vehicle) => vehicle.category === category);
}

export function findVehicleBySlug(slug: string): Vehicle | undefined {
  return getVehicleBySlug(mockVehicles, slug);
}

export function findVehicleByStockId(stockId: string): Vehicle | undefined {
  return getVehicleByStockId(mockVehicles, stockId);
}

export function listMakes(category: VehicleCategory): string[] {
  return Array.from(
    new Set(
      listVehicles(category).map((vehicle) => vehicle.makeSlug),
    ),
  );
}

export function listModels(category: VehicleCategory, makeSlug: string): string[] {
  return Array.from(
    new Set(
      listVehicles(category)
        .filter((vehicle) => vehicle.makeSlug === makeSlug)
        .map((vehicle) => vehicle.modelSlug),
    ),
  );
}

export function listLocationSlugs(): string[] {
  return Array.from(new Set(mockVehicles.map((vehicle) => vehicle.locationSlug)));
}
