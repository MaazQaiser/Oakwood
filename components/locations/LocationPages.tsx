import type { ReactNode } from "react";
import { Container, Section, Stack } from "@/components/layout/Container";
import { PageBanner, PageBannerScope } from "@/components/layout/PageBanner";
import { LocationContactCta } from "@/components/locations/LocationContactCta";
import { LocationDetails } from "@/components/locations/LocationDetails";
import { LocationHeroActions } from "@/components/locations/LocationHero";
import { LocationRelatedLinks } from "@/components/locations/LocationRelatedLinks";
import { LocationsHub, type HubShowroom } from "@/components/locations/LocationsHub";
import { LocationServices } from "@/components/locations/LocationServices";
import { LocationStock } from "@/components/locations/LocationStock";
import { DirectionsCTA } from "@/components/locations/DirectionsCTA";
import { OpeningHours } from "@/components/locations/OpeningHours";
import { ReviewSummary } from "@/components/trust/ReviewSummary";
import { TrustViewTracker } from "@/components/trust/TrustViewTracker";
import { Button } from "@/components/ui/Button";
import { formatShowroomAddress, showroomProfiles } from "@/config/locations";
import {
  getContactUrl,
  getLocationStockUrl,
  getLocationUrl,
  getVehicleUrl,
  routes,
} from "@/config/routes";
import { MAX_ADVANCE, pricePackage } from "@/lib/finance/interest-free";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { listLocationStock } from "@/lib/locations/stock";
import { locationStockImage } from "@/lib/media/stock";
import { getReviewFeed } from "@/lib/reviews/provider";
import { createBreadcrumbs, createLocalBusinessJsonLd } from "@/lib/seo";
import type { LocationUrlVariant } from "@/config/routes";
import type { ShowroomProfile } from "@/types/locations";
import type { Vehicle } from "@/types/vehicle";

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
    <PageBannerScope breadcrumbs={createBreadcrumbs(breadcrumbs)}>{children}</PageBannerScope>
  );
}

function isInterestFreeReady(vehicle: Vehicle): boolean {
  return (vehicle.cashPrice + pricePackage(vehicle).total) / 2 <= MAX_ADVANCE;
}

function toHubShowroom(profile: ShowroomProfile): HubShowroom {
  const vehicles = listLocationStock(profile.slug).filter(
    (vehicle) => vehicle.category === "car",
  );
  const stock = [...vehicles]
    .sort((a, b) => a.monthlyPayment - b.monthlyPayment)
    .slice(0, 6)
    .map((vehicle) => ({
      stockId: vehicle.stockId,
      href: getVehicleUrl(vehicle),
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      image: vehicle.image ?? "/images/vehicle-placeholder.svg",
      transmission: vehicle.transmission,
      mileage: vehicle.mileage,
      monthly: vehicle.monthlyPayment,
      interestFree: isInterestFreeReady(vehicle),
    }));

  return {
    slug: profile.slug as HubShowroom["slug"],
    name: profile.name,
    href: getLocationUrl(profile.slug),
    address: formatShowroomAddress(profile),
    telephone: profile.telephone,
    photo: locationStockImage(profile.slug),
    directionsHref: getDirectionsUrl(profile),
    bookHref: getContactUrl({ topic: `visit-${profile.slug}` }),
    stockHref: getLocationStockUrl(profile.slug),
    stockCount: vehicles.length,
    stock,
  };
}

export function LocationsHubPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Locations", href: routes.locations },
  ]);

  return (
    <>
      <TrustViewTracker page="hub" />
      <LocationsHub breadcrumbs={breadcrumbs} showrooms={showroomProfiles.map(toHubShowroom)} />
    </>
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
      <PageBanner
        title={profile.h1}
        description={
          <>
            <p>{profile.descriptor}</p>
            {profile.postcode ? <p className="mt-2 text-[#002852]">{profile.postcode}</p> : null}
            {profile.telephone ? <p className="text-[#002852]">{profile.telephone}</p> : null}
          </>
        }
      >
        <LocationHeroActions profile={profile} stockHref={stockHref} />
      </PageBanner>
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
