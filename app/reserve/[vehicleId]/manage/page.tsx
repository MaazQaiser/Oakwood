import { ReservationFlow } from "@/components/reservation/ReservationFlow";
import { loadReservationPage } from "@/features/reservation/load";
import { getReserveUrl } from "@/config/routes";
import { mockVehicleId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

const step = "manage" as const;

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
    title: "Your reservation",
    path: getReserveUrl(vehicleId, step),
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

  return <ReservationFlow model={model} step={step} />;
}
