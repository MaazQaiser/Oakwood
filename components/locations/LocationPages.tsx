import type { ReactNode } from "react";
import { Container, Grid, Section, Stack } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AftersalesHero } from "@/components/aftersales/AftersalesHero";
import { LocationCard } from "@/components/locations/LocationCard";
import { LocationContactCta } from "@/components/locations/LocationContactCta";
import { LocationDetails } from "@/components/locations/LocationDetails";
import { LocationHeroActions } from "@/components/locations/LocationHero";
import { LocationRelatedLinks } from "@/components/locations/LocationRelatedLinks";
import { LocationServices } from "@/components/locations/LocationServices";
import { LocationStock } from "@/components/locations/LocationStock";
import { DirectionsCTA } from "@/components/locations/DirectionsCTA";
import { OpeningHours } from "@/components/locations/OpeningHours";
import { ReviewSummary } from "@/components/trust/ReviewSummary";
import { TrustViewTracker } from "@/components/trust/TrustViewTracker";
import { Button } from "@/components/ui/Button";
import { showroomProfiles } from "@/config/locations";
import { getLocationStockUrl, getLocationUrl, routes } from "@/config/routes";
import { listLocationStock } from "@/lib/locations/stock";
import { getReviewFeed } from "@/lib/reviews/provider";
import { createBreadcrumbs, createLocalBusinessJsonLd } from "@/lib/seo";
import type { LocationUrlVariant } from "@/config/routes";
import type { ShowroomProfile } from "@/types/locations";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function PageShell({
  breadcrumbs,
  children,
}: {
  breadcrumbs: { label: string; href: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <Section className="pb-0">
        <Container>
          <Breadcrumbs items={createBreadcrumbs(breadcrumbs)} />
        </Container>
      </Section>
      {children}
    </>
  );
}

export function LocationsHubPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "Locations", href: routes.locations },
      ]}
    >
      <TrustViewTracker page="hub" />
      <AftersalesHero
        eyebrow="Locations"
        title="Find your nearest Oakwood"
        description="Oakwood has showrooms in Bury and Chorley. Choose a location to see cars, services and how to visit."
        primary={{ href: routes.usedCars, label: "View cars" }}
        secondary={{ href: routes.contact, label: "Contact us" }}
      />
      <Section>
        <Container>
          <Grid columns="two">
            {showroomProfiles.map((profile) => (
              <LocationCard
                key={profile.slug}
                profile={profile}
                href={getLocationUrl(profile.slug)}
              />
            ))}
          </Grid>
          <div className="mt-12">
            <LocationRelatedLinks current={routes.locations} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function LocationShowroomPage({
  profile,
  variant = "canonical",
}: {
  profile: ShowroomProfile;
  variant?: LocationUrlVariant;
}) {
  const path = getLocationUrl(profile.slug, variant);
  const stockHref = getLocationStockUrl(profile.slug);
  const vehicles = listLocationStock(profile.slug);
  const reviews = getReviewFeed(profile.slug);

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "Locations", href: routes.locations },
        { label: profile.name, href: path },
      ]}
    >
      <TrustViewTracker page="location" location={profile.slug} />
      <JsonLd data={createLocalBusinessJsonLd(profile, path)} />
      <section className="border-b border-border bg-surface">
        <Container className="py-10 md:py-16">
          <p className="text-caption text-primary">{profile.eyebrow}</p>
          <h1 className="mt-2 text-display">{profile.h1}</h1>
          <p className="mt-3 max-w-2xl text-body text-muted">{profile.descriptor}</p>
          {profile.postcode ? (
            <p className="mt-3 text-body-sm">{profile.postcode}</p>
          ) : null}
          {profile.telephone ? (
            <p className="mt-1 text-body-sm">{profile.telephone}</p>
          ) : null}
          <LocationHeroActions profile={profile} stockHref={stockHref} />
        </Container>
      </section>
      <Section>
        <Container>
          <Stack gap="8">
            <LocationDetails profile={profile} />
            <LocationStock
              locationSlug={profile.slug}
              locationName={profile.name}
              vehicles={vehicles}
            />
            <LocationServices profile={profile} />
            <OpeningHours profile={profile} />
            <DirectionsCTA location={profile} />
            <section aria-labelledby="location-reviews-heading">
              <h2 id="location-reviews-heading" className="text-h3">
                Reviews
              </h2>
              <div className="mt-4">
                <ReviewSummary feed={reviews} />
              </div>
              <p className="mt-4">
                <Button href={routes.ourOnlineReviews} variant="text">
                  All Oakwood reviews
                </Button>
              </p>
            </section>
            <LocationContactCta
              locationSlug={profile.slug}
              telephone={profile.telephone}
            />
            <LocationRelatedLinks current={path} />
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}
