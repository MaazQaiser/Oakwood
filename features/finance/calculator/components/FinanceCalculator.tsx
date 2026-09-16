"use client";

import { AnnualMileageSelector } from "@/components/finance/AnnualMileageSelector";
import { DepositControl } from "@/components/finance/DepositControl";
import { FinanceDisclaimer } from "@/components/finance/FinanceDisclaimer";
import { FinanceProfileIndicator } from "@/components/finance/FinanceProfileIndicator";
import { FinanceTypeSelector } from "@/components/finance/FinanceTypeSelector";
import { MoneyInput } from "@/components/finance/MoneyInput";
import { TermSelector } from "@/components/finance/TermSelector";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Container, Section } from "@/components/layout/Container";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { CalculatorConstraints } from "@/features/finance/calculator/components/CalculatorConstraints";
import { CalculatorPartExchange } from "@/features/finance/calculator/components/CalculatorPartExchange";
import { CalculatorSummary } from "@/features/finance/calculator/components/CalculatorSummary";
import { CalculatorVehicleCard } from "@/features/finance/calculator/components/CalculatorVehicleCard";
import { DealBuilderCTA } from "@/features/finance/calculator/components/DealBuilderCTA";
import { EligibilityCTA } from "@/features/finance/calculator/components/EligibilityCTA";
import { useFinanceCalculator } from "@/features/finance/calculator/hooks/useFinanceCalculator";
import type { CalculatorPageModel } from "@/features/finance/calculator/types";
import {
  CALCULATOR_EXAMPLE_PRICE_HINT,
  CALCULATOR_VEHICLE_PRICE_HINT,
} from "@/lib/finance/calculator-copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

function CalculatorActions({
  model,
  cashDeposit,
  term,
  financeType,
  annualMileage,
  compact = false,
  onAction,
}: {
  model: CalculatorPageModel;
  cashDeposit: number;
  term: number;
  financeType: "hp" | "pcp";
  annualMileage: number;
  compact?: boolean;
  onAction: () => void;
}) {
  const hasVehicle = Boolean(model.vehicle?.financeable);
  const needsEligibility = !model.finance.hasProfile;

  const dealCta =
    hasVehicle && model.vehicle ? (
      <DealBuilderCTA
        stockId={model.vehicle.stockId}
        cashDeposit={cashDeposit}
        term={term}
        financeType={financeType}
        annualMileage={annualMileage}
        onClick={onAction}
      />
    ) : null;

  if (compact) {
    if (needsEligibility) {
      return <EligibilityCTA compact onClick={onAction} />;
    }
    return dealCta ?? <EligibilityCTA compact onClick={onAction} />;
  }

  if (needsEligibility) {
    return (
      <div className="space-y-3">
        <EligibilityCTA onClick={onAction} />
        {dealCta}
      </div>
    );
  }

  return dealCta ?? <EligibilityCTA onClick={onAction} />;
}

