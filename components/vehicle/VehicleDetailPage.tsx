import { Container, Section } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { TrustBlock } from "@/components/trust/TrustBlock";
import { VehicleDealProvider } from "@/components/vehicle/VehicleDealProvider";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehiclePrice } from "@/components/vehicle/VehiclePrice";
import { VehicleDealColumn } from "@/components/vehicle/VehicleDealColumn";
import { VehicleSpecifications } from "@/components/vehicle/VehicleSpecifications";
import { VehicleDocumentation } from "@/components/vehicle/VehicleDocumentation";
import { VehicleVideo } from "@/components/vehicle/VehicleVideo";
import { VehicleLocation } from "@/components/vehicle/VehicleLocation";
import { SimilarVehicles } from "@/components/vehicle/SimilarVehicles";
import { MobileVehicleActionBar } from "@/components/vehicle/MobileVehicleActionBar";
import { VehicleViewTracker } from "@/components/vehicle/VehicleViewTracker";
import {
  ReservedVehicleNotice,
  SoldVehicleNotice,
  UnavailableVehicleNotice,
} from "@/components/vehicle/ReservationCTA";
import { getUsedCarsUrl, getEligibilityUrl } from "@/config/routes";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { isReservable } from "@/lib/vehicles/sold";
import { createVehicleJsonLd } from "@/lib/seo/json-ld";
import type { BreadcrumbItem } from "@/lib/seo";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleDetailPage({
  vehicle,
  similar,
  breadcrumbs,
}: {
  vehicle: VehicleDetail;
  similar: Vehicle[];
  breadcrumbs: BreadcrumbItem[];
}) {
  const sold = vehicle.availability === "sold";
  const reserved = vehicle.availability === "reserved";
  const unavailable = vehicle.availability === "expired";
  const reservable = isReservable(vehicle);
  const listingClosed = sold || unavailable;
  const jsonLd = createVehicleJsonLd(vehicle, breadcrumbs);

  return (
    <VehicleDealProvider vehicle={vehicle}>
      <VehicleViewTracker stockId={vehicle.stockId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="min-w-0 pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-[var(--oak-section-y)]">
        <Container width="wide">
          <Breadcrumbs items={breadcrumbs} />

          {sold ? (
            <div className="mt-6">
              <SoldVehicleNotice />
            </div>
          ) : reserved ? (
            <div className="mt-6">
              <ReservedVehicleNotice />
            </div>
          ) : unavailable ? (
            <div className="mt-6">
              <UnavailableVehicleNotice />
            </div>
          ) : null}

          <div className="vdp-hero mt-6">
            <VehicleGallery vehicle={vehicle} />
            <VehicleHeader vehicle={vehicle} />
            {listingClosed ? (
              <div className="vdp-hero__price">
                <p className="text-body text-muted">
                  This listing is kept available so you can still see the car and
                  compare similar stock.
                </p>
              </div>
            ) : (
              <VehiclePrice />
            )}
            <VehicleSpecifications vehicle={vehicle} />
            {listingClosed ? <div className="vdp-hero__deal" /> : <VehicleDealColumn />}
          </div>

          <div className="mt-12 space-y-12">
            <VehicleDocumentation vehicle={vehicle} />
            <VehicleVideo vehicle={vehicle} />
            <div className="grid gap-10 lg:grid-cols-2">
              <TrustBlock />
              <VehicleLocation vehicle={vehicle} />
            </div>
            <SimilarVehicles vehicles={similar} />
            <section aria-labelledby="vdp-final-cta-heading" className="rounded-lg border border-border bg-surface p-5">
              <h2 id="vdp-final-cta-heading" className="text-h3">
                {reservable ? "Ready to take the next step?" : "Find another car"}
              </h2>
              <p className="mt-2 text-body-sm text-muted">
                {reservable
                  ? "Reserve this car, or build your deal first if you want to configure finance."
                  : reserved
                    ? "This car is reserved for another customer. Browse similar stock or check your finance eligibility."
                    : "Browse the latest cars or check your finance eligibility first."}
              </p>
              <div className="mt-4 hidden flex-wrap gap-3 lg:flex">
                {reservable ? (
                  <>
                    <StartReservationButton stockId={vehicle.stockId} />
                    <StartVehicleDealButton variant="secondary" />
                  </>
                ) : (
                  <Button href={getUsedCarsUrl()}>Browse all cars</Button>
                )}
                <Button href={getEligibilityUrl()} variant={reservable ? "tertiary" : "secondary"}>
                  Check my eligibility
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-3 lg:hidden">
                {reservable ? (
                  <StartVehicleDealButton variant="secondary" className="w-full" />
                ) : (
                  <Button href={getUsedCarsUrl()}>Browse all cars</Button>
                )}
                <Button href={getEligibilityUrl()} variant="tertiary" className="w-full">
                  Check my eligibility
                </Button>
              </div>
            </section>
          </div>
        </Container>
      </Section>
      <MobileVehicleActionBar />
    </VehicleDealProvider>
  );
}
