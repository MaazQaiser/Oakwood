import { Container, Section } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleCertBadges } from "@/components/vehicle/VehicleCertBadges";
import { VehicleDealPanel } from "@/components/vehicle/deal-panel/VehicleDealPanel";
import { VehicleTalkCards } from "@/components/vehicle/VehicleTalkCards";
import { VehicleWhatYouGet } from "@/components/vehicle/VehicleWhatYouGet";
import { VehicleSpecifications } from "@/components/vehicle/VehicleSpecifications";
import { VehicleAbout } from "@/components/vehicle/VehicleAbout";
import { VehicleWhyOakwood } from "@/components/vehicle/VehicleWhyOakwood";
import { VehicleDocumentation } from "@/components/vehicle/VehicleDocumentation";
import { VehicleLocation } from "@/components/vehicle/VehicleLocation";
import { SimilarVehicles } from "@/components/vehicle/SimilarVehicles";
import { MobileVehicleActionBar } from "@/components/vehicle/MobileVehicleActionBar";
import {
  ReservedVehicleNotice,
  SoldVehicleNotice,
  UnavailableVehicleNotice,
} from "@/components/vehicle/ReservationCTA";
import type { BreadcrumbItem } from "@/lib/seo";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleDetailPageV1({
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
  const closed = sold || unavailable;

  return (
    <>
      <Section className="min-w-0 pt-4 pb-[calc(8.5rem+var(--oak-consent-offset,0px))] lg:pt-6 lg:pb-[var(--oak-section-y)]">
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

          <div className="vdp-listing">
            <div className="vdp-listing__main min-w-0">
              <VehicleGallery vehicle={vehicle} />
              <div className="mt-4">
                <VehicleCertBadges vehicle={vehicle} />
              </div>
              <div className="mt-5">
                <VehicleHeader vehicle={vehicle} />
              </div>

              <div className="mt-6 lg:hidden">
                <VehicleDealPanel listingClosed={closed} />
              </div>

              <div className="mt-8 space-y-12">
                <VehicleTalkCards vehicle={vehicle} />
                <VehicleWhatYouGet vehicle={vehicle} />
                <VehicleSpecifications vehicle={vehicle} />
                <VehicleAbout vehicle={vehicle} />
                <VehicleWhyOakwood />
                <VehicleDocumentation vehicle={vehicle} />
                <VehicleLocation vehicle={vehicle} />
                <SimilarVehicles vehicles={similar} />
              </div>
            </div>

            <aside className="vdp-listing__aside hidden min-w-0 lg:block">
              <div className="vdp-listing__aside-sticky">
                <VehicleDealPanel listingClosed={closed} />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
      {!closed ? <MobileVehicleActionBar /> : null}
    </>
  );
}
