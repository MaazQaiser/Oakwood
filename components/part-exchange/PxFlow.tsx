"use client";

import { useEffect, useRef } from "react";
import {
  EligibilityHeader,
  EligibilityLayout,
  EligibilityNavigation,
} from "@/components/eligibility/EligibilityLayout";
import { LoadingState } from "@/components/ui/Loading";
import { PxApplyToDeal } from "@/components/part-exchange/PxApplyToDeal";
import { PxErrorState } from "@/components/part-exchange/PxErrorState";
import { PxEquitySummary } from "@/components/part-exchange/PxEquitySummary";
import { PxIntro } from "@/components/part-exchange/PxIntro";
import { PxManualVehicleForm } from "@/components/part-exchange/PxManualVehicleForm";
import { PxMileageForm } from "@/components/part-exchange/PxMileageForm";
import { PxProgress, type PxProgressStage } from "@/components/part-exchange/PxProgress";
import { PxRegistrationForm } from "@/components/part-exchange/PxRegistrationForm";
import { PxSettlementForm } from "@/components/part-exchange/PxSettlementForm";
import { PxValuationResult } from "@/components/part-exchange/PxValuationResult";
import { PxVehicleSummary } from "@/components/part-exchange/PxVehicleSummary";
import {
  usePartExchange,
  type PxVariant,
} from "@/components/part-exchange/usePartExchange";
import {
  PX_EYEBROW,
  PX_FINANCE_QUESTION,
  PX_MILEAGE_CTA,
  PX_MILEAGE_QUESTION,
  PX_MOCK_NOTICE,
  PX_REGISTRATION_CTA,
  PX_REGISTRATION_QUESTION,
  PX_SETTLEMENT_QUESTION,
} from "@/lib/part-exchange/copy";
import type { DealPartExchangeInput } from "@/types/deal";

function progressFor(step: string): PxProgressStage | undefined {
  if (step === "registration" || step === "lookup") {
    return "registration";
  }
  if (step === "vehicle" || step === "manual") {
    return "vehicle";
  }
  if (step === "mileage" || step === "valuing") {
    return "mileage";
  }
  if (step === "valuation") {
    return "valuation";
  }
  if (step === "finance" || step === "settlement" || step === "result") {
    return "settlement";
  }
  return undefined;
}

