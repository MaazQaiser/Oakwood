import type { DealStep } from "@/config/routes";

/**
 * Customer Deal Builder primary journey (four steps).
 * Decision and quote routes redirect into Your deal.
 */
export const DEAL_STEPS = [
  "part-exchange",
  "budget",
  "cover",
  "reserve",
] as const satisfies readonly DealStep[];

export type PrimaryDealStep = (typeof DEAL_STEPS)[number];

export const DEAL_STEP_META: Record<
  DealStep,
  { index: number; title: string; shortTitle: string; supporting: string }
> = {
  "part-exchange": {
    index: 1,
    title: "Value your part exchange",
    shortTitle: "Part exchange",
    supporting:
      "Optional. See valuation, outstanding finance and what goes towards your deposit.",
  },
  budget: {
    index: 2,
    title: "Finance preferences",
    shortTitle: "Finance",
    supporting:
      "Compare HP and PCP, set your deposit and term. Figures are illustrative.",
  },
  cover: {
    index: 3,
    title: "Your deal",
    shortTitle: "Your deal",
    supporting:
      "Review your finance, add optional cover, and continue when you're ready.",
  },
  reserve: {
    index: 4,
    title: "Choose your next step",
    shortTitle: "Next step",
    supporting:
      "Reserve, apply for finance, book a test drive, or speak to Oakwood.",
  },
  decision: {
    index: 3,
    title: "Your deal",
    shortTitle: "Your deal",
    supporting: "Continue on the combined Your deal screen.",
  },
  quote: {
    index: 3,
    title: "Your deal",
    shortTitle: "Your deal",
    supporting: "Continue on the combined Your deal screen.",
  },
};

export function getDealStepIndex(step: DealStep): number {
  return DEAL_STEP_META[step].index;
}

export function getNextDealStep(step: DealStep): DealStep | null {
  const index = DEAL_STEPS.indexOf(step as PrimaryDealStep);
  if (index < 0 || index >= DEAL_STEPS.length - 1) {
    return null;
  }
  return DEAL_STEPS[index + 1] ?? null;
}

export function getPreviousDealStep(step: DealStep): DealStep | null {
  const index = DEAL_STEPS.indexOf(step as PrimaryDealStep);
  if (index <= 0) {
    return null;
  }
  return DEAL_STEPS[index - 1] ?? null;
}
