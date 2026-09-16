import { getStockLocation } from "@/config/locations";
import { listVehicles } from "@/lib/vehicles/query";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getMakeName(
  makeSlug?: string,
  category?: VehicleCategory,
): string | undefined {
  if (!makeSlug) {
    return undefined;
  }

  const match = listVehicles(category).find(
    (vehicle) => vehicle.makeSlug === makeSlug,
  );
  return match?.make ?? titleFromSlug(makeSlug);
}

export function getModelName(
  makeSlug?: string,
  modelSlug?: string,
  category?: VehicleCategory,
): string | undefined {
  if (!modelSlug) {
    return undefined;
  }

  const match = listVehicles(category).find(
    (vehicle) =>
      vehicle.modelSlug === modelSlug &&
      (!makeSlug || vehicle.makeSlug === makeSlug),
  );
  return match?.model ?? titleFromSlug(modelSlug);
}

export function getLocationName(locationSlug?: string): string | undefined {
  if (!locationSlug) {
    return undefined;
  }

  return getStockLocation(locationSlug)?.name ?? titleFromSlug(locationSlug);
}

export function getInventoryTitle(
  locked: {
    make?: string;
    model?: string;
    location?: string;
  },
  category: VehicleCategory = "car",
): string {
  const product = category === "van" ? "Vans" : "Cars";
  const make = getMakeName(locked.make, category);
  const model = getModelName(locked.make, locked.model, category);
  const location = getLocationName(locked.location);

  if (make && model && location) {
    return `Used ${make} ${model} ${product} for Sale in ${location}`;
  }
  if (make && location) {
    return `Used ${make} ${product} for Sale in ${location}`;
  }
  if (make && model) {
    return `Used ${make} ${model} ${product} for Sale`;
  }
  if (make) {
    return `Used ${make} ${product} for Sale`;
  }
  if (location) {
    return `Used ${product} for Sale in ${location}`;
  }
  return `Used ${product} for Sale`;
}

export function getMakes(category: VehicleCategory = "car"): Array<{
  slug: string;
  name: string;
}> {
  const seen = new Map<string, string>();
  listVehicles(category).forEach((vehicle) => {
    if (!seen.has(vehicle.makeSlug)) {
      seen.set(vehicle.makeSlug, vehicle.make);
    }
  });
  return Array.from(seen, ([slug, name]) => ({ slug, name })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getModels(
  makeSlug?: string,
  category: VehicleCategory = "car",
): Array<{ slug: string; name: string }> {
  const seen = new Map<string, string>();
  listVehicles(category)
    .filter((vehicle) => !makeSlug || vehicle.makeSlug === makeSlug)
    .forEach((vehicle) => {
      if (!seen.has(vehicle.modelSlug)) {
        seen.set(vehicle.modelSlug, vehicle.model);
      }
    });
  return Array.from(seen, ([slug, name]) => ({ slug, name })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function uniqueValues(
  pick: (vehicle: Vehicle) => string | number | undefined,
  category: VehicleCategory = "car",
): string[] {
  return Array.from(
    new Set(
      listVehicles(category)
        .map(pick)
        .filter((value): value is string | number => value !== undefined)
        .map(String),
    ),
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}
