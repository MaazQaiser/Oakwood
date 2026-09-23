"use client";

import { DealBuilderHeader } from "@/components/deal/DealBuilderHeader";
import { VehicleDealSummary } from "@/components/deal/VehicleDealSummary";
import { FinanceProfileContext } from "@/components/deal/FinanceProfileContext";
import { FinanceTypeSelector } from "@/components/deal/FinanceTypeSelector";
import { DepositControl } from "@/components/deal/DepositControl";
import { TermSelector } from "@/components/deal/TermSelector";
import { AnnualMileageSelector } from "@/components/deal/AnnualMileageSelector";
import { PartExchangeSection } from "@/components/deal/PartExchangeSection";
import { OptionalProducts } from "@/components/deal/OptionalProducts";
import { DealSummary } from "@/components/deal/DealSummary";
import { DealBuilderMobileCTA } from "@/components/deal/DealBuilderMobileCTA";
import { DealFailureState } from "@/components/deal/DealFailureState";
import { DealBuilderProvider, useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { Container, Section } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import { DEAL_SOFT_SEARCH, DEAL_UPDATING } from "@/lib/deal/copy";
import type { DealPageModel } from "@/types/deal";

function DealBuilderInner() {
  const { phase } = useDealBuilder();

  return (
    <>
      <JourneyChrome />
      <DealBuilderHeader />
      <Section className="pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-[var(--oak-section-y)]">
        <Container width="wide">
          {phase === "VEHICLE_UNAVAILABLE" ? (
            <div className="mt-6">
              <DealFailureState kind="vehicle" />
            </div>
          ) : null}
          {phase === "CALCULATION_ERROR" ? (
            <div className="mt-6">
              <DealFailureState kind="calculation" />
            </div>
          ) : null}
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start">
            <div className="flex min-w-0 flex-col gap-6">
              <VehicleDealSummary />
              <FinanceProfileContext />
              <section
                aria-labelledby="finance-config-heading"
                className="rounded-lg border border-border bg-surface p-4 md:p-5"
              >
                <h2 id="finance-config-heading" className="text-h3">
                  Finance
                </h2>
                <div className="mt-5 space-y-6">
                  <FinanceTypeSelector />
                  <DepositControl />
                  <TermSelector />
                  <AnnualMileageSelector />
                </div>
              </section>
              <PartExchangeSection />
              <OptionalProducts />
              <div className="lg:hidden">
                <DealSummary />
              </div>
              <p className="text-caption text-muted">{DEAL_SOFT_SEARCH}</p>
              <p className="sr-only" aria-live="polite">
                {phase === "RECALCULATING" ? DEAL_UPDATING : ""}
              </p>
            </div>
            <div className="hidden lg:block">
              <DealSummary sticky />
            </div>
          </div>
        </Container>
      </Section>
      <DealBuilderMobileCTA />
    </>
  );
}

export function DealBuilder({ model }: { model: DealPageModel }) {
  if (model.status !== "ready" || !model.vehicle || !model.draft) {
    return (
      <Section>
        <Container width="narrow">
          <DealFailureState kind="session" />
        </Container>
      </Section>
    );
  }

  return (
    <DealBuilderProvider model={model}>
      <DealBuilderInner />
    </DealBuilderProvider>
  );
}
