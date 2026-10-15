import { hydrateDealsFromCookie } from "@/features/deal/session";
import {
  ensureDemoDeal,
  getDealRecord,
  isDealExpired,
} from "@/features/deal/store";
import { mockDealId } from "@/lib/mock/data";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";

export type DealResolveResult =
  | { kind: "deal"; dealId: string }
  | { kind: "bootstrap"; stockId: string };

/**
 * Resolve a deal URL param to a live deal id.
 * Cookie writes are not allowed during RSC render, so stock ids return
 * `bootstrap` for a client create+redirect. A stock id always starts a new
 * deal rather than resuming an earlier one on the same car.
 */
export async function resolveDealId(param: string): Promise<DealResolveResult> {
  if (param === mockDealId) {
    ensureDemoDeal();
    return { kind: "deal", dealId: mockDealId };
  }

  await hydrateDealsFromCookie();
  const existing = getDealRecord(param);
  if (existing && !isDealExpired(existing)) {
    return { kind: "deal", dealId: param };
  }

  const vehicle = findVehicleByStockId(param);
  if (vehicle && isReservable(vehicle)) {
    return { kind: "bootstrap", stockId: vehicle.stockId };
  }

  return { kind: "deal", dealId: param };
}
