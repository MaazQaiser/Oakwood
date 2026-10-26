"use client";

import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getUsedCarsUrl } from "@/config/routes";
import { getStockLocation } from "@/config/locations";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { toTelHref } from "@/lib/format/phone";

const actionClass =
  "btn-wrap h-full min-h-14 w-full px-2! py-2! text-center text-body-sm! leading-tight";

export function MobileVehicleActionBar() {
  const { vehicle, reservable } = useVehicleDeal();
  const location = getStockLocation(vehicle.locationSlug);
  const telephone = location?.telephone;

  return (
    <StickyActionBar>
      <div className="mx-auto grid max-w-[var(--oak-width-content)] grid-cols-3 items-stretch gap-2">
        {reservable ? (
          <StartVehicleDealButton
            className="min-w-0"
            size="sm"
            label="Build your deal"
            buttonClassName={actionClass}
          />
        ) : (
          <Button
            href={getUsedCarsUrl()}
            variant="primary"
            size="sm"
            className={actionClass}
          >
            View similar cars
          </Button>
        )}
        <Button
          href="#view-this-car"
          variant="outline"
          size="sm"
          className={actionClass}
          onClick={() =>
            trackEvent(analyticsEvents.contactClicked, { channel: "test-drive" })
          }
        >
          Book a test drive
        </Button>
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            variant="outline"
            size="sm"
            className={actionClass}
            onClick={() =>
              trackEvent(analyticsEvents.contactClicked, { channel: "call" })
            }
          >
            Phone call
          </Button>
        ) : (
          <Button
            href="#vehicle-location-heading"
            variant="outline"
            size="sm"
            className={actionClass}
          >
            Phone call
          </Button>
        )}
      </div>
    </StickyActionBar>
  );
}
