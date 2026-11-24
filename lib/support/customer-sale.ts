import { mockVehicles } from "@/lib/mock/data";
import { normaliseRegistration } from "@/lib/support/validation";

export interface CustomerSaleRecord {
  stockId: string;
  registration: string;
  vehicleLabel: string;
  soldAt: string;
  locationSlug: string;
  locationName: string;
}

export function lookupCustomerSaleByRegistration(
  registration: string,
): CustomerSaleRecord | undefined {
  const target = normaliseRegistration(registration);
  if (!target) {
    return undefined;
  }

  const vehicle = mockVehicles.find((item) => {
    if (!item.registration) {
      return false;
    }
    return normaliseRegistration(item.registration) === target;
  });

  if (!vehicle) {
    return undefined;
  }

  return {
    stockId: vehicle.stockId,
    registration: target,
    vehicleLabel: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    soldAt: vehicle.soldAt ?? vehicle.listedAt,
    locationSlug: vehicle.locationSlug,
    locationName: vehicle.locationName,
  };
}