import { BookingFlow } from "@/components/aftersales/BookingFlow";
import { getAftersalesVehicleContext } from "@/features/aftersales/context";
import {
  routes,
  type AftersalesBookingSource,
  type AftersalesBookingType,
} from "@/config/routes";
import { getShowroom } from "@/config/locations";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Book a service",
  path: routes.booking,
  description: "Request a service or MOT appointment with Oakwood Motor Company.",
  indexable: false,
});

const SOURCES: AftersalesBookingSource[] = [
  "aftersales",
  "service",
  "mot",
  "vdp",
  "px",
  "deal",
  "enquiry",
];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const typeValue = first(params.type);
  const sourceValue = first(params.source);
  const locationValue = first(params.location);
  const serviceType: AftersalesBookingType | undefined =
    typeValue === "service" || typeValue === "mot" ? typeValue : undefined;
  const source: AftersalesBookingSource = SOURCES.includes(
    sourceValue as AftersalesBookingSource,
  )
    ? (sourceValue as AftersalesBookingSource)
    : "aftersales";
  const locationSlug = locationValue && getShowroom(locationValue)
    ? locationValue
    : undefined;
  const context = await getAftersalesVehicleContext();

  return (
    <BookingFlow
      source={source}
      serviceType={serviceType}
      locationSlug={locationSlug}
      context={context}
    />
  );
}
