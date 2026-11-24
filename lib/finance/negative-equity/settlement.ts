import {
  ESTIMATE_APR,
  ESTIMATE_DEFERMENT,
} from "@/lib/finance/negative-equity/constants";
import { ceilToNearest, monthlyRate } from "@/lib/finance/negative-equity/math";

/**
 * Early settlement ≈ [PV(remaining payments) + PV(balloon)] × 1.0125,
 * discounted at the assumed rate, rounded up to £50.
 *
 * Must overstate, never understate. A lower assumed rate produces a higher
 * present value — keep that bias if you change ESTIMATE_APR.
 */
export function estimateSettlement(
  monthlyPayment: number,
  paymentsRemaining: number,
  balloon = 0,
): number | null {
  if (!(monthlyPayment > 0 && paymentsRemaining > 0)) return null;
  const i = monthlyRate(ESTIMATE_APR);
  let pv =
    (monthlyPayment * (1 - Math.pow(1 + i, -paymentsRemaining))) / i;
  if (balloon > 0) {
    pv += balloon / Math.pow(1 + i, paymentsRemaining);
  }
  return ceilToNearest(pv * ESTIMATE_DEFERMENT, 50);
}
