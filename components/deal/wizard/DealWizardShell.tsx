"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { DealFailureState } from "@/components/deal/DealFailureState";
import { FinanceConstraintMessage } from "@/components/deal/FinanceConstraintMessage";
import {
  DealBuilderProvider,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { DealPinnedVehicle } from "@/components/deal/wizard/DealPinnedVehicle";
import {
  DealProgress,
  DealProgressBar,
} from "@/components/deal/wizard/DealProgress";
import { DealMonthlyBar } from "@/components/deal/wizard/DealMonthlyBar";
import { Container } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import type { DealStep } from "@/config/routes";
import { getDealUrl, getVehicleUrl } from "@/config/routes";
import { DEAL_STEP_META, DEAL_STEPS } from "@/lib/deal/steps";
import type { DealPageModel } from "@/types/deal";
import { Button } from "@/components/ui/Button";
import {
  DealAbandonmentModal,
  requestDealAbandonment,
} from "@/components/deal/DealAbandonmentModal";
import { cn } from "@/lib/cn";

function WizardInner({
  step,
  children,
}: {
  step: DealStep;
  children: ReactNode;
}) {
  const { vehicle, phase } = useDealBuilder();
  const meta = DEAL_STEP_META[step];
  const total = DEAL_STEPS.length;

  return (
    <>
      <JourneyChrome />
      <div className="flex min-h-[calc(100dvh-var(--oak-header-height))] flex-col bg-page-tint lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-6 lg:pt-6">
        {/* Mobile: one slim sticky strip instead of the full sidebar. */}
        <div className="sticky top-[var(--oak-header-height)] z-20 space-y-2.5 bg-surface px-4 pt-2.5 pb-3 shadow-card lg:hidden">
          {/* Tapping the car returns to its page; the sidebar link is desktop-only. */}
          <button
            type="button"
            aria-label={`Back to the ${vehicle.make} ${vehicle.model} page`}
            className="block w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            onClick={() =>
              requestDealAbandonment(getVehicleUrl(vehicle.slug))
            }
          >
            <DealPinnedVehicle
              layout="strip"
              trailing={
                <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-1 text-caption font-semibold! text-navy">
                  {meta.index}/{total}
                </span>
              }
            />
          </button>
          <DealProgressBar step={step} />
        </div>

        {/* Desktop: a floating card, like the home page's white panels. */}
        <aside className="hidden lg:sticky lg:top-[calc(var(--oak-header-height)+1.5rem)] lg:flex lg:max-h-[calc(100dvh-var(--oak-header-height)-3rem)] lg:flex-col lg:gap-5 lg:overflow-y-auto lg:rounded-card lg:bg-surface lg:p-4 lg:shadow-card">
          <DealPinnedVehicle layout="card" />
          <DealProgress step={step} />
          <DealMonthlyBar />
          <Button
            type="button"
            variant="text"
            className="min-h-9 self-start px-1 text-caption"
            onClick={() =>
              requestDealAbandonment(getVehicleUrl(vehicle.slug))
            }
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to vehicle
          </Button>
        </aside>

        <section className="deal-wizard flex min-w-0 flex-1 flex-col lg:min-h-[calc(100dvh-var(--oak-header-height)-1.5rem)]">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6 lg:px-0">
            <header className="pt-6 pb-5 lg:pt-2">
              <p className="oak-eyebrow">
                Step {meta.index} of {total} · {meta.shortTitle}
              </p>
              <h1 className="mt-2 text-[1.75rem] font-semibold! leading-tight tracking-[-0.03em] text-navy sm:text-[2.15rem]">
                {meta.title}
              </h1>
              <p className="mt-2 text-body-sm text-secondary">
                {meta.supporting}
              </p>
            </header>

            {phase === "VEHICLE_UNAVAILABLE" ? (
              <div className="pb-3">
                <DealFailureState kind="vehicle" />
              </div>
            ) : null}
            {phase === "CALCULATION_ERROR" ? (
              <div className="pb-3">
                <DealFailureState kind="calculation" />
              </div>
            ) : null}
            {/* Deal rule warnings (deposit too high, term not allowed…). */}
            {step !== "decision" && step !== "reserve" ? (
              <div className="empty:hidden pb-3">
                <FinanceConstraintMessage />
              </div>
            ) : null}

            <div className="flex flex-1 flex-col">{children}</div>
          </div>
        </section>
      </div>
      <DealAbandonmentModal
        vehicleHref={getVehicleUrl(vehicle.slug)}
        step={step}
      />
    </>
  );
}

/** One white floating card per step (spec: "one card per step"). */
export function DealCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface p-5 shadow-card sm:p-7",
        className,
      )}
    >
      {children}
    </div>
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
        <div className="px-[var(--oak-page-x)] py-6">
          <Container width="narrow" className="px-0">
            <DealFailureState
              kind={
                model.status === "expired"
                  ? "session"
                  : model.status === "not_found" && !model.vehicle
                    ? "not_found"
                    : "vehicle"
              }
            />
          </Container>
        </div>
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
  const { dealId, markStepComplete, navigateTo } = useDealBuilder();

  // Saves the draft before the route changes (see DealBuilderProvider).
  return {
    goNext: (next: DealStep) => {
      markStepComplete(step);
      navigateTo(getDealUrl(dealId, next));
    },
    goTo: (target: DealStep) => {
      navigateTo(getDealUrl(dealId, target));
    },
    goBack: (previous: DealStep | null) => {
      if (previous) {
        navigateTo(getDealUrl(dealId, previous));
      }
    },
  };
}
