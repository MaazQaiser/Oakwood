"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DealFailureState } from "@/components/deal/DealFailureState";
import {
  DealBuilderProvider,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { DealPinnedVehicle } from "@/components/deal/wizard/DealPinnedVehicle";
import { DealProgress } from "@/components/deal/wizard/DealProgress";
import { DealMonthlyBar } from "@/components/deal/wizard/DealMonthlyBar";
import { Container, Section } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import type { DealStep } from "@/config/routes";
import { getDealUrl, getVehicleUrl } from "@/config/routes";
import { DEAL_STEP_META } from "@/lib/deal/steps";
import { DEAL_SUPPORTING } from "@/lib/deal/copy";
import type { DealPageModel } from "@/types/deal";
import { Button } from "@/components/ui/Button";

function WizardInner({
  step,
  children,
}: {
  step: DealStep;
  children: ReactNode;
}) {
  const { vehicle, phase } = useDealBuilder();
  const meta = DEAL_STEP_META[step];

  return (
    <>
      <JourneyChrome />
      <Section className="pb-[calc(10.5rem+var(--oak-consent-offset,0px))] lg:pb-[calc(8rem+var(--oak-consent-offset,0px))]">
        <Container width="narrow">
          <div className="sticky top-[var(--oak-header-offset,4.5rem)] z-10 -mx-1 space-y-3 bg-page/95 px-1 py-3 backdrop-blur">
            <DealPinnedVehicle />
            <DealProgress step={step} />
          </div>

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

          <article className="mt-4 rounded-lg border border-border bg-surface p-4 md:p-6">
            <h1 className="text-h2">{meta.title}</h1>
            <p className="mt-1 text-body-sm text-muted">{DEAL_SUPPORTING}</p>
            <div className="mt-5">{children}</div>
          </article>

          <p className="mt-4">
            <Button
              href={getVehicleUrl(vehicle.slug)}
              variant="text"
              className="px-0"
            >
              Back to vehicle
            </Button>
          </p>
        </Container>
      </Section>
      <StickyActionBar hiddenOnDesktop={false}>
        <div className="mx-auto max-w-[var(--oak-width-narrow,40rem)]">
          <DealMonthlyBar />
        </div>
      </StickyActionBar>
    </>
  );
}

export function DealWizardShell({
  model,
  step,
  children,
}: {
  model: DealPageModel;
  step: DealStep;
  children: ReactNode;
}) {
  if (model.status !== "ready" || !model.vehicle || !model.draft) {
    return (
      <>
        <JourneyChrome />
        <Section>
          <Container width="narrow">
            <DealFailureState
              kind={model.status === "expired" ? "session" : "vehicle"}
            />
          </Container>
        </Section>
      </>
    );
  }

  return (
    <DealBuilderProvider model={model}>
      <WizardInner step={step}>{children}</WizardInner>
    </DealBuilderProvider>
  );
}

export function useDealStepNavigation(step: DealStep) {
  const router = useRouter();
  const { dealId, markStepComplete } = useDealBuilder();

  return {
    goNext: (next: DealStep) => {
      markStepComplete(step);
      router.push(getDealUrl(dealId, next));
    },
    goTo: (target: DealStep) => {
      router.push(getDealUrl(dealId, target));
    },
    goBack: (previous: DealStep | null) => {
      if (previous) {
        router.push(getDealUrl(dealId, previous));
      }
    },
  };
}
