import { valuePartExchange } from "@/lib/deal/valuation";
import {
  PX_NOT_ELIGIBLE,
  PX_VALUATION_UNAVAILABLE,
} from "@/lib/part-exchange/copy";
import { normaliseRegistration } from "@/lib/part-exchange/validation";
import type { PxValueResult } from "@/types/part-exchange";

/**
 * Mock PX valuation. The live part-exchange-api integration is not connected.
 * Returns a single estimated value. Do not invent deduction rows here.
 */
export function valuePartExchangeVehicle(input: {
  registration: string;
  mileage: number;
  valuationDate: string;
}): PxValueResult {
  const cleaned = normaliseRegistration(input.registration);

  if (cleaned === "OLD99AA") {
    return {
      ok: false,
      reason: "ineligible",
      message: PX_NOT_ELIGIBLE,
    };
  }

  const result = valuePartExchange(cleaned, input.mileage);
  if (!result.ok) {
    return {
      ok: false,
      reason: "unavailable",
      message: PX_VALUATION_UNAVAILABLE,
    };
  }

  return {
    ok: true,
    valuation: {
      estimatedValue: result.value,
      valuationStatus: "valued",
      valuationDate: input.valuationDate,
      source: "mock",
    },
  };
}

export function formatVehicleLine(vehicle: {
  year: number;
  make: string;
  model: string;
}): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

export function formatVehicleMeta(vehicle: {
  variant?: string;
  fuelType: string;
  transmission: string;
}): string {
  const parts = [
    vehicle.variant,
    [vehicle.fuelType, vehicle.transmission].filter(Boolean).join(" · "),
  ].filter(Boolean);
  return parts.join(" · ");
}
