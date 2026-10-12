"use client";

import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { IconPhone } from "@/components/ui/icons";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getUsedCarsUrl } from "@/config/routes";
import { getStockLocation } from "@/config/locations";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { formatPounds } from "@/lib/format/money";
import { toTelHref } from "@/lib/format/phone";

export function MobileVehicleActionBar() {
  const {
    vehicle,
    reservable,
    priceView,
    cashPrice,
    monthlyPayment,
    displayState,
  } = useVehicleDeal();
  const location = getStockLocation(vehicle.locationSlug);
  const telephone = location?.telephone;
  const showMonthly = priceView === "monthly" && displayState !== "missing";

  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-3">
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            variant="icon"
            aria-label="Call Oakwood"
            className="shrink-0 border border-border"
            onClick={() =>
              trackEvent(analyticsEvents.contactClicked, { channel: "call" })
            }
          >
            <IconPhone />
          </Button>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-caption text-muted">
            {showMonthly ? "Monthly payment" : "Cash price"}
          </p>
          <p className="truncate text-ink">
            {showMonthly ? (
              <FinancialNumber
                value={formatPounds(monthlyPayment)}
                suffix={displayState === "representative" ? "/mo*" : "/mo"}
                size="sm"
              />
            ) : (
              <FinancialNumber value={formatPounds(cashPrice)} size="sm" />
            )}
          </p>
        </div>
        {reservable ? (
          <StartReservationButton
            stockId={vehicle.stockId}
            className="btn-compact min-w-0 shrink-0"
          />
        ) : (
          <Button href={getUsedCarsUrl()} className="btn-compact min-w-0 shrink-0" variant="secondary">
            View similar cars
          </Button>
        )}
      </div>
    </StickyActionBar>
  );
}
