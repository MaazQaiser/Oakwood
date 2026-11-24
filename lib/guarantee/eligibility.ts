import type { Vehicle } from "@/types/vehicle";

/** Eligible when the flag is omitted or true. Off for trade and sold-as-seen. */
export function isGuaranteeEligible(
  vehicle: Pick<Vehicle, "guaranteeEligible" | "saleType">,
): boolean {
  if (vehicle.guaranteeEligible === false) {
    return false;
  }
  if (vehicle.saleType === "trade" || vehicle.saleType === "sold_as_seen") {
    return false;
  }
  return true;
}

/** @alias isGuaranteeEligible */
export const isVehicleGuaranteeEligible = isGuaranteeEligible;
