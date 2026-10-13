import type { ComponentType } from "react";
import { DealWizardShell } from "@/components/deal/wizard/DealWizardShell";
import { DealPartExchangeStep } from "@/components/deal/wizard/steps/DealPartExchangeStep";
import { DealBudgetStep } from "@/components/deal/wizard/steps/DealBudgetStep";
import { DealDecisionStep } from "@/components/deal/wizard/steps/DealDecisionStep";
import { DealCoverStep } from "@/components/deal/wizard/steps/DealCoverStep";
import { DealQuoteStep } from "@/components/deal/wizard/steps/DealQuoteStep";
import { DealReserveStep } from "@/components/deal/wizard/steps/DealReserveStep";
import type { DealStep } from "@/config/routes";
import type { DealPageModel } from "@/types/deal";

const STEP_CONTENT: Record<DealStep, ComponentType> = {
  "part-exchange": DealPartExchangeStep,
  budget: DealBudgetStep,
  decision: DealDecisionStep,
  cover: DealCoverStep,
  quote: DealQuoteStep,
  reserve: DealReserveStep,
};

export function DealWizardPage({
  model,
  step,
}: {
  model: DealPageModel;
  step: DealStep;
}) {
  const Step = STEP_CONTENT[step];
  return (
    <DealWizardShell model={model} step={step}>
      <Step />
    </DealWizardShell>
  );
}
