"use client";

import { ReservationIntro } from "@/components/reservation/ReservationIntro";
import { ReservationPayment } from "@/components/reservation/ReservationPayment";
import { ReservationConfirmation } from "@/components/reservation/ReservationConfirmation";
import { PaymentError } from "@/components/reservation/PaymentError";
import { ReservationStatus } from "@/components/reservation/ReservationStatus";
import { RefundRequest } from "@/components/reservation/RefundRequest";
import { RefundConfirmation } from "@/components/reservation/RefundConfirmation";
import { ReservationVehicleSummary } from "@/components/reservation/ReservationVehicleSummary";
import { ReservationDealSummary } from "@/components/reservation/ReservationDealSummary";
import { ReservationTerms } from "@/components/reservation/ReservationTerms";
import { ReservationUnavailable } from "@/components/reservation/ReservationUnavailable";
import { Container, Section } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import type { ReservationPageModel } from "@/features/reservation/load";
import type { ReservationStep } from "@/config/routes";
import { payBelowCopy, reservationCopy } from "@/lib/reservation/copy";
import { formatNumber, formatPounds, formatTerm } from "@/lib/format/money";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

function ReservationPin({ model }: { model: ReservationPageModel }) {
  const vehicle = model.vehicle;
  if (!vehicle) {
    return null;
  }
  const deal = model.dealSnapshot;
  const rows = deal
    ? [
        { label: "Finance", value: deal.financeType === "pcp" ? "PCP" : "HP" },
        { label: "Term", value: formatTerm(deal.term) },
        ...(deal.annualMileage
          ? [
              {
                label: "Annual mileage",
                value: `${formatNumber(deal.annualMileage)} miles`,
              },
            ]
          : []),
        { label: "Reservation", value: reservationAmountLabel(model.amount) },
      ]
    : [];

  return (
    <div className="rounded-xl bg-[linear-gradient(145deg,var(--oak-navy-deep)_0%,var(--oak-navy)_46%,#0a4d86_100%)] px-4 py-4 text-white shadow-card">
      <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
        {deal ? "Your deal" : "Your reservation"}
      </p>
      <p className="mt-1 text-label">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </p>
      <p className="mt-2">
        <span className="financial-number text-white">
          {deal
            ? formatPounds(deal.monthlyPayment)
            : reservationAmountLabel(model.amount)}
        </span>
        {deal ? <span className="text-body-sm text-white/70">/mo</span> : null}
      </p>
      {rows.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-3 text-caption"
            >
              <span className="text-white/70">{row.label}</span>
              <span className="shrink-0 tabular-number font-semibold! text-white">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-caption text-white/70">
        Refundable · held for {formatHoldPeriod(model.holdDurationDays)} after
        payment is confirmed
      </p>
    </div>
  );
}

export function ReservationFlow({
  model,
  step,
}: {
  model: ReservationPageModel;
  step: ReservationStep;
}) {
  return (
    <>
      <JourneyChrome />
      <ReservationFlowBody model={model} step={step} />
    </>
  );
}

function ReservationFlowBody({
  model,
  step,
}: {
  model: ReservationPageModel;
  step: ReservationStep;
}) {
  if (step === "payment") {
    return (
      <Section className="pb-[var(--oak-section-y)]">
        <Container width="wide">
          {model.phase === "UNAVAILABLE" || model.phase === "SOLD" ? (
            <ReservationUnavailable
              model={model}
              variant={model.phase === "SOLD" ? "sold" : "unavailable"}
            />
          ) : (
            <div className="space-y-6">
              {model.vehicle ? (
                <div className="sticky top-[var(--oak-header-height)] z-10 -mx-4 bg-page-tint/95 px-4 py-2 backdrop-blur lg:hidden">
                  <ReservationPin model={model} />
                </div>
              ) : null}
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
                <div className="rounded-card bg-surface p-5 shadow-card sm:p-7">
                  <ReservationPayment model={model} />
                </div>
                <aside className="space-y-6 lg:sticky lg:top-[calc(var(--oak-header-height)+1.5rem)]">
                  {model.vehicle ? (
                    <div className="hidden lg:block">
                      <ReservationPin model={model} />
                    </div>
                  ) : null}
                  {model.vehicle ? (
                    <ReservationVehicleSummary
                      vehicle={model.vehicle}
                      amount={model.amount}
                      holdDurationDays={model.holdDurationDays}
                    />
                  ) : null}
                  {model.dealSnapshot ? (
                    <div className={model.dealChanged ? undefined : "lg:hidden"}>
                      <ReservationDealSummary
                        deal={model.dealSnapshot}
                        dealChanged={model.dealChanged}
                      />
                    </div>
                  ) : null}
                  <ReservationTerms
                    amount={model.amount}
                    holdDurationDays={model.holdDurationDays}
                  />
                </aside>
              </div>
            </div>
          )}
        </Container>
      </Section>
    );
  }

  if (step === "success") {
    return (
      <Section>
        <Container width="narrow">
          <ReservationConfirmation model={model} />
        </Container>
      </Section>
    );
  }

  if (step === "failed") {
    return (
      <Section>
        <Container width="narrow">
          <PaymentError model={model} />
        </Container>
      </Section>
    );
  }

  if (step === "manage") {
    return (
      <Section>
        <Container width="narrow">
          <ReservationStatus model={model} />
        </Container>
      </Section>
    );
  }

  if (step === "refund") {
    const showForm = model.phase === "RESERVED";
    return (
      <Section>
        <Container width="narrow">
          {showForm ? (
            <RefundRequest model={model} />
          ) : (
            <RefundConfirmation model={model} />
          )}
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container width="wide">
        <ReservationIntro model={model} />
        <p className="sr-only">{reservationCopy.fullyRefundable}</p>
        <p className="sr-only">{payBelowCopy(model.holdDurationDays)}</p>
      </Container>
    </Section>
  );
}
