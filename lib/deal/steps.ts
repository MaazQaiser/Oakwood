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
  { index: number; title: string; shortTitle: string; supporting: string }
> = {
  "part-exchange": {
    index: 1,
    title: "Value your part exchange",
    shortTitle: "Part exchange",
    supporting: "Optional. Our price, no middleman.",
  },
  budget: {
    index: 2,
    title: "Finance preferences",
    shortTitle: "Finance",
    supporting: "Three questions, one screen. Your monthly updates live.",
  },
  decision: {
    index: 3,
    title: "Instant decision",
    shortTitle: "Decision",
    supporting: "Soft check, no credit footprint. About 60 seconds.",
  },
  cover: {
    index: 4,
    title: "Build your cover",
    shortTitle: "Cover",
    supporting: "Tailored to you. Change or remove anything.",
  },
  quote: {
    index: 5,
    title: "Your quote",
    shortTitle: "Quote",
    supporting: "HP or PCP, personal to you.",
  },
  reserve: {
    index: 6,
    title: "Reserve this car",
    shortTitle: "Reserve",
    supporting: "Fully refundable. We take the car off sale while you finish.",
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
