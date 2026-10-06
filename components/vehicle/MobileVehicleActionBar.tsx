"use client";

import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { IconHelp, IconPhone } from "@/components/ui/icons";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { CompareVehicleButton } from "@/components/vehicle/CompareVehicleButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getContactUrl, getUsedCarsUrl } from "@/config/routes";
import { getStockLocation } from "@/config/locations";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { toTelHref } from "@/lib/format/phone";

export function MobileVehicleActionBar() {
  const { vehicle, reservable } = useVehicleDeal();
  const location = getStockLocation(vehicle.locationSlug);
  const telephone = location?.telephone;

  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-2">
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            variant="icon"
            aria-label="Call Oakwood"
            className="border border-border"
            onClick={() =>
              trackEvent(analyticsEvents.contactClicked, { channel: "call" })
            }
          >
            <IconPhone />
          </Button>
        ) : null}
        <Button
          href={getContactUrl({ stockId: vehicle.stockId })}
          variant="icon"
          aria-label="Support"
          className="border border-border"
          onClick={() =>
            trackEvent(analyticsEvents.contactClicked, { channel: "support" })
          }
        >
          <IconHelp />
        </Button>
        <CompareVehicleButton
          vehicleName={`${vehicle.make} ${vehicle.model}`}
          stockId={vehicle.stockId}
          category={vehicle.category}
          className="border border-border"
        />
        {reservable ? (
          <StartReservationButton stockId={vehicle.stockId} className="min-w-0 flex-1" />
        ) : (
          <Button href={getUsedCarsUrl()} className="min-w-0 flex-1" variant="secondary">
            View similar cars
          </Button>
        )}
      </div>
    </StickyActionBar>
  );
}