export function PxFlow({
  variant,
  initialPx,
  consideredStockId,
  vdp,
  onApplied,
}: {
  variant: PxVariant;
  initialPx?: DealPartExchangeInput;
  consideredStockId?: string;
  vdp?: boolean;
  onApplied?: (px: DealPartExchangeInput) => void | Promise<void>;
}) {
  const flow = usePartExchange({
    variant,
    initialPx,
    consideredStockId,
    vdp,
    onApplied,
  });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [flow.step]);

  if (flow.errorKind === "session_expired" && flow.step === "intro") {
    return (
      <EligibilityLayout>
        <EligibilityHeader eyebrow={PX_EYEBROW} />
        <div className="mt-6">
          <PxErrorState
            kind="session_expired"
            onRestart={() => void flow.restart()}
          />
        </div>
      </EligibilityLayout>
    );
  }

  if (flow.step === "intro") {
    return <PxIntro onStart={() => void flow.start()} />;
  }

  const questionId = "px-question";
  let question = PX_REGISTRATION_QUESTION;
  let support: string | undefined;
  let continueLabel = PX_REGISTRATION_CTA;
  let onContinue: (() => void) | undefined = () => void flow.lookup();
  const continueDisabled = flow.loading || flow.busy;

  if (flow.step === "lookup") {
    question = PX_REGISTRATION_QUESTION;
    onContinue = undefined;
  } else if (flow.step === "vehicle") {
    question = "Is this your car?";
    continueLabel = "Yes, continue";
    onContinue = () => void flow.confirmVehicle();
  } else if (flow.step === "manual") {
    question = "Tell us about your car";
    support = "We'll use these details with your registration and mileage.";
    continueLabel = "Continue";
    onContinue = () => void flow.saveManual();
  } else if (flow.step === "mileage") {
    question = PX_MILEAGE_QUESTION;
    continueLabel = PX_MILEAGE_CTA;
    onContinue = () => void flow.valueVehicle();
  } else if (flow.step === "valuing") {
    question = PX_MILEAGE_QUESTION;
    onContinue = undefined;
  } else if (flow.step === "valuation") {
    question = "Your estimated valuation";
    continueLabel = "Continue";
    onContinue = flow.continueFromValuation;
  } else if (flow.step === "finance") {
    question = PX_FINANCE_QUESTION;
    continueLabel = "Continue";
    onContinue = () => void flow.continueFinance();
  } else if (flow.step === "settlement") {
    question = PX_SETTLEMENT_QUESTION;
    continueLabel = "Continue";
    onContinue = () => void flow.submitSettlement();
  } else if (flow.step === "result") {
    question = "Your part-exchange estimate";
    onContinue = undefined;
  }

  const body = (
    <>
      <EligibilityHeader eyebrow={PX_EYEBROW} />
      <div className="mt-4">
        <PxProgress stage={progressFor(flow.step)} />
      </div>
      <div className="mt-6">
        <h1
          id={questionId}
          ref={headingRef}
          tabIndex={-1}
          className="text-h2 outline-none"
        >
          {question}
        </h1>
        {support ? (
          <p className="mt-2 text-body-sm text-muted">{support}</p>
        ) : null}
      </div>

      {flow.step === "registration" || flow.step === "lookup" ? (
        <PxRegistrationForm
          value={flow.registration}
          error={
            flow.errorKind === "invalid_registration" ? flow.error : undefined
          }
          onChange={flow.setRegistration}
          onManual={flow.enterManual}
        />
      ) : null}

      {flow.step === "lookup" ? (
        <div className="mt-6">
          <LoadingState label="Looking up your registration" />
        </div>
      ) : null}

      {flow.step === "vehicle" && flow.vehicle ? (
        <PxVehicleSummary
          vehicle={flow.vehicle}
          onNotMyCar={flow.notMyCar}
        />
      ) : null}

      {flow.step === "manual" ? (
        <PxManualVehicleForm
          year={flow.manual.year}
          make={flow.manual.make}
          model={flow.manual.model}
          variant={flow.manual.variant}
          fuelType={flow.manual.fuelType}
          transmission={flow.manual.transmission}
          error={flow.error}
          onChange={(field, value) =>
            flow.setManual((current) => ({ ...current, [field]: value }))
          }
        />
      ) : null}

      {flow.step === "mileage" || flow.step === "valuing" ? (
        <>
          {flow.vehicle ? (
            <PxVehicleSummary vehicle={flow.vehicle} onNotMyCar={flow.notMyCar} />
          ) : null}
          <PxMileageForm
            value={flow.mileage}
            error={flow.errorKind === "invalid_mileage" ? flow.error : undefined}
            onChange={flow.setMileage}
          />
        </>
      ) : null}

      {flow.step === "valuing" ? (
        <div className="mt-6">
          <LoadingState label="Getting your valuation" />
        </div>
      ) : null}

      {flow.step === "valuation" && flow.estimatedValue !== undefined ? (
        <>
          {flow.vehicle ? (
            <PxVehicleSummary
              vehicle={flow.vehicle}
              mileage={Number(flow.mileage.replace(/,/g, "")) || undefined}
            />
          ) : null}
          <PxValuationResult estimatedValue={flow.estimatedValue} />
        </>
      ) : null}

      {flow.step === "finance" ? (
        <PxSettlementForm
          mode="finance"
          financeOutstanding={flow.financeOutstanding}
          settlement={flow.settlement}
          onFinanceChange={flow.setFinanceOutstanding}
          onSettlementChange={flow.setSettlement}
        />
      ) : null}

      {flow.step === "settlement" ? (
        <PxSettlementForm
          mode="amount"
          financeOutstanding={flow.financeOutstanding}
          settlement={flow.settlement}
          error={flow.errorKind === "invalid_settlement" ? flow.error : undefined}
          onFinanceChange={flow.setFinanceOutstanding}
          onSettlementChange={flow.setSettlement}
        />
      ) : null}

      {flow.step === "result" && flow.estimatedValue !== undefined ? (
        <div className="mt-6 space-y-6">
          {flow.vehicle ? (
            <PxVehicleSummary
              vehicle={flow.vehicle}
              mileage={Number(flow.mileage.replace(/,/g, "")) || undefined}
            />
          ) : null}
          <PxValuationResult estimatedValue={flow.estimatedValue} />
          <PxEquitySummary
            estimatedValue={flow.estimatedValue}
            settlementFigure={
              flow.financeOutstanding ? Number(flow.settlement.replace(/,/g, "")) || 0 : 0
            }
            equity={flow.figures.equity}
            shortfall={flow.figures.shortfall}
            equityType={flow.figures.equityType}
            vehicle={flow.vehicle}
          />
          <PxApplyToDeal
            equityType={flow.figures.equityType}
            equity={flow.figures.equity}
            hasDeal={flow.hasDeal}
            busy={flow.busy}
            onApply={() => void flow.apply()}
            onRestart={() => void flow.restart()}
          />
        </div>
      ) : null}

      {flow.errorKind &&
      flow.errorKind !== "invalid_registration" &&
      flow.errorKind !== "invalid_mileage" &&
      flow.errorKind !== "invalid_settlement" ? (
        <div className="mt-6">
          <PxErrorState
            kind={flow.errorKind}
            onRetry={() => {
              if (flow.step === "mileage" || flow.errorKind === "valuation_unavailable") {
                void flow.valueVehicle();
                return;
              }
              void flow.lookup();
            }}
            onManual={flow.enterManual}
            onRestart={() => void flow.restart()}
          />
        </div>
      ) : null}

      {flow.error &&
      (flow.errorKind === "invalid_registration" ||
        flow.errorKind === "invalid_mileage" ||
        flow.errorKind === "invalid_settlement" ||
        !flow.errorKind) &&
      flow.step === "finance" ? (
        <p className="mt-4 text-caption text-danger" role="alert">
          {flow.error}
        </p>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {flow.step === "lookup"
          ? "Looking up your registration."
          : flow.step === "valuing"
            ? "Getting your valuation."
            : flow.step === "valuation" && flow.estimatedValue !== undefined
              ? `Estimated part-exchange value ${flow.estimatedValue} pounds.`
              : flow.step === "result"
                ? flow.figures.equityType === "negative"
                  ? `Negative equity ${flow.figures.shortfall} pounds.`
                  : `Equity ${flow.figures.equity} pounds.`
                : ""}
      </p>

      <p className="mt-6 text-caption text-muted">{PX_MOCK_NOTICE}</p>
    </>
  );

  const footer =
    flow.step === "result" ? null : (
      <EligibilityNavigation
        onBack={
          flow.step === "registration" && variant === "inline"
            ? undefined
            : flow.goBack
        }
        onContinue={onContinue}
        continueLabel={continueLabel}
        continueDisabled={continueDisabled}
      />
    );

  if (variant === "inline") {
    return (
      <div className="flex flex-col">
        {body}
        {footer}
      </div>
    );
  }

  return (
    <EligibilityLayout footer={footer}>
      {body}
    </EligibilityLayout>
  );
}

export function PxStandalone() {
  return <PxFlow variant="standalone" />;
}
