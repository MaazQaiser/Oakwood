/**
 * Running cost assumptions for the cheap to run page. Checked November 2026.
 * These move, so update them here rather than in components.
 */
export const RUNNING_COST_RATES = {
  petrolPerLitre: 1.671,
  dieselPerLitre: 1.968,
  homePerKwh: 0.28,
  rapidPerKwh: 0.79,
  litresPerGallon: 4.54609,
  roadTaxStandard: 200,
  fuelPricesWeekEnding: "16 November 2026",
  roadTaxYear: "2026/27",
} as const;

/** Finance shown on running cost cards: 10% deposit at the representative APR. */
export const RUNNING_COST_DEPOSIT_RATIO = 0.1;

/** Annual premium for a group 1 car and a 30 to 49 year old driver. */
export const INSURANCE_BASE = 420;

export const DRIVER_AGES = [
  { id: "17-19", multiplier: 4.6 },
  { id: "20-21", multiplier: 3.1 },
  { id: "22-24", multiplier: 2.1 },
  { id: "25-29", multiplier: 1.45 },
  { id: "30-49", multiplier: 1.0 },
  { id: "50+", multiplier: 0.84 },
] as const;

export type DriverAge = (typeof DRIVER_AGES)[number]["id"];

export const ANNUAL_MILEAGES = [5_000, 8_000, 12_000, 20_000] as const;
export const INSURANCE_GROUP_CAPS = [5, 10, 15, 20, 30] as const;
export const CASH_PRICE_CAPS = [7_000, 10_000, 15_000, 20_000] as const;

export type ChargingAccess = "home" | "public";
