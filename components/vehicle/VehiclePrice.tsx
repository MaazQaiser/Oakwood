"use client";

import {
  FinancialNumber,
  MonthlyPayment,
} from "@/components/finance/FinancePrimitives";
import { Skeleton } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { DealEntrySteps } from "@/components/deal/DealEntrySteps";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { VehiclePriceToggle } from "@/components/vehicle/VehiclePriceToggle";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import { getEligibilityUrl, getSearchUrl, routes } from "@/config/routes";
import { reservationConfig } from "@/config/reservation";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  DEAL_VDP_CARD_BODY,
  DEAL_VDP_CARD_TITLE,
} from "@/lib/deal/copy";
import { formatPounds, formatTerm } from "@/lib/format/money";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { reservationCopy } from "@/lib/reservation/copy";
import { getVehicleIdentity } from "@/lib/vehicles/labels";

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
    deposit,
    extraDeposit,
    term,
    vehicle,
    reservable,
    priceView,
    setPriceView,
  } = useVehicleDeal();
  const { title } = getVehicleIdentity(vehicle);
  const amount = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod(reservationConfig.holdDurationDays);
  const showMonthly = priceView === "monthly";
  const financeUnavailable = displayState === "missing";

  return (
    <div className="vdp-hero__price rounded-[28px] bg-[#ECF3F8] p-5 md:p-6">
      <p className="text-caption font-semibold tracking-[0.02em] text-muted uppercase">
        {title}
      </p>

      <div className="mt-4">
        <VehiclePriceToggle value={priceView} onChange={setPriceView} />
      </div>

      <div className="mt-5">
        {showMonthly ? (
          financeUnavailable ? (
            <div>
              <p className="text-caption text-muted">Monthly payment</p>
              <p className="mt-1 text-h3 text-muted">Not available yet</p>
              <p className="mt-2 text-caption text-muted">
                A monthly figure is not available for this car. Check eligibility
                or continue with the cash price.
              </p>
            </div>
          ) : (
            <MonthlyPayment
              amount={monthlyPayment}
              state={displayState}
              gapAmount={gapAmount}
              term={term}
              financeType={financeType}
              showDisclaimer={false}
            />
          )
        ) : displayState === "loading" ? (
          <div>
            <p className="text-caption text-muted">Cash price</p>
            <Skeleton className="mt-2 h-8 w-32" />
          </div>
        ) : (
          <div>
            <p className="text-caption text-muted">Cash price</p>
            <p className="mt-1 text-primary">
              <FinancialNumber value={formatPounds(cashPrice)} size="lg" />
            </p>
          </div>
        )}
      </div>

      {showMonthly && !financeUnavailable ? (
        <p className="mt-2 text-body-sm text-muted">
          <FinancialNumber
            value={formatPounds(cashPrice)}
            size="sm"
            className="text-muted"
          />{" "}
          cash price
        </p>
      ) : !showMonthly && !financeUnavailable ? (
        <p className="mt-2 text-body-sm text-muted">
          From{" "}
          <FinancialNumber
            value={formatPounds(monthlyPayment)}
            size="sm"
            className="text-muted"
          />
          {displayState === "representative" ? "/month*" : "/month"}
        </p>
      ) : null}

      {displayState === "personalised" ? (
        <p className="mt-2 text-caption text-muted">
          Based on your finance profile. <StatusDisclosureLink />
        </p>
      ) : null}
      {displayState === "representative" && !financeUnavailable ? (
        <p className="mt-2 text-caption text-muted">
          {financeType === "pcp" ? "PCP" : "HP"} · {formatTerm(term)} ·{" "}
          {formatPounds(deposit + extraDeposit)} deposit. Representative example.{" "}
          <StatusDisclosureLink />
        </p>
      ) : null}
      {displayState === "ineligible" && gapAmount !== undefined ? (
        <p className="mt-2 text-caption text-warning">
          An additional {formatPounds(gapAmount)} deposit could bring this vehicle
          within your current profile.
        </p>
      ) : null}

      {reservable ? (
        <div className="mt-5 rounded-lg border border-border bg-page p-4">
          <p className="text-label">{DEAL_VDP_CARD_TITLE}</p>
          <p className="mt-1 text-body-sm text-muted">{DEAL_VDP_CARD_BODY}</p>
          <DealEntrySteps />
          <StartVehicleDealButton className="mt-3 w-full" label="Start building" />
        </div>
      ) : null}

      <div className="mt-4 hidden flex-col gap-2 lg:flex">
        {reservable ? (
          <StartReservationButton
            stockId={vehicle.stockId}
            className="w-full"
            variant="secondary"
          />
        ) : null}
        {displayState === "representative" ? (
          <Button
            href={getEligibilityUrl()}
            variant="text"
            className="w-full"
            onClick={() =>
              trackEvent(analyticsEvents.financeCtaClicked, { action: "eligibility" })
            }
          >
            Check my eligibility
          </Button>
        ) : null}
        {displayState === "personalised" || displayState === "ineligible" ? (
          <Button variant="text" className="px-0" onClick={scrollToFinance}>
            {displayState === "ineligible" ? "Adjust deposit" : "Change deposit or term"}
          </Button>
        ) : null}
        {displayState === "ineligible" ? (
          <Button href={getSearchUrl({ affordable: 1 })} variant="text" className="px-0">
            View affordable cars
          </Button>
        ) : null}
      </div>

      {reservable ? (
        <p className="mt-4 text-caption text-muted">
          Reserve for {amount}. {reservationCopy.fullyRefundable}. Holds the
          vehicle for {hold}.{" "}
          <a
            href={routes.reservationTerms}
            className="text-primary underline-offset-4 hover:underline"
          >
            Reservation terms
          </a>
          {" · "}
          <a
            href={routes.cancellationRefund}
            className="text-primary underline-offset-4 hover:underline"
          >
            Cancellation and refund
          </a>
        </p>
      ) : null}
    </div>
  );
}
