import { redirect } from "next/navigation";
import { getBoundDeal, hydrateDealsFromCookie } from "@/features/deal/session";
import {
  ensureDemoDeal,
  findLiveDealForStock,
  getDealRecord,
  isDealExpired,
} from "@/features/deal/store";
import { getDealUrl } from "@/config/routes";
import { mockDealId } from "@/lib/mock/data";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import type { DealStep } from "@/config/routes";

export type DealResolveResult =
  | { kind: "deal"; dealId: string }
  | { kind: "bootstrap"; stockId: string };

/**
 * Resolve a deal URL param to a live deal id.
 * Cookie writes are not allowed during RSC render, so unknown stock ids
 * return `bootstrap` for a client create+redirect instead of session expired.
 */
export async function resolveDealId(
  param: string,
  step: DealStep = "part-exchange",
): Promise<DealResolveResult> {
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
    const liveForStock = findLiveDealForStock(vehicle.stockId);
    if (liveForStock) {
      if (liveForStock.id !== param) {
        redirect(getDealUrl(liveForStock.id, step));
      }
      return { kind: "deal", dealId: liveForStock.id };
    }

    const bound = await getBoundDeal();
    if (bound && bound.vehicleStockId === vehicle.stockId) {
      if (bound.id !== param) {
        redirect(getDealUrl(bound.id, step));
      }
      return { kind: "deal", dealId: bound.id };
    }

    return { kind: "bootstrap", stockId: vehicle.stockId };
  }

  return { kind: "deal", dealId: param };
}
