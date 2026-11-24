import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { formatApr } from "@/lib/format/money";

/**
 * Finance rate CTA — admin-editable marketing copy for the shared block.
 * From-rate and representative APR are never typed here; they come from
 * FINANCE_CALCULATOR_CONFIG so every surface stays in agreement.
 */
export const FINANCE_RATE_CTA = {
  heading: "Know your rate before you choose a car",
  /** Prefixed into the supporting line. Editable without touching APR figures. */
  timeClaim: "60 seconds",
  buttonLabel: "Check my rate",
  secondaryLine:
    "Already have a loan offer? Bring it and we will try to beat it.",
  showSecondary: true,
  rateReturnedBody:
    "Every price on the site now shows your payment. Change your deposit or term",
  rateReturnedChangeLabel: "Change your deposit or term",
} as const;

export type FinanceRateCtaVariant = "full" | "compact";

/** Supporting line. Omits representative APR until compliance sets it. */
export function getFinanceRateCtaSupportingLine(
  timeClaim: string = FINANCE_RATE_CTA.timeClaim,
): string {
  const ratesFrom = FINANCE_CALCULATOR_CONFIG.ratesFromApr;
  const representative = FINANCE_CALCULATOR_CONFIG.representativeApr;

  const base = `${timeClaim}, no impact on your credit score`;
  if (ratesFrom === undefined) {
    return `${base}.`;
  }

  const rates = `Rates from ${formatApr(ratesFrom)}`;
  if (representative === undefined) {
    return `${base}. ${rates}.`;
  }

  return `${base}. ${rates}, representative ${formatApr(representative)}.`;
}

export function getFinanceRateReturnedHeading(apr: number): string {
  return `Your rate: ${formatApr(apr)}`;
}
