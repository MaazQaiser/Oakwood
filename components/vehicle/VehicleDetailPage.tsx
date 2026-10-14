import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
import { TrackLastViewedVehicle } from "@/components/vehicle/TrackLastViewedVehicle";
import {
  ReservedVehicleNotice,
  SoldVehicleNotice,
  UnavailableVehicleNotice,
} from "@/components/vehicle/ReservationCTA";
import { getUsedCarsUrl, getEligibilityUrl } from "@/config/routes";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { DEAL_VDP_CARD_CTA } from "@/lib/deal/copy";
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
      <TrackLastViewedVehicle stockId={vehicle.stockId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="min-w-0 pt-4 pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pt-6 lg:pb-[var(--oak-section-y)]">
        <Container width="wide">
          {breadcrumbs.length > 0 ? (
            <div className="mb-5">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : null}

          {sold ? (
            <div className="mb-5">
              <SoldVehicleNotice />
            </div>
          ) : reserved ? (
            <div className="mb-5">
              <ReservedVehicleNotice />
            </div>
          ) : unavailable ? (
            <div className="mb-5">
              <UnavailableVehicleNotice />
            </div>
          ) : null}

          <div className="vdp-hero">
            <VehicleGallery vehicle={vehicle} />
            <VehicleHeader vehicle={vehicle} />
            <div className="vdp-hero__aside">
              {listingClosed ? (
                <div className="vdp-hero__price rounded-[28px] bg-[#ECF3F8] p-5 md:p-6">
                  <p className="text-body text-muted">
                    This listing is kept available so you can still see the car and
                    compare similar stock.
                  </p>
                </div>
              ) : (
                <VehiclePrice />
              )}
              {listingClosed ? (
                <div className="vdp-hero__deal" />
              ) : (
                <VehicleDealColumn />
              )}
            </div>
            <VehicleSpecifications vehicle={vehicle} />
          </div>

          <div className="mt-14 space-y-14">
            <VehicleDocumentation vehicle={vehicle} />
            <VehicleVideo vehicle={vehicle} />
            <TrustBlock />
            <VehicleLocation vehicle={vehicle} />
            <SimilarVehicles vehicles={similar} />
            <section
              aria-labelledby="vdp-final-cta-heading"
              className="rounded-[32px] bg-[#ECF3F8] px-6 py-10 text-[#002852] md:px-12 md:py-12"
            >
              <h2 id="vdp-final-cta-heading" className="text-h3">
                {reservable ? "Ready to take the next step?" : "Find another car"}
              </h2>
              <p className="mt-2 max-w-2xl text-body-sm text-secondary">
                {reservable
                  ? "Build your deal for part exchange, budget, cover and reserve — or reserve this car straight away."
                  : reserved
                    ? "This car is reserved for another customer. Browse similar stock or check your finance eligibility."
                    : "Browse the latest cars or check your finance eligibility first."}
              </p>
              <div className="mt-5 hidden flex-wrap gap-3 lg:flex">
                {reservable ? (
                  <>
                    <StartVehicleDealButton label={DEAL_VDP_CARD_CTA} />
                    <StartReservationButton
                      stockId={vehicle.stockId}
                      variant="secondary"
                    />
                  </>
                ) : (
                  <>
                    <Button href={getUsedCarsUrl()}>Browse all cars</Button>
                    <Button href={getEligibilityUrl()} variant="secondary">
                      Check my eligibility
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-5 flex flex-col gap-3 lg:hidden">
                {reservable ? (
                  <>
                    <StartVehicleDealButton
                      className="w-full"
                      label={DEAL_VDP_CARD_CTA}
                    />
                    <StartReservationButton
                      stockId={vehicle.stockId}
                      className="w-full"
                      variant="secondary"
                    />
                  </>
                ) : (
                  <>
                    <Button href={getUsedCarsUrl()} className="w-full">
                      Browse all cars
                    </Button>
                    <Button href={getEligibilityUrl()} className="w-full" variant="secondary">
                      Check my eligibility
                    </Button>
                  </>
                )}
              </div>
            </section>
          </div>
        </Container>
      </Section>
      <MobileVehicleActionBar />
    </VehicleDealProvider>
  );
}
