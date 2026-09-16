import { formatNumber } from "@/lib/format/money";

const CURRENT = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/;
const PREFIX = /^[A-Z][0-9]{1,3}[A-Z]{3}$/;
const SUFFIX = /^[A-Z]{3}[0-9]{1,3}[A-Z]$/;
const DATELESS = /^[A-Z]{1,3}[0-9]{1,4}[A-Z]?$/;
const MOCK_TOKENS = new Set(["FAIL", "UNKNOWN", "TIMEOUT", "OLD99AA", "NOTFOUND"]);

export const MIN_MILEAGE = 1;
export const MAX_MILEAGE = 400000;
export const MAX_SETTLEMENT = 250000;

export function normaliseRegistration(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export function formatRegistration(value: string): string {
  const cleaned = normaliseRegistration(value);
  if (CURRENT.test(cleaned)) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return cleaned;
}

export function isValidUkRegistration(value: string): boolean {
  const cleaned = normaliseRegistration(value);
  if (!cleaned) {
    return false;
  }
  if (MOCK_TOKENS.has(cleaned)) {
    return true;
  }
  if (cleaned.length < 2 || cleaned.length > 8) {
    return false;
  }
  return (
    CURRENT.test(cleaned) ||
    PREFIX.test(cleaned) ||
    SUFFIX.test(cleaned) ||
    DATELESS.test(cleaned)
  );
}

export function registrationError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Enter your registration.";
  }
  if (!isValidUkRegistration(trimmed)) {
    return "Enter a valid UK registration.";
  }
  return undefined;
}

export function parseMileage(value: string): number | undefined {
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) {
    return undefined;
  }
  if (!/^\d+$/.test(cleaned)) {
    return undefined;
  }
  const next = Number(cleaned);
  if (!Number.isFinite(next)) {
    return undefined;
  }
  return next;
}

export function mileageError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Enter the current mileage.";
  }
  const mileage = parseMileage(trimmed);
  if (mileage === undefined) {
    return "Enter mileage as a whole number, with no letters or symbols.";
  }
  if (mileage < MIN_MILEAGE) {
    return "Mileage can't be zero or negative.";
  }
  if (mileage > MAX_MILEAGE) {
    return `Enter a mileage of ${formatNumber(MAX_MILEAGE)} or less.`;
  }
  return undefined;
}

export function parsePounds(value: string): number | undefined {
  const cleaned = value.replace(/[£,\s]/g, "").trim();
  if (!cleaned) {
    return undefined;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    return undefined;
  }
  const next = Number(cleaned);
  if (!Number.isFinite(next)) {
    return undefined;
  }
  return Math.round(next);
}

export function settlementError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Enter your outstanding settlement figure.";
  }
  const amount = parsePounds(trimmed);
  if (amount === undefined) {
    return "Enter the settlement figure as a number.";
  }
  if (amount < 0) {
    return "Settlement can't be negative.";
  }
  if (amount > MAX_SETTLEMENT) {
    return "Check the settlement figure. If it's this high, speak to Oakwood.";
  }
  return undefined;
}

export function manualVehicleError(input: {
  year: string;
  make: string;
  model: string;
  fuelType: string;
  transmission: string;
}): string | undefined {
  if (!input.year.trim() || !input.make.trim() || !input.model.trim()) {
    return "Enter the year, make and model.";
  }
  const year = Number(input.year);
  if (!Number.isInteger(year) || year < 1980 || year > 2026) {
    return "Enter a valid year.";
  }
  if (!input.fuelType.trim() || !input.transmission.trim()) {
    return "Choose fuel type and transmission.";
  }
  return undefined;
}
