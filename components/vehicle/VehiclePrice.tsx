"use client";

import {
  CashPrice,
  MonthlyPayment,
} from "@/components/finance/FinancePrimitives";
import { Button } from "@/components/ui/Button";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import { getEligibilityUrl, getSearchUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { formatPounds } from "@/lib/format/money";

function scrollToFinance() {
  document.getElementById("finance-this-car")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function VehiclePrice() {
  const {
    displayState,
    monthlyPayment,
    cashPrice,
    gapAmount,
    financeType,
    vehicle,
    reservable,
  } = useVehicleDeal();

  return (
    <div className="vdp-hero__price">
      <MonthlyPayment
        amount={monthlyPayment}
        state={displayState}
        gapAmount={gapAmount}
      />
      {displayState === "personalised" ? (
        <p className="mt-2 text-caption text-muted">
          Based on your finance profile. <StatusDisclosureLink />
        </p>
      ) : null}
      {displayState === "representative" ? (
        <p className="mt-2 text-caption text-muted">
          {financeType === "pcp" ? "PCP" : "HP"} finance. Representative finance example.{" "}
          <StatusDisclosureLink />
        </p>
      ) : null}
      {displayState === "ineligible" && gapAmount !== undefined ? (
        <p className="mt-2 text-caption text-warning">
          An additional {formatPounds(gapAmount)} deposit could bring this vehicle within
          your current profile.
        </p>
      ) : null}
      <div className="mt-4">
        <CashPrice amount={cashPrice} state={displayState} />
      </div>
      <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
        {reservable ? <StartReservationButton stockId={vehicle.stockId} /> : null}
        {displayState === "representative" ? (
          <Button
            href={getEligibilityUrl()}
            onClick={() =>
              trackEvent(analyticsEvents.financeCtaClicked, { action: "eligibility" })
            }
          >
            Check my eligibility
          </Button>
        ) : null}
        {reservable && (displayState === "personalised" || displayState === "ineligible") ? (
          <>
            <StartVehicleDealButton variant="secondary" />
            {displayState === "personalised" ? (
              <Button variant="secondary" onClick={scrollToFinance}>
                Change deposit
              </Button>
            ) : null}
          </>
        ) : null}
        {displayState === "ineligible" ? (
          <>
            <Button variant="secondary" onClick={scrollToFinance}>
              Adjust deposit
            </Button>
            <Button
              href={getSearchUrl({ affordable: 1 })}
              variant="text"
            >
              View affordable cars
            </Button>
          </>
        ) : null}
      </div>
      {displayState === "representative" ? (
        <p className="mt-3 lg:hidden">
          <Button
            href={getEligibilityUrl()}
            variant="text"
            className="px-0"
            onClick={() =>
              trackEvent(analyticsEvents.financeCtaClicked, { action: "eligibility" })
            }
          >
            Check my eligibility
          </Button>
        </p>
      ) : null}
    </div>
  );
}
