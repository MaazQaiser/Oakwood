import { getDealRecord } from "@/features/deal/store";
import { readDealCookieId } from "@/features/deal/session";
import { getPxSession } from "@/features/part-exchange/session";
import type { AftersalesVehicleContext } from "@/types/aftersales";

export async function getAftersalesVehicleContext(): Promise<AftersalesVehicleContext> {
  const px = await getPxSession();
  if (px?.snapshot.registration) {
    return {
      registration: px.snapshot.registration,
      vehicle: px.snapshot.vehicle
        ? { ...px.snapshot.vehicle, source: "session" }
        : undefined,
      source: "px",
    };
  }

  const dealId = await readDealCookieId();
  if (!dealId) {
    return {};
  }

  const deal = getDealRecord(dealId);
  if (!deal?.px?.registration) {
    return {};
  }

  return {
    registration: deal.px.registration,
    vehicle: deal.px.vehicle
      ? { ...deal.px.vehicle, source: "session" }
      : undefined,
    source: "deal",
  };
}
