import {
  CONTRIBUTION_CAP,
  CONTRIBUTION_RATE,
  MAX_ADVANCE,
  MAX_AGE_END,
  MAX_MILES_END,
  REPRESENTATIVE_APR,
  STANDARD_TERMS,
} from "@/lib/finance/interest-free/constants";

/** Convert APR to a monthly rate: i = (1 + APR)^(1/12) - 1. Never APR / 12. */
export function monthlyRate(apr: number = REPRESENTATIVE_APR): number {
  return Math.pow(1 + apr, 1 / 12) - 1;
}

export function hpPayment(
  credit: number,
  months: number,
  apr: number = REPRESENTATIVE_APR,
): number {
  if (credit <= 0 || months <= 0) return 0;
  const i = monthlyRate(apr);
  return (credit * i) / (1 - Math.pow(1 + i, -months));
}

export function pcpPayment(
  credit: number,
  months: number,
  gfv: number,
  apr: number = REPRESENTATIVE_APR,
): number {
  if (credit <= 0 || months <= 0) return 0;
  const i = monthlyRate(apr);
  const principal = credit - gfv / Math.pow(1 + i, months);
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

/**
 * What 18 months of interest free costs Oakwood at the contribution rate,
 * rounded up to the nearest £25 and capped.
 */
export function contribution(advance: number): number {
  const a = Math.min(Math.max(0, advance), MAX_ADVANCE);
  if (a <= 0) return 0;
  const i = monthlyRate(CONTRIBUTION_RATE);
  const pay = (a * i) / (1 - Math.pow(1 + i, -18));
  return Math.min(CONTRIBUTION_CAP, Math.ceil((pay * 18 - a) / 25) * 25);
}

export function maxTermMonths(
  vehicle: { year: number; mileage: number },
  referenceYear = new Date().getFullYear(),
): number {
  const age = referenceYear - vehicle.year;
  const ageCap = (MAX_AGE_END - age) * 12;
  const milesCap = ((MAX_MILES_END - vehicle.mileage) / 10_000) * 12;
  const cap = Math.min(84, ageCap, milesCap);
  let best = 24;
  for (const t of STANDARD_TERMS) {
    if (t <= cap) best = t;
  }
  return best;
}

export function hpTerm(vehicle: { year: number; mileage: number }): number {
  return maxTermMonths(vehicle);
}

export function pcpTerm(vehicle: { year: number; mileage: number }): number {
  return Math.min(60, maxTermMonths(vehicle));
}

/** Illustrative GFV — replace with lender residual tables before launch. */
export function guaranteedFutureValue(
  vehicle: { year: number; cashPrice: number },
  months: number,
  annualMiles: number,
  referenceYear = new Date().getFullYear(),
): number {
  const finalAge = referenceYear - vehicle.year + months / 12;
  let factor = Math.max(0.1, 0.62 * Math.pow(0.84, finalAge - 3));
  factor -= ((annualMiles - 8_000) / 1_000) * 0.008;
  const raw = vehicle.cashPrice * Math.max(0.08, factor);
  return Math.max(500, Math.round(raw / 50) * 50);
}

export function ceilToNearest(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.ceil(value / step) * step;
}

export function floorPence(value: number): number {
  return Math.floor(value * 100) / 100;
}

/** Equal split with last payment absorbing rounding. */
export function splitPayments(
  total: number,
  months: number,
): { regular: number; finalPayment: number; monthly: number } {
  if (months <= 0) {
    return { regular: 0, finalPayment: 0, monthly: 0 };
  }
  if (months === 1) {
    const only = floorPence(total);
    return { regular: only, finalPayment: only, monthly: only };
  }
  const regular = floorPence(total / months);
  const finalPayment = Math.round((total - regular * (months - 1)) * 100) / 100;
  return { regular, finalPayment, monthly: total / months };
}
