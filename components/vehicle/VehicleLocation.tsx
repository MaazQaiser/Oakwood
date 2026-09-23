import { Button } from "@/components/ui/Button";
import { getStockLocation } from "@/config/locations";
import { getLocationUrl, getBookingUrl, supportRoutes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleLocation({ vehicle }: { vehicle: VehicleDetail }) {
  const location = getStockLocation(vehicle.locationSlug);
  const name = location?.name ?? vehicle.locationName;
  const isShowroom = location?.isShowroom ?? false;
  const telephone = location?.telephone;
  const query = [
    "Oakwood Motor Company",
    name,
    location?.postcode,
    location?.region,
  ]
    .filter(Boolean)
    .join(" ");
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section aria-labelledby="vehicle-location-heading">
      <h2 id="vehicle-location-heading" className="text-h3">
        {vehicle.availability === "available"
          ? `Available at Oakwood ${name}`
          : `Listed at Oakwood ${name}`}
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        {isShowroom
          ? `This car is at our ${name} showroom.`
          : `This car is listed at Oakwood ${name}.`}
      </p>
      <p className="mt-3 text-body-sm">
        {[location?.postcode, location?.region].filter(Boolean).join(", ") || name}
      </p>
      {telephone ? (
        <p className="mt-1 text-body-sm">
          <a href={toTelHref(telephone)} className="text-primary">
            {telephone}
          </a>
        </p>
      ) : (
        <p className="mt-1 text-body-sm text-muted">
          A telephone number is not listed for this location. Send a message and we
          will come back to you.
        </p>
      )}
      <p className="mt-1 text-caption text-muted">
        Opening hours are not published in this preview, so we do not mark the
        showroom as open or closed here.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href={directions}>
          Get directions
        </Button>
        {isShowroom && location ? (
          <Button href={getLocationUrl(location.slug)} variant="text">
            View {name}
          </Button>
        ) : (
          <Button href={supportRoutes.bookingEnquiry} variant="text">
            Message us
          </Button>
        )}
        <Button
          href={getBookingUrl({
            source: "vdp",
            location: isShowroom ? location?.slug : undefined,
          })}
          variant="text"
        >
          Book a service
        </Button>
      </div>
    </section>
  );
}
