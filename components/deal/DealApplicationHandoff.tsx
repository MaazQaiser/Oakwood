"use client";

import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Container, Section } from "@/components/layout/Container";
import { Alert } from "@/components/ui/Alert";
import { calculateDeal } from "@/lib/deal/calculate";
import { DEAL_PROVIDER_CONFIG } from "@/lib/deal/provider-config";
import {
  DEAL_APPLICATION_BOUNDARY,
  DEAL_ILLUSTRATION_PERSONALISED,
} from "@/lib/deal/copy";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { getDealUrl, getEligibilityUrl, routes, supportRoutes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { DealPageModel } from "@/types/deal";

export function DealApplicationHandoff({ model }: { model: DealPageModel }) {
  if (model.status !== "ready" || !model.vehicle || !model.draft) {
    return (
      <Section>
        <Container width="narrow">
          <Alert title="This deal session has expired." tone="warning">
            Return to the vehicle to build a new deal.
          </Alert>
        </Container>
      </Section>
    );
  }

  const calculation = calculateDeal(
    {
      vehiclePrice: model.vehicle.cashPrice,
      vehicleYear: model.vehicle.year,
      vehicleMileage: model.vehicle.mileage,
      representativeMonthly: model.vehicle.representativeMonthly,
      cashDeposit: model.draft.cashDeposit,
      pxValue: model.draft.px?.value,
      pxSettlement: model.draft.px?.settlement,
      financeType: model.draft.financeType,
      term: model.draft.term,
      annualMileage: model.draft.annualMileage,
      productIds: model.draft.productIds,
    },
    model.finance.hasProfile ? model.finance.profile : undefined,
    DEAL_PROVIDER_CONFIG,
  );

  const canStart =
    model.finance.hasProfile &&
    !model.finance.expired &&
    model.vehicle.availability === "available" &&
    calculation.valid;

  return (
    <Section>
      <Container width="narrow">
        <p>
          <Button href={getDealUrl(model.dealId)} variant="text" className="px-0">
            Back to deal
          </Button>
        </p>
        <h1 className="mt-4 text-h2">Continue to your finance application</h1>
        <p className="mt-3 text-body text-muted">
          You are leaving the deal builder. This next step is the regulated
          finance application. The figures below are still an indicative
          illustration.
        </p>
        <Alert title="This is not a credit decision" tone="info">
          {DEAL_APPLICATION_BOUNDARY} Nothing on the previous screen is a
          guaranteed rate or approval.
        </Alert>
        <dl className="mt-6 space-y-2 text-body-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Vehicle</dt>
            <dd>
              {model.vehicle.year} {model.vehicle.make} {model.vehicle.model}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Estimated monthly payment</dt>
            <dd>
              <FinancialNumber
                value={formatPounds(calculation.monthlyPayment)}
                suffix="/month"
                size="sm"
              />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Total amount payable</dt>
            <dd>
              <FinancialNumber value={formatPounds(calculation.totalPayable)} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Term</dt>
            <dd>{formatTerm(model.draft.term)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-caption text-muted">
          {DEAL_ILLUSTRATION_PERSONALISED}
        </p>
        <p className="mt-3">
          <a
            href={routes.statusDisclosure}
            className="text-caption text-primary underline-offset-4 hover:underline"
          >
            Status disclosure
          </a>
          {" · "}
          <a
            href={routes.vehiclePurchaseTerms}
            className="text-caption text-primary underline-offset-4 hover:underline"
          >
            Vehicle purchase terms
          </a>
          {" · "}
          <a
            href={routes.deliveryTerms}
            className="text-caption text-primary underline-offset-4 hover:underline"
          >
            Delivery terms
          </a>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {canStart ? (
            <Button
              onClick={() => trackEvent(analyticsEvents.applicationStarted)}
            >
              Start regulated application
            </Button>
          ) : !model.finance.hasProfile ? (
            <Button href={getEligibilityUrl()}>Check my eligibility</Button>
          ) : (
            <Button href={getDealUrl(model.dealId)}>Return to deal</Button>
          )}
          <Button href={supportRoutes.bookingEnquiry} variant="secondary">
            Contact Oakwood
          </Button>
        </div>
        {canStart ? (
          <p className="mt-4 text-caption text-muted">
            The application provider is not connected yet. Oakwood can take your
            application when you get in touch.
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
