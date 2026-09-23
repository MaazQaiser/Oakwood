"use client";

import { Button } from "@/components/ui/Button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { toTelHref } from "@/lib/format/phone";
import { supportRoutes } from "@/config/routes";
import type { ShowroomProfile } from "@/types/locations";

export function LocationHeroActions({
  profile,
  stockHref,
}: {
  profile: ShowroomProfile;
  stockHref: string;
}) {
  const directions = getDirectionsUrl(profile);
  const phone = profile.telephone;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        href={stockHref}
        size="lg"
        onClick={() =>
          trackEvent(analyticsEvents.locationStockClicked, {
            location: profile.slug,
          })
        }
      >
        View cars
      </Button>
      <Button
        href={directions}
        size="lg"
        onClick={() =>
          trackEvent(analyticsEvents.locationDirectionsClicked, {
            location: profile.slug,
          })
        }
      >
        Get directions
      </Button>
      {phone ? (
        <Button
          href={toTelHref(phone)}
          variant="text"
          size="lg"
          onClick={() =>
            trackEvent(analyticsEvents.locationPhoneClicked, {
              location: profile.slug,
            })
          }
        >
          Call {phone}
        </Button>
      ) : (
        <Button
          href={supportRoutes.contact}
          variant="text"
          size="lg"
          onClick={() =>
            trackEvent(analyticsEvents.locationContactClicked, {
              location: profile.slug,
            })
          }
        >
          Contact us
        </Button>
      )}
    </div>
  );
}
