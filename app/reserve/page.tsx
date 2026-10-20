import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JourneyStart } from "@/components/journeys/JourneyStart";
import { getBoundReservation } from "@/features/reservation/session";
import { reservationCopy } from "@/lib/reservation/copy";
import { getReserveUrl, getUsedCarsUrl, routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { LAST_VIEWED_STOCK_COOKIE } from "@/lib/vehicles/last-viewed";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";

export const metadata = createPageMetadata({
  title: "Reserve a car",
  path: routes.reserve,
  description:
    "Reserve a used car online with Oakwood. Terms are shown before you pay.",
  indexable: false,
});

export default async function Page() {
  const reservation = await getBoundReservation();
  if (reservation?.vehicleStockId) {
    redirect(getReserveUrl(reservation.vehicleStockId));
  }

  const jar = await cookies();
  const lastViewed = jar.get(LAST_VIEWED_STOCK_COOKIE)?.value;
  const stockId = lastViewed ? decodeURIComponent(lastViewed) : undefined;
  const vehicle = stockId ? findVehicleByStockId(stockId) : undefined;
  if (vehicle && isReservable(vehicle)) {
    redirect(getReserveUrl(vehicle.stockId));
  }

  return (
    <JourneyStart
      title={reservationCopy.entryHeading}
      body="Choose a car to reserve. You can hold it while you complete the purchase."
      primary={{ href: getUsedCarsUrl(), label: "Browse cars" }}
    />
  );
}
