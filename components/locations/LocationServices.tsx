"use client";

import { ServiceCard } from "@/components/aftersales/ServiceCard";
import { Grid } from "@/components/layout/Container";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { servicesForLocation } from "@/lib/locations/content";
import type { ShowroomProfile } from "@/types/locations";

export function LocationServices({ profile }: { profile: ShowroomProfile }) {
  const services = servicesForLocation(profile.services, profile.slug);

  return (
    <section aria-labelledby="location-services-heading">
      <h2 id="location-services-heading" className="text-h3">
        Services
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Services available through Oakwood at {profile.name}.
      </p>
      <Grid columns="cards" className="mt-6">
        {services.map((item) => (
          <div key={item.key} onClickCapture={() =>
            trackEvent(analyticsEvents.locationServiceClicked, {
              location: profile.slug,
              service: item.key,
            })
          }>
            <ServiceCard
              title={item.title}
              copy={item.copy}
              href={item.href}
              cta={item.cta}
              headingLevel="h3"
            />
          </div>
        ))}
      </Grid>
    </section>
  );
}
