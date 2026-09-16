"use client";

import { Button } from "@/components/ui/Button";
import { getBookingUrl, supportRoutes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { toTelHref } from "@/lib/format/phone";

export function LocationContactCta({
  locationSlug,
  telephone,
}: {
  locationSlug: string;
  telephone?: string;
}) {
  return (
    <section aria-labelledby="location-contact-heading">
      <h2 id="location-contact-heading" className="text-h3">
        Contact this showroom
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Call, request a callback, or book a service. If we cannot take your call,
        leave a message and Oakwood will come back to you.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            onClick={() =>
              trackEvent(analyticsEvents.locationPhoneClicked, {
                location: locationSlug,
              })
            }
          >
            Call {telephone}
          </Button>
        ) : null}
        <Button
          href={supportRoutes.contact}
          variant={telephone ? "secondary" : "primary"}
          onClick={() =>
            trackEvent(analyticsEvents.locationContactClicked, {
              location: locationSlug,
            })
          }
        >
          Contact us
        </Button>
        <Button
          href={getBookingUrl({
            type: "service",
            source: "aftersales",
            location: locationSlug,
          })}
          variant="text"
          onClick={() =>
            trackEvent(analyticsEvents.locationServiceClicked, {
              location: locationSlug,
              service: "servicing",
            })
          }
        >
          Book a service
        </Button>
      </div>
    </section>
  );
}
