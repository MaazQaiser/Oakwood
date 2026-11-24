import {
  CASH_BUDGET_BANDS,
  MONTHLY_BUDGET_BANDS,
  USED_CARS_RESERVED_SEGMENTS,
} from "@/config/routes";

const reserved = new Set<string>([
  ...USED_CARS_RESERVED_SEGMENTS,
  ...MONTHLY_BUDGET_BANDS,
  ...CASH_BUDGET_BANDS,
]);

const cashBandPattern = /^(under|over)-\d+$/;

export function isReservedUsedCarsMakeSlug(slug: string): boolean {
  const normalised = slug.trim().toLowerCase();
  if (!normalised) {
    return false;
  }
  return reserved.has(normalised) || cashBandPattern.test(normalised);
}