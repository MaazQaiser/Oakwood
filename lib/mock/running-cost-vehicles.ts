import { runningCostCars } from "@/lib/mock/running-costs";
import type { RunningCostCar } from "@/lib/running-costs";
import { buildVehicleSlug, slugifySegment } from "@/lib/vehicles/slug";
import type { Vehicle } from "@/types/vehicle";

const COLOURS = ["White", "Blue", "Grey", "Silver", "Black", "Red"] as const;

function locationFor(name: string): Pick<Vehicle, "locationSlug" | "locationName" | "regionSlug"> {
  if (name.toLowerCase() === "chorley") {
    return {
      locationSlug: "chorley",
      locationName: "Chorley",
      regionSlug: "lancashire",
    };
  }
  return {
    locationSlug: "bury",
    locationName: "Bury",
    regionSlug: "greater-manchester",
  };
}

function toVehicle(car: RunningCostCar, index: number): Vehicle {
  const makeSlug = slugifySegment(car.make);
  const modelSlug = slugifySegment(car.model);
  const location = locationFor(car.location);
  const stockId = String(9100001 + index);
  return {
    stockId,
    slug: buildVehicleSlug({
      makeSlug,
      modelSlug,
      locationSlug: location.locationSlug,
      regionSlug: location.regionSlug,
      stockId,
    }),
    category: "car",
    make: car.make,
    makeSlug,
    model: car.model,
    modelSlug,
    derivative: car.derivative,
    year: car.year,
    mileage: car.mileage,
    fuelType: car.fuelType,
    transmission: car.transmission,
    bodyStyle: car.bodyStyle,
    colour: COLOURS[index % COLOURS.length],
    doors: 5,
    seats: 5,
    cashPrice: car.cashPrice,
    monthlyPayment: Math.max(89, Math.round(car.cashPrice / 70)),
    listedAt: "2026-08-01",
    locationSlug: location.locationSlug,
    locationName: location.locationName,
    regionSlug: location.regionSlug,
    availability: "available",
    roadTaxCost: car.roadTax,
    avilooCertificate: car.fuelType === "Electric",
  };
}

/** Cars on the cheap-to-run page that are not already in the stock catalogue. */
export function runningCostCatalogueAdditions(existing: Vehicle[]): Vehicle[] {
  const stocked = new Set(existing.map((vehicle) => `${vehicle.makeSlug}/${vehicle.modelSlug}`));
  return runningCostCars.flatMap((car, index) => {
    const key = `${slugifySegment(car.make)}/${slugifySegment(car.model)}`;
    if (stocked.has(key)) return [];
    stocked.add(key);
    return [toVehicle(car, index)];
  });
}
