import { lookupPartExchangeVehicle } from "@/lib/part-exchange/lookup";
import { normaliseRegistration } from "@/lib/part-exchange/validation";
import type { AftersalesVehicle } from "@/types/aftersales";

export type AftersalesLookupSuccess = {
  ok: true;
  vehicle: AftersalesVehicle;
};

export type AftersalesLookupFailure = {
  ok: false;
  reason: "not_found" | "unavailable";
  message: string;
};

export type AftersalesLookupResult =
  | AftersalesLookupSuccess
  | AftersalesLookupFailure;

/**
 * Registration lookup for aftersales. Reuses the PX mock catalogue.
 * The live vehicle-lookup-api integration is not connected.
 * OLD99AA remains bookable here because PX age rules do not apply.
 */
export function lookupAftersalesVehicle(
  registration: string,
): AftersalesLookupResult {
  const cleaned = normaliseRegistration(registration);

  if (cleaned === "OLD99AA") {
    return {
      ok: true,
      vehicle: {
        year: 2004,
        make: "Ford",
        model: "Ka",
        variant: "1.3 Collection",
        fuelType: "Petrol",
        transmission: "Manual",
        source: "lookup",
      },
    };
  }

  const result = lookupPartExchangeVehicle(registration);
  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason === "not_found" ? "not_found" : "unavailable",
      message:
        result.reason === "not_found"
          ? "We couldn't find that registration. Check it and try again, or enter the vehicle details."
          : "We couldn't look up that registration right now. Try again, or enter the vehicle details.",
    };
  }

  return {
    ok: true,
    vehicle: {
      ...result.vehicle,
      source: "lookup",
    },
  };
}
