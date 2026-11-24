/**
 * Admin/backend 30 Day Exchange or Money Back Guarantee configuration.
 * Draft commercial figures from the Appifest brief. Tune here without a release.
 * Do not copy these literals into product UI — import this config.
 */
export const guaranteeConfig = {
  periodDays: 30,
  mileageAllowance: 750,
  excessMileageChargePerMile: 1,
  refundAdminFee: 99,
  exchangeAdminFee: 0,
  freeCollectionRadiusMiles: 25,
  collectionChargePerMileRoundTrip: 1.5,
  refundPaymentDays: 7,
  refundsPerCustomerMonths: 12,
  maxRefundsPerCustomer: 1,
  returnWithinHoursOfAcceptance: 48,
  advisorCallTargetWorkingDays: 1,
  /** Eligible stock is on by default; off for trade and sold-as-seen. */
  eligibleByDefault: true,
} as const;

export const GUARANTEE_REASON_OPTIONS = [
  { value: "does_not_suit", label: "Does not suit my needs" },
  { value: "size_or_space", label: "Size or space" },
  { value: "running_costs", label: "Running costs" },
  { value: "driving_feel", label: "Driving feel" },
  { value: "found_elsewhere", label: "Found a car elsewhere" },
  { value: "affordability", label: "Affordability" },
  { value: "fault", label: "Fault or problem with the car" },
  { value: "other", label: "Other" },
] as const;

export type GuaranteeReasonCode =
  (typeof GUARANTEE_REASON_OPTIONS)[number]["value"];

import type { Vehicle } from "@/types/vehicle";
import {
  collectionChargeForDistance,
  excessMileageChargeLabel,
  formatGuaranteeMoney,
  guaranteeMileageLabel,
  guaranteePeriodLabel,
} from "@/lib/guarantee/format";

/** @deprecated Prefer {@link isGuaranteeEligible}; kept for brief naming. */
export { isVehicleGuaranteeEligible as isGuaranteeEligible } from "@/lib/guarantee/eligibility";

export function excessMileageCharge(excessMiles: number): number {
  return excessMiles * guaranteeConfig.excessMileageChargePerMile;
}

/** Round-trip collection charge when one-way distance is beyond the free radius. */
export function collectionCharge(oneWayMilesBeyondRadius: number): number {
  return oneWayMilesBeyondRadius * 2 * guaranteeConfig.collectionChargePerMileRoundTrip;
}

export {
  collectionChargeForDistance,
  excessMileageChargeLabel,
  formatGuaranteeMoney,
  guaranteeMileageLabel,
  guaranteePeriodLabel,
};

export type GuaranteeEligibleVehicle = Pick<Vehicle, "guaranteeEligible" | "saleType">;

export const GUARANTEE_LAUNCH_BLOCKERS = [
  "Written confirmation from each lender on how a day 15 to 30 return is settled and how commission clawback works",
  "Compliance provider sign off on the wording against Consumer Duty and the CPRs",
  "Damage charge schedule agreed with the prep centre, priced at SMART repair rates",
  "Return reason codes set up in Eskimo so return rate is tracked by car, salesperson and lead source",
] as const;
