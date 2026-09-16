import { redirect } from "next/navigation";
import { ReservationFlow } from "@/components/reservation/ReservationFlow";
import { loadReservationPage } from "@/features/reservation/load";
import { getReserveUrl } from "@/config/routes";
import { reservationStepRedirect } from "@/lib/reservation/redirect";
import { mockVehicleId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return [{ vehicleId: mockVehicleId }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;

  return createPageMetadata({
    title: "Reserve this car",
    path: getReserveUrl(vehicleId),
    indexable: false,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  const model = await loadReservationPage(vehicleId);
  const next = reservationStepRedirect(vehicleId, "reserve", model);
  if (next) {
    redirect(next);
  }

  return <ReservationFlow model={model} step="reserve" />;
}
