import { vehicleCardImage } from "@/lib/media/stock";
import { needDepositTotal } from "@/lib/finance/interest-free/deal";
import { listVehicles } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import type {
  InterestFreePageModel,
  InterestFreeStockCar,
} from "@/features/finance/interest-free/types";
import type { Vehicle } from "@/types/vehicle";

function toStockCar(vehicle: Vehicle): InterestFreeStockCar {
  const imageSrc = vehicle.image ?? vehicleCardImage(vehicle);
  return {
    stockId: vehicle.stockId,
    slug: vehicle.slug,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    derivative: vehicle.derivative,
    cashPrice: vehicle.cashPrice,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    bodyStyle: vehicle.bodyStyle,
    locationName: vehicle.locationName,
    colour: vehicle.colour,
    image: imageSrc,
    imageSrc,
    imageAlt: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  };
}

/** Prefer a car near the worked-example price band that can still qualify. */
function pickHero(cars: InterestFreeStockCar[]): InterestFreeStockCar | null {
  if (cars.length === 0) return null;
  const target = 20_000;
  const ranked = [...cars].sort(
    (a, b) =>
      Math.abs(a.cashPrice - target) - Math.abs(b.cashPrice - target) ||
      b.cashPrice - a.cashPrice,
  );
  return ranked[0] ?? null;
}

/** Opening car: mid-price stock that qualifies with a sensible deposit. */
function pickInitial(cars: InterestFreeStockCar[]): InterestFreeStockCar | null {
  if (cars.length === 0) return null;
  const mid = [...cars]
    .filter((c) => needDepositTotal(c) <= 16_000)
    .sort((a, b) => a.cashPrice - b.cashPrice);
  return mid[Math.floor(mid.length / 3)] ?? cars[0] ?? null;
}

export async function loadInterestFreePage(): Promise<InterestFreePageModel> {
  const cars = listVehicles("car")
    .filter(isReservable)
    .map(toStockCar)
    .sort((a, b) => b.cashPrice - a.cashPrice);

  const hero = pickHero(cars);
  const initial = pickInitial(cars);

  return {
    cars,
    hero,
    initialStockId: initial?.stockId ?? null,
  };
}
