import { findVehicleByStockId } from "@/lib/vehicles";
import { getVehicleUrl } from "@/config/routes";
import type { SupportVehicleContext } from "@/types/support";

export function getSupportVehicleContext(
  stockId?: string,
): SupportVehicleContext | undefined {
  if (!stockId) {
    return undefined;
  }
  const vehicle = findVehicleByStockId(stockId);
  if (!vehicle) {
    return undefined;
  }
  return {
    stockId: vehicle.stockId,
    label: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    href: getVehicleUrl(vehicle),
  };
}
