"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DealFailureState } from "@/components/deal/DealFailureState";
import { FinanceConstraintMessage } from "@/components/deal/FinanceConstraintMessage";
import {
  DealBuilderProvider,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { DealProgress } from "@/components/deal/wizard/DealProgress";
import { Container } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import type { DealStep } from "@/config/routes";
import { getDealUrl, getVehicleUrl } from "@/config/routes";
import { DEAL_AUTOSAVE_ERROR } from "@/lib/deal/copy";
import { DEAL_STEP_META } from "@/lib/deal/steps";
import type { DealPageModel } from "@/types/deal";
import { DealAbandonmentModal } from "@/components/deal/DealAbandonmentModal";
import { cn } from "@/lib/cn";

function WizardInner({
  step,
  children,
}: {
  step: DealStep;
  children: ReactNode;
}) {
  const { vehicle, phase, autosave } = useDealBuilder();
  const meta = DEAL_STEP_META[step];

  return (
    <>
      <JourneyChrome />
      <div className="flex min-h-[calc(100dvh-var(--oak-header-height))] flex-col bg-page-tint lg:px-6 lg:pt-6">
        <section className="deal-wizard mx-auto flex min-w-0 w-full max-w-3xl flex-1 flex-col lg:min-h-[calc(100dvh-var(--oak-header-height)-1.5rem)]">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6 lg:px-0">
            <header className="pt-6 pb-5 lg:pt-2">
              <DealProgress step={step} layout="row" />
              <h1 className="mt-4 text-[1.75rem] font-semibold! leading-tight tracking-[-0.03em] text-navy sm:text-[2.15rem]">
                {meta.title}
              </h1>
              <p className="mt-2 text-body-sm text-secondary">
                {meta.supporting}
              </p>
              {autosave === "error" ? (
                <p className="mt-2 text-caption text-danger" role="status">
                  {DEAL_AUTOSAVE_ERROR}
                </p>
              ) : null}
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

function failureKind(
  model: DealPageModel,
): "session" | "vehicle" | "not_found" {
  if (model.status === "expired") {
    return "session";
  }
  if (model.status === "not_found" || !model.vehicle) {
    return "not_found";
  }
  return "vehicle";
}

const DEAL_OPEN_MAX_REFRESH = 3;

function DealFailureShell({
  model,
  kind,
}: {
  model: DealPageModel;
  kind: "session" | "vehicle" | "not_found";
}) {
  return (
    <>
      <JourneyChrome />
      <div className="px-[var(--oak-page-x)] py-10 sm:py-12">
        <Container width="content">
          <DealFailureState
            kind={kind}
            recoveryStockId={model.recoveryStockId}
            recoveryVehicleSlug={model.recoveryVehicleSlug}
          />
        </Container>
      </div>
    </>
  );
}

/**
 * A new deal is often painted once before its cookie is visible to this
 * request. Retry the server render a few times — a single refresh plus
 * sessionStorage used to fail immediately under React Strict Mode.
 */
function DealStartupRecovery({ model }: { model: DealPageModel }) {
  const router = useRouter();
  const [gaveUp, setGaveUp] = useState(false);
  const refreshAttempts = useRef(0);

  useEffect(() => {
    if (refreshAttempts.current >= DEAL_OPEN_MAX_REFRESH) {
      setGaveUp(true);
      return;
    }
    refreshAttempts.current += 1;
    const delayMs = refreshAttempts.current === 1 ? 80 : 350;
    const timer = window.setTimeout(() => router.refresh(), delayMs);
    return () => window.clearTimeout(timer);
  }, [model.dealId, router]);

  if (gaveUp) {
    return <DealFailureShell model={model} kind={failureKind(model)} />;
  }

  return (
    <>
      <JourneyChrome />
      <div className="px-[var(--oak-page-x)] py-10 sm:py-12">
        <Container width="content">
          <p className="text-body text-muted" role="status">
            Opening your deal…
          </p>
        </Container>
      </div>
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
    return <DealStartupRecovery model={model} />;
  }

  return (
    <DealBuilderProvider model={model} step={step}>
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
