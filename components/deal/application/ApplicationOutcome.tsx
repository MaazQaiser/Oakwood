"use client";

import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { Alert } from "@/components/ui/Alert";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { ApplicationDealSummary } from "@/components/deal/application/ApplicationDealSummary";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_APPLICATION_CONFIG } from "@/config/deal-application";
import { getDealUrl, supportRoutes } from "@/config/routes";
import { reservationConfig } from "@/config/reservation";
import {
  APP_CALLBACK_WITHIN,
  APP_NEXT_BACK_DEAL,
  APP_NEXT_CALL,
  APP_NEXT_TEST_DRIVE,
  APP_OUTCOME_DISCLAIMER,
  APP_RECEIVED_BODY,
  APP_RECEIVED_EYEBROW,
  APP_RECEIVED_TITLE,
  APP_REFERENCE,
} from "@/lib/deal/application/copy";
import { reservationAmountLabel } from "@/lib/reservation/format";
import type { DealApplicationResult } from "@/types/deal-application";

function OliviaCard() {
  const { initials, name, withinMinutes } = DEAL_APPLICATION_CONFIG.callbackContact;
  return (
    <div className="flex items-center gap-3 rounded-card bg-surface p-5 shadow-card">
      <span
        aria-hidden
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-body-sm font-semibold! text-primary"
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="text-label">{name}</p>
        <p className="text-caption text-muted">
          {APP_CALLBACK_WITHIN(name, withinMinutes)}
        </p>
      </div>
    </div>
  );
}

export function ApplicationOutcome({
  result,
}: {
  result: DealApplicationResult;
}) {
  const { dealId, vehicle, contact, navigateTo } = useDealBuilder();
  const telephone = contact.telephone;

  return (
    <div className="flex flex-1 flex-col gap-4 pb-8">
      <DealResultHero
        eyebrow={APP_RECEIVED_EYEBROW}
        title={APP_RECEIVED_TITLE}
        body={APP_RECEIVED_BODY}
      />
      <p className="text-caption text-muted">{APP_REFERENCE(result.reference)}</p>

      <Alert title={APP_OUTCOME_DISCLAIMER} tone="info" />

      <OliviaCard />
      <div className="lg:hidden">
        <ApplicationDealSummary />
      </div>

      <div className="space-y-3 rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">While you wait</p>
          <StartReservationButton
            stockId={vehicle.stockId}
            dealId={dealId}
            className="w-full"
            label={`Reserve this car for ${reservationAmountLabel(reservationConfig.amount)}`}
          />
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() =>
              navigateTo(`${getDealUrl(dealId, "reserve")}?panel=test-drive`)
            }
          >
            {APP_NEXT_TEST_DRIVE}
          </Button>
          {telephone ? (
            <Button href={`tel:${telephone.replace(/\s/g, "")}`} variant="tertiary" className="w-full">
              <PhoneCall className="h-4 w-4" aria-hidden />
              {APP_NEXT_CALL}
            </Button>
          ) : (
            <Button href={supportRoutes.bookingEnquiry} variant="tertiary" className="w-full">
              {APP_NEXT_CALL}
            </Button>
          )}
          <p className="text-caption text-muted">
            Reserve for {reservationAmountLabel(reservationConfig.amount)} while
            your advisor confirms terms.
          </p>
      </div>

      <Button
        type="button"
        variant="text"
        className="self-start"
        onClick={() => navigateTo(getDealUrl(dealId, "reserve"))}
      >
        {APP_NEXT_BACK_DEAL}
      </Button>
    </div>
  );
}
