import {
  CAR_APR,
  MAX_AGE_END,
  MAX_MILES_END,
  STANDARD_TERMS,
} from "@/lib/finance/negative-equity/constants";

/** Convert APR to a monthly rate: i = (1 + APR)^(1/12) - 1. Never APR / 12. */
export function monthlyRate(apr: number): number {
  return Math.pow(1 + apr, 1 / 12) - 1;
}

export function hpPayment(credit: number, months: number, apr: number): number {
  if (credit <= 0 || months <= 0) return 0;
  const i = monthlyRate(apr);
  return (credit * i) / (1 - Math.pow(1 + i, -months));
}

export function pcpPayment(
  credit: number,
  months: number,
  gfv: number,
  apr: number,
): number {
  if (credit <= 0 || months <= 0) return 0;
  const i = monthlyRate(apr);
  const principal = credit - gfv / Math.pow(1 + i, months);
  return (principal * i) / (1 - Math.pow(1 + i, -months));
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

export function carPayment(
  product: "hp" | "pcp",
  credit: number,
  months: number,
  gfv: number,
  apr: number = CAR_APR,
): number {
  return product === "pcp"
    ? pcpPayment(credit, months, gfv, apr)
    : hpPayment(credit, months, apr);
}

export function ceilToNearest(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.ceil(value / step) * step;
}

export function money(n: number): string {
  return `£${Math.round(n).toLocaleString("en-GB")}`;
}

export function money2(n: number): string {
  return `£${n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function digits(value: string | number): number {
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
}
