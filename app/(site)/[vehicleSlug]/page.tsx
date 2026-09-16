import { notFound, redirect } from "next/navigation";
import { VehicleDetailPage } from "@/components/vehicle/VehicleDetailPage";
import { getVehicleUrl } from "@/config/routes";
import { mockVehicles } from "@/lib/mock/data";
import { getVehicleDetail } from "@/lib/mock/vehicle-detail";
import { getVehicleBreadcrumbs } from "@/lib/vehicles/breadcrumbs";
import { findVehicleBySlug } from "@/lib/vehicles/query";
import { getSimilarVehicles } from "@/lib/vehicles/similar";
import {
  getSoldRedirectUrl,
  shouldIndexVehicle,
  shouldRedirectSoldVehicle,
} from "@/lib/vehicles/sold";
import { isVehicleSlug } from "@/lib/vehicles/slug";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return mockVehicles.map((vehicle) => ({ vehicleSlug: vehicle.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vehicleSlug: string }>;
}) {
  const { vehicleSlug } = await params;
  const vehicle = findVehicleBySlug(vehicleSlug);

  if (!vehicle) {
    return createPageMetadata({
      title: "Vehicle",
      path: getVehicleUrl(vehicleSlug),
      indexable: false,
    });
  }

  const title = `Used ${vehicle.make} ${vehicle.model} for Sale`;
  const description = [
    `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.derivative ? ` ${vehicle.derivative}` : ""} for sale at Oakwood ${vehicle.locationName}.`,
    `${formatNumber(vehicle.mileage)} miles, ${vehicle.fuelType}, ${vehicle.transmission}.`,
    `Cash price ${formatPounds(vehicle.cashPrice)}.`,
    vehicle.availability === "available"
      ? `Representative monthly payment from ${formatPounds(vehicle.monthlyPayment)}.`
      : "This vehicle is no longer available.",
  ].join(" ");

  return createPageMetadata({
    title,
    description,
    path: getVehicleUrl(vehicle),
    indexable: shouldIndexVehicle(vehicle),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ vehicleSlug: string }>;
}) {
  const { vehicleSlug } = await params;

  if (!isVehicleSlug(vehicleSlug)) {
    notFound();
  }

  const vehicle = findVehicleBySlug(vehicleSlug);

  if (!vehicle) {
    notFound();
  }

  if (shouldRedirectSoldVehicle(vehicle)) {
    redirect(getSoldRedirectUrl(vehicle));
  }

  const detail = getVehicleDetail(vehicle);

  return (
    <VehicleDetailPage
      vehicle={detail}
      similar={getSimilarVehicles(vehicle)}
      breadcrumbs={getVehicleBreadcrumbs(vehicle)}
    />
  );
}
