import "@/styles/vdp-v2.css";

import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { ValuationEntryCard } from "@/components/valuation-entry/ValuationEntryCard";
import {
  ReservedVehicleNotice,
  SoldVehicleNotice,
  UnavailableVehicleNotice,
} from "@/components/vehicle/ReservationCTA";
import { VdpV2ActionGrid } from "@/components/vehicle/v2/VdpV2ActionGrid";
import { VdpV2Benefits } from "@/components/vehicle/v2/VdpV2Benefits";
import { VdpV2CashPriceBlock } from "@/components/vehicle/v2/VdpV2CashPriceBlock";
import { VdpV2Chrome } from "@/components/vehicle/v2/VdpV2Chrome";
import { VdpV2DetailsSections } from "@/components/vehicle/v2/VdpV2DetailsSections";
import { VdpV2FinancePreview } from "@/components/vehicle/v2/VdpV2FinancePreview";
import { VdpV2GalleryShell } from "@/components/vehicle/v2/VdpV2GalleryShell";
import { MobileVehicleActionBar } from "@/components/vehicle/MobileVehicleActionBar";
import { VdpV2SimilarVehicles } from "@/components/vehicle/v2/VdpV2SimilarVehicles";
import { VdpV2TestDriveSection } from "@/components/vehicle/v2/VdpV2TestDriveSection";
import { VdpV2TitleAndSpecs } from "@/components/vehicle/v2/VdpV2TitleAndSpecs";
import { VdpV2VehicleSummary } from "@/components/vehicle/v2/VdpV2VehicleSummary";
import { getEligibilityUrl, getUsedCarsUrl } from "@/config/routes";
import { DEAL_VDP_CARD_CTA } from "@/lib/deal/copy";
import { isReservable } from "@/lib/vehicles/sold";
import type { BreadcrumbItem } from "@/lib/seo";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";

function VdpV2PurchaseStack({ listingClosed }: { listingClosed: boolean }) {
  if (listingClosed) {
    return (
      <div className="vdp-v2__section lg:px-0">
        <div className="vdp-v2__card">
          <p className="text-[14px] leading-[21px] text-[#68778B]">
            This listing is kept available so you can still see the car and compare similar
            stock.
          </p>
          <ValuationEntryCard />
        </div>
      </div>
    );
  }

  return (
    <>
      <VdpV2ActionGrid />
      <VdpV2FinancePreview />
    </>
  );
}

export function VehicleDetailPageV2({
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

  return (
    <>
      <VdpV2Chrome />
      <Section className="vdp-v2 min-w-0 overflow-x-clip pt-4 pb-[calc(8.5rem+var(--oak-consent-offset,0px))] lg:pt-6 lg:pb-[var(--oak-section-y)]">
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

          <div className="mx-auto flex w-full min-w-0 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,26rem)]">
            <div className="min-w-0 overflow-x-clip">
              <div className="vdp-v2-mobile-stack lg:hidden">
                <VdpV2GalleryShell vehicle={vehicle} />
                <VdpV2TitleAndSpecs vehicle={vehicle} />
                <VdpV2CashPriceBlock />
                <VdpV2PurchaseStack listingClosed={listingClosed} />
                <VdpV2TestDriveSection vehicle={vehicle} />
              </div>

              <div className="hidden lg:block">
                <VdpV2GalleryShell vehicle={vehicle} />
              </div>

              <VdpV2DetailsSections vehicle={vehicle} />
              <VdpV2Benefits vehicle={vehicle} />
              <VdpV2SimilarVehicles vehicles={similar} />
            </div>

            <aside className="hidden min-w-0 space-y-7 lg:sticky lg:top-[calc(var(--oak-header-height)+1rem)] lg:block lg:max-h-[calc(100dvh-var(--oak-header-height)-2rem)] lg:overflow-y-auto lg:pb-2">
              <VdpV2VehicleSummary vehicle={vehicle} />
              <VdpV2PurchaseStack listingClosed={listingClosed} />
              <VdpV2TestDriveSection vehicle={vehicle} />
            </aside>
          </div>

          <section
            aria-labelledby="vdp-v2-final-cta-heading"
            className="vdp-v2__section mx-auto w-full min-w-0 rounded-xl bg-[#EEF6FD] p-5"
          >
            <h2
              id="vdp-v2-final-cta-heading"
              className="text-[20px] font-bold leading-[26px] text-[#102747]"
            >
              {reservable ? "Ready to take the next step?" : "Find another car"}
            </h2>
            <p className="mt-1.5 text-[14px] leading-[21px] text-[#34445B]">
              {reservable
                ? "Start with cash, finance, part exchange or a test drive — whichever suits you."
                : reserved
                  ? "This car is reserved for another customer. Browse similar stock or check your finance eligibility."
                  : "Browse the latest cars or check your finance eligibility first."}
            </p>
            <div className="mt-3">
              {reservable ? (
                <StartVehicleDealButton
                  className="w-full"
                  label={DEAL_VDP_CARD_CTA}
                  buttonClassName="min-h-12 w-full rounded-lg"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    href={getUsedCarsUrl()}
                    className="min-h-12 w-full rounded-lg"
                  >
                    Browse all cars
                  </Button>
                  <Button
                    href={getEligibilityUrl()}
                    className="min-h-12 w-full rounded-lg"
                    variant="secondary"
                  >
                    Check my eligibility
                  </Button>
                </div>
              )}
            </div>
          </section>
        </Container>
      </Section>
      <MobileVehicleActionBar />
    </>
  );
}
