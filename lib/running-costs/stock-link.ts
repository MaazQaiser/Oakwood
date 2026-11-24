import type { RunningCostCar } from "@/lib/running-costs";
import { listVehicles } from "@/lib/vehicles/query";
import { slugifySegment } from "@/lib/vehicles/slug";
import type { Vehicle } from "@/types/vehicle";

/** The stock car a cheap-to-run card should open. */
export function vehicleForRunningCost(car: RunningCostCar): Vehicle | undefined {
  const makeSlug = slugifySegment(car.make);
  const modelSlug = slugifySegment(car.model);
  const matches = listVehicles("car").filter(
    (vehicle) =>
      vehicle.availability !== "sold" &&
      vehicle.makeSlug === makeSlug &&
      vehicle.modelSlug === modelSlug,
  );

  return matches.sort(
    (a, b) =>
      Math.abs(a.cashPrice - car.cashPrice) - Math.abs(b.cashPrice - car.cashPrice) ||
      Math.abs(a.year - car.year) - Math.abs(b.year - car.year),
  )[0];
}
