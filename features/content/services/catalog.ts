import { getMakeName, getModelName } from "@/lib/vehicles/labels";
import { listVehicles } from "@/lib/vehicles/query";
import { formatNumber, formatPounds } from "@/lib/format/money";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export interface ModelStockSummary {
  make: string;
  model: string;
  makeSlug: string;
  modelSlug: string;
  count: number;
  availableCount: number;
  years: string;
  bodyStyles: string[];
  fuelTypes: string[];
  transmissions: string[];
  locations: string[];
  doors: string[];
  seats: string[];
  listedPriceRange?: string;
  listedMileageRange?: string;
}

function unique(values: Array<string | number | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .filter((value): value is string | number => value !== undefined && value !== "")
        .map(String),
    ),
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function getModelStock(
  makeSlug: string,
  modelSlug: string,
  category: VehicleCategory = "car",
): Vehicle[] {
  return listVehicles(category).filter(
    (vehicle) =>
      vehicle.makeSlug === makeSlug &&
      vehicle.modelSlug === modelSlug &&
      vehicle.availability !== "sold" &&
      vehicle.availability !== "expired",
  );
}

export function summarizeModelStock(
  makeSlug: string,
  modelSlug: string,
  category: VehicleCategory = "car",
): ModelStockSummary | null {
  const vehicles = getModelStock(makeSlug, modelSlug, category);
  const make = getMakeName(makeSlug, category) ?? makeSlug;
  const model = getModelName(makeSlug, modelSlug, category) ?? modelSlug;

  if (vehicles.length === 0) {
    return {
      make,
      model,
      makeSlug,
      modelSlug,
      count: 0,
      availableCount: 0,
      years: "",
      bodyStyles: [],
      fuelTypes: [],
      transmissions: [],
      locations: [],
      doors: [],
      seats: [],
    };
  }

  const years = vehicles.map((vehicle) => vehicle.year);
  const prices = vehicles.map((vehicle) => vehicle.cashPrice);
  const miles = vehicles.map((vehicle) => vehicle.mileage);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minMiles = Math.min(...miles);
  const maxMiles = Math.max(...miles);

  return {
    make,
    model,
    makeSlug,
    modelSlug,
    count: vehicles.length,
    availableCount: vehicles.filter((vehicle) => vehicle.availability === "available")
      .length,
    years: minYear === maxYear ? String(minYear) : `${minYear}–${maxYear}`,
    bodyStyles: unique(vehicles.map((vehicle) => vehicle.bodyStyle)),
    fuelTypes: unique(vehicles.map((vehicle) => vehicle.fuelType)),
    transmissions: unique(vehicles.map((vehicle) => vehicle.transmission)),
    locations: unique(vehicles.map((vehicle) => vehicle.locationName)),
    doors: unique(vehicles.map((vehicle) => vehicle.doors)),
    seats: unique(vehicles.map((vehicle) => vehicle.seats)),
    listedPriceRange:
      minPrice === maxPrice
        ? formatPounds(minPrice)
        : `${formatPounds(minPrice)}–${formatPounds(maxPrice)}`,
    listedMileageRange:
      minMiles === maxMiles
        ? `${formatNumber(minMiles)} miles`
        : `${formatNumber(minMiles)}–${formatNumber(maxMiles)} miles`,
  };
}

export function getModelsByBodyStyle(
  bodyStyle: string,
  category: VehicleCategory = "car",
): Array<{ makeSlug: string; modelSlug: string; make: string; model: string; count: number }> {
  const grouped = new Map<
    string,
    { makeSlug: string; modelSlug: string; make: string; model: string; count: number }
  >();

  listVehicles(category)
    .filter(
      (vehicle) =>
        vehicle.bodyStyle.toLowerCase() === bodyStyle.toLowerCase() &&
        vehicle.availability !== "sold" &&
        vehicle.availability !== "expired",
    )
    .forEach((vehicle) => {
      const key = `${vehicle.makeSlug}:${vehicle.modelSlug}`;
      const current = grouped.get(key);
      if (current) {
        current.count += 1;
        return;
      }
      grouped.set(key, {
        makeSlug: vehicle.makeSlug,
        modelSlug: vehicle.modelSlug,
        make: vehicle.make,
        model: vehicle.model,
        count: 1,
      });
    });

  return Array.from(grouped.values()).sort((a, b) =>
    `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`),
  );
}

export function getSimilarModelStock(
  makeSlug: string,
  modelSlug: string,
  category: VehicleCategory = "car",
  limit = 4,
): Vehicle[] {
  const current = getModelStock(makeSlug, modelSlug, category);
  if (current.length === 0) {
    return [];
  }
  const bodyStyle = current[0]?.bodyStyle;
  const catalog = listVehicles(category).filter(
    (vehicle) =>
      vehicle.availability === "available" &&
      !(vehicle.makeSlug === makeSlug && vehicle.modelSlug === modelSlug) &&
      (!bodyStyle || vehicle.bodyStyle === bodyStyle),
  );

  const seen = new Set<string>();
  const uniqueModels: Vehicle[] = [];
  for (const vehicle of catalog) {
    const key = `${vehicle.makeSlug}:${vehicle.modelSlug}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    uniqueModels.push(vehicle);
    if (uniqueModels.length >= limit) {
      break;
    }
  }

  return uniqueModels;
}

export function bodyStyleValues(bodyStyle: string, category: VehicleCategory = "car") {
  const vehicles = listVehicles(category).filter(
    (vehicle) =>
      vehicle.bodyStyle.toLowerCase() === bodyStyle.toLowerCase() &&
      vehicle.availability !== "sold" &&
      vehicle.availability !== "expired",
  );

  return {
    count: vehicles.length,
    fuelTypes: unique(vehicles.map((vehicle) => vehicle.fuelType)),
    transmissions: unique(vehicles.map((vehicle) => vehicle.transmission)),
    models: unique(vehicles.map((vehicle) => `${vehicle.make} ${vehicle.model}`)),
  };
}
