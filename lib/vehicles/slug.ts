import type { Vehicle } from "@/types/vehicle";

export function slugifySegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildVehicleSlug(vehicle: {
  makeSlug: string;
  modelSlug: string;
  locationSlug: string;
  regionSlug: string;
  stockId: string;
}): string {
  return [
    "used",
    vehicle.makeSlug,
    vehicle.modelSlug,
    vehicle.locationSlug,
    vehicle.regionSlug,
    vehicle.stockId,
  ].join("-");
}

export function parseVehicleSlug(
  slug: string,
): { slug: string; stockId: string } | null {
  const match = slug.match(/^used-.+-(\d+)$/);

  if (!match) {
    return null;
  }

  return {
    slug,
    stockId: match[1],
  };
}

export function isVehicleSlug(slug: string): boolean {
  return parseVehicleSlug(slug) !== null;
}

export function getVehicleBySlug(
  vehicles: Vehicle[],
  slug: string,
): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getVehicleByStockId(
  vehicles: Vehicle[],
  stockId: string,
): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.stockId === stockId);
}
