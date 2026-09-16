import type { FinanceIntent, FinanceIntentSlug } from "@/types/finance";

export const FINANCE_INTENTS: FinanceIntent[] = [
  { slug: "bad-credit", title: "Bad credit" },
  { slug: "no-deposit", title: "No deposit" },
  { slug: "ccj", title: "CCJ" },
  { slug: "self-employed", title: "Self employed" },
  { slug: "first-time-buyer", title: "First time buyer" },
  { slug: "hp", title: "HP" },
  { slug: "pcp", title: "PCP" },
];

export const FINANCE_INTENT_SLUGS: FinanceIntentSlug[] = FINANCE_INTENTS.map(
  (intent) => intent.slug,
);

export function isFinanceIntentSlug(
  value: string,
): value is FinanceIntentSlug {
  return FINANCE_INTENT_SLUGS.includes(value as FinanceIntentSlug);
}

export function getFinanceIntent(slug: string): FinanceIntent | undefined {
  return FINANCE_INTENTS.find((intent) => intent.slug === slug);
}

import { reservationConfig } from "@/config/reservation";

/**
 * Compatibility view of reservation commercial terms.
 * Prefer `reservationConfig` for new code.
 */
export const reservationDefaults = {
  amount: reservationConfig.amount,
  holdDays: reservationConfig.holdDurationDays,
  refundable: reservationConfig.refundable,
} as const;
