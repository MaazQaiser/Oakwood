/** Single source values for the interest free page. Never retype these per component. */

export const REPRESENTATIVE_APR = 0.129;
export const RATES_FROM_APR = 0.094;
export const MAX_ADVANCE = 10_000;
export const MIN_DEPOSIT_RATIO = 0.5;
export const ZERO_TERMS = [12, 18] as const;
export const TERM_STOPS = [12, 18, 24, 36, 48, 60] as const;
export const DEFAULT_ZERO_TERM = 18;
export const CONTRIBUTION_CAP = 1_000;
export const CONTRIBUTION_RATE = 0.129;
export const MAX_AGE_END = 15;
export const MAX_MILES_END = 150_000;
export const STANDARD_TERMS = [24, 36, 48, 60, 72, 84] as const;
export const PCP_MILEAGE_OPTIONS = [5_000, 8_000, 10_000, 12_000, 15_000] as const;
export const DEFAULT_PCP_MILEAGE = 8_000;
export const PACKAGE_MOT = 350;
export const PACKAGE_SUPAGARD = 599;
export const PREMIUM_BRANDS = [
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Volvo",
  "Tesla",
  "Cupra",
] as const;

export type TermStop = (typeof TERM_STOPS)[number];
export type ZeroTerm = (typeof ZERO_TERMS)[number];

export function isZeroTerm(term: number): term is ZeroTerm {
  return (ZERO_TERMS as readonly number[]).includes(term);
}

export function isTermStop(term: number): term is TermStop {
  return (TERM_STOPS as readonly number[]).includes(term);
}
