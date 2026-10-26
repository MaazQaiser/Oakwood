"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Skeleton } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { DealEntrySteps } from "@/components/deal/DealEntrySteps";
import { ValuationEntryCard } from "@/components/valuation-entry/ValuationEntryCard";
import { PartExchange } from "@/components/vehicle/PartExchange";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import { getEligibilityUrl, getSearchUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  DEAL_VDP_CARD_BODY,
  DEAL_VDP_CARD_CTA,
  DEAL_VDP_CARD_TITLE,
} from "@/lib/deal/copy";
import { formatPounds, formatTerm } from "@/lib/format/money";

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
  } = useVehicleDeal();
  const financeUnavailable = displayState === "missing";

  return (
    <div className="vdp-hero__price rounded-[28px] bg-[#ECF3F8] p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="sr-only">Cash price</p>
          {displayState === "loading" ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className="text-primary">
              <FinancialNumber value={formatPounds(cashPrice)} size="lg" />
            </p>
          )}
          <div className="mt-1">
            {financeUnavailable ? (
              <p className="text-body-sm text-muted">Not available yet</p>
            ) : displayState === "loading" ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <p className="text-ink">
                <FinancialNumber value={formatPounds(monthlyPayment)} size="sm" />
                <span className="text-body-sm text-muted">
                  {displayState === "representative" ? "/month*" : "/month"}
                </span>
              </p>
            )}
          </div>
        </div>
        <a
          href={financeUnavailable ? getEligibilityUrl() : "#finance-this-car"}
          className="shrink-0 border-b border-current pb-0.5 text-sm font-semibold text-primary"
          onClick={() =>
            trackEvent(analyticsEvents.financeCtaClicked, { action: "apply" })
          }
        >
          Apply for finance
        </a>
      </div>

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

      <div className="mt-4">
        <PartExchange />
      </div>

      <ValuationEntryCard />

      {reservable ? (
        <div className="mt-5 rounded-lg border border-border bg-page p-4">
          <p className="text-label">{DEAL_VDP_CARD_TITLE}</p>
          <p className="mt-1 text-body-sm text-muted">{DEAL_VDP_CARD_BODY}</p>
          <DealEntrySteps />
          <StartVehicleDealButton
            className="mt-3 w-full"
            label={DEAL_VDP_CARD_CTA}
          />
        </div>
      ) : null}

      <div className="mt-4 hidden flex-col gap-2 lg:flex">
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
    </div>
  );
}
