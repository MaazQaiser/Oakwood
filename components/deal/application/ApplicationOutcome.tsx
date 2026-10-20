"use client";

import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { ApplicationDealSummary } from "@/components/deal/application/ApplicationDealSummary";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_APPLICATION_CONFIG } from "@/config/deal-application";
import { getDealUrl, supportRoutes } from "@/config/routes";
import { reservationConfig } from "@/config/reservation";
import {
  APP_CALLBACK_WITHIN,
  APP_COMPLIANCE_FLAG,
  APP_DECLINED_BODY,
  APP_DECLINED_EYEBROW,
  APP_DECLINED_TITLE,
  APP_NEXT_BACK_DEAL,
  APP_NEXT_CALL,
  APP_NEXT_TEST_DRIVE,
  APP_OUTCOME_DISCLAIMER,
  APP_PREAPPROVED_BODY,
  APP_PREAPPROVED_COMPLIANCE,
  APP_PREAPPROVED_EYEBROW,
  APP_PREAPPROVED_TITLE,
  APP_REFERRED_BODY,
  APP_REFERRED_EYEBROW,
  APP_REFERRED_TITLE,
} from "@/lib/deal/application/copy";
import { reservationAmountLabel } from "@/lib/reservation/format";
import type { DealApplicationResult } from "@/types/deal-application";

function OliviaCard() {
  const { name, initials, role, withinMinutes } =
    DEAL_APPLICATION_CONFIG.callbackContact;
  return (
    <div className="flex items-center gap-3 rounded-card bg-surface p-5 shadow-card">
      <span
        aria-hidden
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-body-sm font-semibold! text-primary"
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="text-label">
          {APP_CALLBACK_WITHIN(name, withinMinutes)}
        </p>
        <p className="text-caption text-muted">
          {role}. To confirm your application and talk through next steps.
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
  const { dealId, contact, navigateTo } = useDealBuilder();
  const telephone = contact.telephone;

  const copy =
    result.customerOutcome === "pre_approved"
      ? {
          eyebrow: APP_PREAPPROVED_EYEBROW,
          title: APP_PREAPPROVED_TITLE,
          body: APP_PREAPPROVED_BODY,
        }
      : result.customerOutcome === "referred"
        ? {
            eyebrow: APP_REFERRED_EYEBROW,
            title: APP_REFERRED_TITLE,
            body: APP_REFERRED_BODY,
          }
        : {
            eyebrow: APP_DECLINED_EYEBROW,
            title: APP_DECLINED_TITLE,
            body: APP_DECLINED_BODY,
          };

  return (
    <div className="flex flex-1 flex-col gap-4 pb-8">
      <DealResultHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        body={copy.body}
      >
        <div className="relative mt-5 rounded-[20px] bg-white/10 px-4 py-3.5 text-left">
          <p className="text-caption text-white/75">Application reference</p>
          <p className="mt-1 text-h5 tabular-number text-white">
            {result.reference}
          </p>
          {result.bankDetailsProvided ? (
            <p className="mt-1 text-caption text-white/75">
              Bank details were included with this application.
            </p>
          ) : null}
        </div>
      </DealResultHero>

      <Alert title={APP_OUTCOME_DISCLAIMER} tone="info" />
      {result.customerOutcome === "pre_approved" ? (
        <p className="text-caption text-muted">
          {APP_PREAPPROVED_COMPLIANCE} {APP_COMPLIANCE_FLAG}
        </p>
      ) : null}

      <OliviaCard />
      <ApplicationDealSummary />

      {result.customerOutcome === "pre_approved" ? (
        <div className="space-y-3 rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">While you wait</p>
          <Button
            type="button"
            className="w-full"
            onClick={() =>
              navigateTo(`${getDealUrl(dealId, "reserve")}?panel=reserve`)
            }
          >
            Reserve this car for {reservationAmountLabel(reservationConfig.amount)}
          </Button>
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
      ) : (
        <div className="space-y-3 rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">Human follow-up</p>
          <p className="text-body-sm text-muted">
            An Oakwood advisor will be in touch. You can also call us or request
            a callback.
          </p>
          {telephone ? (
            <Button href={`tel:${telephone.replace(/\s/g, "")}`} className="w-full">
              <PhoneCall className="h-4 w-4" aria-hidden />
              {APP_NEXT_CALL}
            </Button>
          ) : null}
          <Button href={supportRoutes.bookingEnquiry} variant="secondary" className="w-full">
            Request a callback
          </Button>
        </div>
      )}

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
