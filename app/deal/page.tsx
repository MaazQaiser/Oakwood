import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DealEntryClient } from "@/components/deal/DealEntryClient";
import { getBoundDeal } from "@/features/deal/session";
import { getDealUrl, routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { LAST_VIEWED_STOCK_COOKIE } from "@/lib/vehicles/last-viewed";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";

export const metadata = createPageMetadata({
  title: "Build your deal",
  path: routes.deal,
  description:
    "Choose a used car, then build your finance deal with deposit, term and part exchange.",
  indexable: false,
});

export default async function Page() {
  const deal = await getBoundDeal();
  if (deal) {
    redirect(getDealUrl(deal.id, "part-exchange"));
  }

  const jar = await cookies();
  const lastViewed = jar.get(LAST_VIEWED_STOCK_COOKIE)?.value;
  const stockId = lastViewed ? decodeURIComponent(lastViewed) : undefined;
  const vehicle = stockId ? findVehicleByStockId(stockId) : undefined;
  if (vehicle && isReservable(vehicle)) {
    redirect(getDealUrl(vehicle.stockId));
  }

  return <DealEntryClient />;
}
