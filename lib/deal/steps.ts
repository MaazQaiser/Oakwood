import type { DealStep } from "@/config/routes";

export const DEAL_STEPS: readonly DealStep[] = [
  "part-exchange",
  "budget",
  "decision",
  "cover",
  "quote",
  "reserve",
] as const;

export const DEAL_STEP_META: Record<
  DealStep,
  { index: number; title: string; shortTitle: string }
> = {
  "part-exchange": {
    index: 1,
    title: "Your part exchange",
    shortTitle: "Part exchange",
  },
  budget: {
    index: 2,
    title: "Your budget",
    shortTitle: "Budget",
  },
  decision: {
    index: 3,
    title: "Your decision",
    shortTitle: "Decision",
  },
  cover: {
    index: 4,
    title: "Your cover",
    shortTitle: "Cover",
  },
  quote: {
    index: 5,
    title: "Your quote",
    shortTitle: "Quote",
  },
  reserve: {
    index: 6,
    title: "Reserve",
    shortTitle: "Reserve",
  },
};

export function getDealStepIndex(step: DealStep): number {
  return DEAL_STEP_META[step].index;
}

export function getNextDealStep(step: DealStep): DealStep | null {
  const index = DEAL_STEPS.indexOf(step);
  if (index < 0 || index >= DEAL_STEPS.length - 1) {
    return null;
  }
  return DEAL_STEPS[index + 1] ?? null;
}

export function getPreviousDealStep(step: DealStep): DealStep | null {
  const index = DEAL_STEPS.indexOf(step);
  if (index <= 0) {
    return null;
  }
  return DEAL_STEPS[index - 1] ?? null;
}
