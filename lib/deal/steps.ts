import type { DealStep } from "@/config/routes";

/**
 * Customer Deal Builder. Four steps, matching the deal-builder flow:
 * part exchange, finance preferences, your deal, then the next-step choices.
 */
export const DEAL_STEPS = [
  "part-exchange",
  "budget",
  "quote",
  "reserve",
] as const satisfies readonly DealStep[];

export type PrimaryDealStep = (typeof DEAL_STEPS)[number];

export const DEAL_STEP_META: Record<
  DealStep,
  { index: number; title: string; shortTitle: string; supporting: string }
> = {
  "part-exchange": {
    index: 1,
    title: "Part exchange",
    shortTitle: "Part exchange",
    supporting: "Your current car, and how it counts toward the deposit.",
  },
  budget: {
    index: 2,
    title: "Finance Preferences",
    shortTitle: "Finance preferences",
    supporting: "Hire Purchase and Personal Contract Purchase, side by side.",
  },
  decision: {
    index: 3,
    title: "Your deal",
    shortTitle: "Your deal",
    supporting: "Your finance choice and the cover on this deal.",
  },
  cover: {
    index: 3,
    title: "Your deal",
    shortTitle: "Your deal",
    supporting: "Your finance choice and the cover on this deal.",
  },
  quote: {
    index: 3,
    title: "Your deal",
    shortTitle: "Your deal",
    supporting: "Your finance choice and the cover on this deal.",
  },
  reserve: {
    index: 4,
    title: "Next step",
    shortTitle: "Next step",
    supporting:
      "Reserve, apply for finance, book a test drive, or speak to us.",
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
