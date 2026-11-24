import { guaranteeConfig } from "@/config/guarantee";
import { formatNumber, formatPounds } from "@/lib/format/money";

export function guaranteePeriodLabel(
  days: number = guaranteeConfig.periodDays,
): string {
  return `${days} days`;
}

export function guaranteeMileageLabel(
  miles: number = guaranteeConfig.mileageAllowance,
): string {
  return `${formatNumber(miles)} miles`;
}

export function excessMileageChargeLabel(
  amount: number = guaranteeConfig.excessMileageChargePerMile,
): string {
  return formatPounds(amount, { exact: true });
}

export function refundAdminFeeLabel(
  amount: number = guaranteeConfig.refundAdminFee,
): string {
  return formatPounds(amount);
}

export function freeCollectionRadiusLabel(
  miles: number = guaranteeConfig.freeCollectionRadiusMiles,
): string {
  return `${formatNumber(miles)} miles`;
}

export function collectionChargePerMileLabel(
  amount: number = guaranteeConfig.collectionChargePerMileRoundTrip,
): string {
  return formatPounds(amount, { exact: true });
}

export function refundPaymentDaysLabel(
  days: number = guaranteeConfig.refundPaymentDays,
): string {
  return `${days} days`;
}

export function returnWithinHoursLabel(
  hours: number = guaranteeConfig.returnWithinHoursOfAcceptance,
): string {
  return `${hours} hours`;
}

/** Miles beyond free radius, charged both ways. */
export function collectionChargeForDistance(
  distanceMiles: number,
  freeRadius: number = guaranteeConfig.freeCollectionRadiusMiles,
  perMile: number = guaranteeConfig.collectionChargePerMileRoundTrip,
): number {
  const beyond = Math.max(0, distanceMiles - freeRadius);
  return beyond * 2 * perMile;
}

export function excessMilesUsed(
  currentMileage: number,
  handoverMileage: number,
  allowance: number = guaranteeConfig.mileageAllowance,
): { used: number; excess: number; charge: number } {
  const used = Math.max(0, currentMileage - handoverMileage);
  const excess = Math.max(0, used - allowance);
  const charge = excess * guaranteeConfig.excessMileageChargePerMile;
  return { used, excess, charge };
}

export function formatGuaranteeMoney(amount: number): string {
  if (Number.isInteger(amount)) {
    return formatPounds(amount);
  }
  return formatPounds(amount, { exact: true });
}
