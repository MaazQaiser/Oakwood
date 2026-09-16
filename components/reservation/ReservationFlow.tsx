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
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
              <div className="space-y-6">
                {model.vehicle ? (
                  <ReservationVehicleSummary
                    vehicle={model.vehicle}
                    amount={model.amount}
                    holdDurationDays={model.holdDurationDays}
                  />
                ) : null}
                {model.dealSnapshot ? (
                  <ReservationDealSummary
                    deal={model.dealSnapshot}
                    dealChanged={model.dealChanged}
                  />
                ) : null}
                <ReservationTerms
                  amount={model.amount}
                  holdDurationDays={model.holdDurationDays}
                />
              </div>
              <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
                <ReservationPayment model={model} />
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
