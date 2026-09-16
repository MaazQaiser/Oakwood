import { LocationCard } from "@/components/locations/LocationCard";
import { Grid } from "@/components/layout/Container";
import { showroomProfiles } from "@/config/locations";
import { getBookingUrl, getLocationUrl } from "@/config/routes";
import { Button } from "@/components/ui/Button";
import type { AftersalesBookingType } from "@/config/routes";

export function AftersalesLocations({
  heading = "Locations",
  copy = "Oakwood aftersales is available at Bury and Chorley.",
  bookingType,
}: {
  heading?: string;
  copy?: string;
  bookingType?: AftersalesBookingType;
}) {
  return (
    <section aria-labelledby="aftersales-locations-heading">
      <h2 id="aftersales-locations-heading" className="text-h3">
        {heading}
      </h2>
      <p className="mt-2 text-body-sm text-muted">{copy}</p>
      <Grid columns="two" className="mt-6">
        {showroomProfiles.map((profile) => (
          <div key={profile.slug} className="flex flex-col gap-3">
            <LocationCard
              profile={profile}
              href={getLocationUrl(profile.slug)}
              headingLevel="h3"
            />
            {bookingType ? (
              <Button
                href={getBookingUrl({
                  type: bookingType,
                  source: bookingType,
                  location: profile.slug,
                })}
                variant="text"
                className="self-start px-0"
              >
                Book at {profile.name}
              </Button>
            ) : null}
          </div>
        ))}
      </Grid>
    </section>
  );
}
