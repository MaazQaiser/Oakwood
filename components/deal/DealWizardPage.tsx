import type { ComponentType } from "react";
import { DealWizardShell } from "@/components/deal/wizard/DealWizardShell";
import { DealPartExchangeStep } from "@/components/deal/wizard/steps/DealPartExchangeStep";
import { DealBudgetStep } from "@/components/deal/wizard/steps/DealBudgetStep";
import { DealCloseStep } from "@/components/deal/wizard/steps/DealCloseStep";
import { DealCoverStep } from "@/components/deal/wizard/steps/DealCoverStep";
import type { DealStep } from "@/config/routes";
import type { DealPageModel } from "@/types/deal";

const STEP_CONTENT: Record<DealStep, ComponentType> = {
  "part-exchange": DealPartExchangeStep,
  budget: DealBudgetStep,
  decision: DealCoverStep,
  cover: DealCoverStep,
  quote: DealCoverStep,
  reserve: DealCloseStep,
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
