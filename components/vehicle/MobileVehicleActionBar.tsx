"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconPhone } from "@/components/ui/icons";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getUsedCarsUrl } from "@/config/routes";
import { getStockLocation } from "@/config/locations";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { toTelHref } from "@/lib/format/phone";

export function MobileVehicleActionBar() {
  const {
    vehicle,
    reservable,
    monthlyPayment,
    financeType,
    term,
    displayState,
  } = useVehicleDeal();
  const location = getStockLocation(vehicle.locationSlug);
  const telephone = location?.telephone;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const panel = document.getElementById("vdp-deal-panel");
    if (!panel) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-3">
        <div className="min-w-0 flex-1">
          <FinancialNumber
            value={formatPounds(monthlyPayment, { exact: true })}
            size="sm"
            className="text-[1.35rem] text-ink"
          />
          <p className="truncate text-[0.7rem] text-muted">
            {financeType === "pcp" ? "PCP" : "Hire Purchase"} · {formatTerm(term)}
            {displayState === "representative" ? "*" : ""}
          </p>
        </div>
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            variant="secondary"
            size="sm"
            aria-label="Call now"
            className="h-11 w-11 shrink-0 px-0!"
            onClick={() =>
              trackEvent(analyticsEvents.contactClicked, { channel: "call" })
            }
          >
            <IconPhone width={20} height={20} />
          </Button>
        ) : null}
        {reservable ? (
          <StartVehicleDealButton
            className="shrink-0"
            size="sm"
            label="Apply →"
            buttonClassName="btn-compact min-h-11 px-4!"
          />
        ) : (
          <Button href={getUsedCarsUrl()} size="sm" className="btn-compact shrink-0">
            Similar cars
          </Button>
        )}
      </div>
    </StickyActionBar>
  );
}
