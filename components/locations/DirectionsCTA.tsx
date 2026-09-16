"use client";

import { Button } from "@/components/ui/Button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDirectionsUrl } from "@/lib/locations/directions";
import type { Location } from "@/types/vehicle";

export function DirectionsCTA({
  location,
}: {
  location: Location;
}) {
  const href = getDirectionsUrl(location);

  return (
    <section aria-labelledby="directions-heading">
      <h2 id="directions-heading" className="text-h3">
        Directions
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Open directions to Oakwood {location.name} in Google Maps using the
        address we have published.
      </p>
      <p className="mt-4">
        <Button
          href={href}
          variant="secondary"
          onClick={() =>
            trackEvent(analyticsEvents.locationDirectionsClicked, {
              location: location.slug,
            })
          }
        >
          Get directions
        </Button>
      </p>
    </section>
  );
}