export function FinanceCalculator({ model }: { model: CalculatorPageModel }) {
  const calculator = useFinanceCalculator(model);
  const {
    draft,
    priceText,
    result,
    provider,
    profile,
    maxTerm,
    personalised,
    setVehiclePrice,
    blurVehiclePrice,
    setCashDeposit,
    setFinanceType,
    setTerm,
    setAnnualMileage,
    applyPartExchange,
    clearPartExchange,
    applyDepositGap,
    retryCalculation,
    markCompletedAction,
    fieldError,
  } = calculator;

  const showPcpMileage = draft.financeType === "pcp" && provider.pcpEnabled;
  const maxDeposit = Math.max(
    provider.minDeposit,
    Number.isFinite(draft.vehiclePrice)
      ? Math.min(draft.vehiclePrice, provider.maxDepositCap)
      : provider.maxDepositCap,
  );
  const showPayment = result.status === "ok" && result.calculation;

  return (
    <>
      <Section className="pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-[var(--oak-section-y)]">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start">
            <div className="flex min-w-0 flex-col gap-6">
              {model.vehicle ? (
                <CalculatorVehicleCard vehicle={model.vehicle} />
              ) : null}

              <FinanceProfileIndicator
                hasProfile={model.finance.hasProfile}
                expired={model.finance.expired}
                unavailable={model.finance.unavailable}
                profile={model.finance.hasProfile ? model.finance.profile : undefined}
              />

              <section
                aria-labelledby="calculator-inputs-heading"
                className="scroll-mb-28 rounded-lg border border-border bg-surface p-4 md:p-5"
              >
                <h2 id="calculator-inputs-heading" className="text-h3">
                  Your estimate
                </h2>
                <div className="mt-5 space-y-6">
                  <MoneyInput
                    id="calculator-vehicle-price"
                    name="vehicle-price"
                    label="Vehicle price"
                    hint={
                      model.vehicle
                        ? CALCULATOR_VEHICLE_PRICE_HINT
                        : CALCULATOR_EXAMPLE_PRICE_HINT
                    }
                    error={fieldError("vehiclePrice")}
                    value={priceText}
                    onChange={setVehiclePrice}
                    onBlur={blurVehiclePrice}
                  />
                  <FinanceTypeSelector
                    value={draft.financeType}
                    onChange={setFinanceType}
                    pcpEnabled={provider.pcpEnabled}
                  />
                  <DepositControl
                    cashDeposit={draft.cashDeposit}
                    minDeposit={provider.minDeposit}
                    maxDeposit={maxDeposit}
                    step={provider.depositStep}
                    error={fieldError("deposit")}
                    pxEquity={result.calculation?.pxEquity}
                    totalDeposit={result.calculation?.totalDeposit}
                    onChange={setCashDeposit}
                  />
                  <TermSelector
                    value={draft.term}
                    options={provider.termOptions}
                    maxTerm={maxTerm}
                    onChange={setTerm}
                  />
                  {showPcpMileage ? (
                    <AnnualMileageSelector
                      value={draft.annualMileage}
                      options={provider.pcpMileageOptions}
                      onChange={setAnnualMileage}
                    />
                  ) : null}
                </div>
              </section>

              <CalculatorPartExchange
                vehicle={model.vehicle}
                px={draft.px}
                equity={result.calculation?.pxEquity ?? 0}
                negativeEquity={result.calculation?.pxNegativeEquity ?? 0}
                onApplied={applyPartExchange}
                onClear={clearPartExchange}
              />

              <CalculatorConstraints
                status={result.status}
                constraints={result.constraints}
                onIncreaseDeposit={applyDepositGap}
                onRetry={retryCalculation}
              />

              <div className="lg:hidden">
                <CalculatorSummary
                  status={result.status}
                  calculation={result.calculation}
                  vehiclePrice={draft.vehiclePrice}
                  financeType={draft.financeType}
                  term={draft.term}
                  annualMileage={
                    draft.financeType === "pcp" ? draft.annualMileage : undefined
                  }
                  personalised={personalised}
                  profile={profile}
                  representativeApr={model.config.representativeApr}
                />
              </div>

              <FinanceDisclaimer personalised={personalised} />
            </div>

            <div className="hidden lg:block">
              <div className="lg:sticky lg:top-24 space-y-4">
                <CalculatorSummary
                  status={result.status}
                  calculation={result.calculation}
                  vehiclePrice={draft.vehiclePrice}
                  financeType={draft.financeType}
                  term={draft.term}
                  annualMileage={
                    draft.financeType === "pcp" ? draft.annualMileage : undefined
                  }
                  personalised={personalised}
                  profile={profile}
                  representativeApr={model.config.representativeApr}
                />
                <CalculatorActions
                  model={model}
                  cashDeposit={draft.cashDeposit}
                  term={draft.term}
                  financeType={draft.financeType}
                  annualMileage={draft.annualMileage}
                  onAction={markCompletedAction}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <StickyActionBar>
        <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-3">
          <div className="min-w-0">
            <p className="text-caption text-muted">Monthly payment</p>
            <FinancialNumber
              value={
                showPayment && result.calculation
                  ? formatPounds(result.calculation.monthlyPayment)
                  : "—"
              }
              suffix={showPayment ? "/month" : undefined}
              size="sm"
              className="text-primary"
            />
          </div>
          <div className={cn("min-w-0 flex-1")}>
            <CalculatorActions
              model={model}
              cashDeposit={draft.cashDeposit}
              term={draft.term}
              financeType={draft.financeType}
              annualMileage={draft.annualMileage}
              compact
              onAction={markCompletedAction}
            />
          </div>
        </div>
      </StickyActionBar>
    </>
  );
}
