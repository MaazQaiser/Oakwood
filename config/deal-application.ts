/**
 * Admin toggles for the embedded finance application (Deal Builder v4 §8–9, §15).
 * Prototype defaults match launch: auto decision OFF, bank details Optional.
 */

export type AutoDecisionDisplay = "off" | "approved_only" | "on";

export type CollectBankDetails = "off" | "optional" | "required";

export const DEAL_APPLICATION_CONFIG = {
  /** Launch default: customer sees process update, not an invented APR decision. */
  autoDecisionDisplay: "off" as AutoDecisionDisplay,
  /** Launch default: bank step shown, submit allowed empty. */
  collectBankDetails: "optional" as CollectBankDetails,
  /** Soft-search / application provider — mock until Hero + Admiral are live. */
  provider: "mock-hero-admiral" as const,
  /** Named callback contact on the pre-approved screen (spec §9). */
  callbackContact: {
    name: "Olivia",
    initials: "OL",
    role: "Finance advisor",
    withinMinutes: 20,
  },
} as const;
