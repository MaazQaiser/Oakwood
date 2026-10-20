import { Button } from "@/components/ui/Button";
import {
  getShowroomProfile,
  getStockLocation,
} from "@/config/locations";
import { getLocationUrl, supportRoutes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleLocation({ vehicle }: { vehicle: VehicleDetail }) {
  const location = getStockLocation(vehicle.locationSlug);
  const profile = getShowroomProfile(vehicle.locationSlug);
  const name = location?.name ?? vehicle.locationName;
  const isShowroom = location?.isShowroom ?? false;
  const telephone = location?.telephone ?? profile?.telephone;
  const salesHours =
    profile?.hoursStatus === "published"
      ? profile.openingHours.filter((row) => row.department === "sales")
      : [];
  const hoursLabel =
    salesHours.length > 0
      ? salesHours.map((row) => `${row.days} ${row.hours}`).join(" · ")
      : null;
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
    <section
      aria-labelledby="vehicle-location-heading"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[#002852] px-[var(--oak-page-x)] py-10 text-white md:py-12"
    >
      <div className="mx-auto w-full max-w-[var(--oak-width-wide)]">
        <h2 id="vehicle-location-heading" className="text-h3 text-white">
          {vehicle.availability === "available"
            ? `Available at Oakwood ${name}`
            : `Listed at Oakwood ${name}`}
        </h2>
        <p className="mt-2 text-body-sm text-white/80">
          {isShowroom
            ? `This car is at our ${name} showroom.`
            : `This car is listed at Oakwood ${name}.`}
        </p>
        <p className="mt-3 text-body-sm text-white">
          {[location?.postcode, location?.region].filter(Boolean).join(", ") ||
            name}
        </p>
        {telephone ? (
          <p className="mt-1 text-body-sm">
            <a
              href={toTelHref(telephone)}
              className="text-white underline-offset-4 hover:underline"
            >
              {telephone}
            </a>
          </p>
        ) : (
          <p className="mt-1 text-body-sm text-white/80">
            A telephone number is not listed for this location. Send a message and
            we will come back to you.
          </p>
        )}
        {hoursLabel ? (
          <p className="mt-1 text-caption text-white/70">
            Sales hours: {hoursLabel}
          </p>
        ) : (
          <p className="mt-1 text-caption text-white/70">
            Opening hours are not published for this location yet.
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button href={directions} variant="secondary" className="btn-compact">
            Get directions
          </Button>
          {isShowroom && location ? (
            <Button
              href={getLocationUrl(location.slug)}
              variant="tertiary"
              className="btn-compact border border-white/35! bg-transparent! text-white! hover:bg-white/10!"
            >
              View {name}
            </Button>
          ) : (
            <Button
              href={supportRoutes.bookingEnquiry}
              variant="tertiary"
              className="btn-compact border border-white/35! bg-transparent! text-white! hover:bg-white/10!"
            >
              Message us
            </Button>
          )}
          <Button
            href="#view-this-car"
            variant="text"
            className="text-white/80! hover:text-white!"
          >
            Book a test drive or viewing
          </Button>
        </div>
      </div>
    </section>
  );
}
