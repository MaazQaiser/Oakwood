import type { PxEquityType } from "@/types/part-exchange";

export function calculatePxEquity(
  estimatedValue: number,
  settlementFigure?: number,
): {
  equity: number;
  shortfall: number;
  equityType: PxEquityType;
} {
  const settlement = Math.max(0, Math.round(settlementFigure ?? 0));
  const value = Math.max(0, Math.round(estimatedValue));
  const difference = value - settlement;

  if (difference > 0) {
    return { equity: difference, shortfall: 0, equityType: "positive" };
  }
  if (difference < 0) {
    return { equity: 0, shortfall: -difference, equityType: "negative" };
  }
  return { equity: 0, shortfall: 0, equityType: "none" };
}
