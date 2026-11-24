import { vehicleCardImage } from "@/lib/media/stock";
import { listVehicles } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import type {
  NegEquityPageModel,
  NegEquityStockCar,
} from "@/features/finance/negative-equity/types";
import type { Vehicle } from "@/types/vehicle";

function toStockCar(vehicle: Vehicle): NegEquityStockCar {
  const imageSrc = vehicle.image ?? vehicleCardImage(vehicle);
  return {
    id: vehicle.stockId,
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
    image: imageSrc,
    imageSrc,
    imageAlt: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  };
}

/** Seed around the prototype's worked example price band (~£16k). */
function pickInitial(cars: NegEquityStockCar[]): NegEquityStockCar | null {
  if (!cars.length) return null;
  const target = 16_000;
  return [...cars].sort(
    (a, b) =>
      Math.abs(a.cashPrice - target) - Math.abs(b.cashPrice - target),
  )[0] ?? null;
}

export async function loadNegativeEquityPage(): Promise<NegEquityPageModel> {
  const cars = listVehicles("car")
    .filter(isReservable)
    .map(toStockCar)
    .sort((a, b) => a.cashPrice - b.cashPrice);

  const initial = pickInitial(cars);

  return {
    cars,
    initialStockId: initial?.id ?? null,
  };
}
