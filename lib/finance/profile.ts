import type { FinanceProfile } from "@/types/finance";

/**
 * Finance calculations are not implemented in this phase.
 * This module holds the structural contract only.
 */
export function createEmptyFinanceProfile(): FinanceProfile | null {
  return null;
}

/**
 * Finance profile values must never be serialised into URLs,
 * query parameters, or browser storage.
 */
export function assertFinanceProfileNotInUrl(url: string): boolean {
  const blocked = [
    "apr",
    "maximumAdvance",
    "approved-amount",
    "decision",
    "decisionIdentifier",
  ];

  return !blocked.some((key) =>
    url.toLowerCase().includes(`${key.toLowerCase()}=`),
  );
}
