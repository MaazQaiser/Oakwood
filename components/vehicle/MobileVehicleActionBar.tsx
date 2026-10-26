"use client";

import { Button } from "@/components/ui/Button";
import { IconPhone } from "@/components/ui/icons";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getUsedCarsUrl } from "@/config/routes";
import { getStockLocation } from "@/config/locations";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { toTelHref } from "@/lib/format/phone";

const actionClass =
  "btn-wrap h-full min-h-14 min-w-0 px-2! py-2! text-center text-[0.8125rem]! leading-tight";

export function MobileVehicleActionBar() {
  const { vehicle, reservable } = useVehicleDeal();
  const location = getStockLocation(vehicle.locationSlug);
  const telephone = location?.telephone;

  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] items-stretch gap-2">
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            variant="outline"
            size="sm"
            aria-label="Phone call"
            className="h-full min-h-14 w-14 shrink-0 px-0!"
            onClick={() =>
              trackEvent(analyticsEvents.contactClicked, { channel: "call" })
            }
          >
            <IconPhone className="h-[30px]! w-[30px]! shrink-0" width={30} height={30} />
          </Button>
        ) : (
          <Button
            href="#vehicle-location-heading"
            variant="outline"
            size="sm"
            aria-label="Phone call"
            className="h-full min-h-14 w-14 shrink-0 px-0!"
          >
            <IconPhone className="h-[30px]! w-[30px]! shrink-0" width={30} height={30} />
          </Button>
        )}
        <Button
          href="#view-this-car"
          variant="outline"
          size="sm"
          className={`${actionClass} flex-1 basis-0`}
          onClick={() =>
            trackEvent(analyticsEvents.contactClicked, { channel: "test-drive" })
          }
        >
          Book a test drive
        </Button>
        {reservable ? (
          <StartVehicleDealButton
            className="min-w-0 flex-1 basis-0"
            size="sm"
            label="Build your deal"
            buttonClassName={actionClass}
          />
        ) : (
          <Button
            href={getUsedCarsUrl()}
            variant="primary"
            size="sm"
            className={`${actionClass} flex-1 basis-0`}
          >
            View similar cars
          </Button>
        )}
      </div>
    </StickyActionBar>
  );
}
