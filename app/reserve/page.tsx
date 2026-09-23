import { redirect } from "next/navigation";
import { JourneyStart } from "@/components/journeys/JourneyStart";
import { getBoundReservation } from "@/features/reservation/session";
import { reservationCopy } from "@/lib/reservation/copy";
import { getReserveUrl, getUsedCarsUrl, routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

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

  return (
    <JourneyStart
      title={reservationCopy.entryHeading}
      body={reservationCopy.entryBody}
      primary={{ href: getUsedCarsUrl(), label: "Browse cars" }}
      secondary={{ href: routes.deal, label: "Build my deal" }}
    />
  );
}
