/**
 * Embedded finance application copy (Deal Builder v4 §8–9).
 * Flagged lines require compliance / FCA sign-off before production.
 */

export const APP_COMPLIANCE_FLAG =
  "Compliance review required before production.";

export const APP_TITLE = "Apply for finance";

export const APP_SUPPORTING =
  "Your deal stays on this page while you apply.";

export const APP_NOT_CREDIT_DECISION =
  "An advisor confirms your rate by phone within 20 minutes.";

export const APP_PROGRESS_LABEL = (current: number, total: number) =>
  `Step ${current} of ${total}`;

export const APP_SAVING = "Saving your progress…";

export const APP_SAVED = "Progress saved on this deal.";

export const APP_BACK = "Back";

export const APP_CONTINUE = "Continue";

export const APP_SUBMIT = "Submit application";

export const APP_SUBMITTING = "Saving your application…";

export const APP_SUBMIT_ERROR =
  "We couldn't submit your application just now. Please try again, or call Oakwood for help.";

export const APP_OPTIONAL = "Optional";

export const APP_BANK_OPTIONAL_HINT =
  "Optional. You can skip this and continue — Oakwood can collect bank details later if needed.";

export const APP_BANK_REQUIRED_HINT =
  "Enter your sort code, account number and how long you've been with this bank.";

export const APP_CONSENT_LABEL =
  "I consent to Oakwood and its finance partners carrying out a credit search in connection with this application.";

/** Compliance: consent wording needs legal sign-off. */
export const APP_CONSENT_COMPLIANCE =
  "Consent wording is prototype only — legal / FCA sign-off required.";

export const APP_LICENCE_HINT =
  "Enter your UK driving licence number as shown on your photocard.";

export const APP_ADDRESS_HISTORY_HINT =
  "We need about three years of address history. Add previous addresses until the timeline covers three years.";

export const APP_EMPLOYMENT_HISTORY_HINT =
  "We need about three years of employment history. Add previous roles until the timeline covers three years.";

export const APP_OUTGOINGS_HINT =
  "Your typical total monthly outgoings (rent or mortgage, loans, cards and living costs combined).";

export const APP_INCOME_HINT = "Gross annual income before tax.";

export const APP_RECEIVED_EYEBROW = "Application received";

export const APP_RECEIVED_TITLE = "We've received your application";

export const APP_RECEIVED_BODY =
  "Your details are saved with this deal. An Oakwood advisor will call within 20 minutes. This is not a lending decision, and no rate has been confirmed.";

export const APP_REFERENCE = (reference: string) => `Reference ${reference}`;

export const APP_OUTCOME_DISCLAIMER =
  "An advisor calls within 20 minutes to confirm your rate. This is not a final lending decision.";

export const APP_NEXT_RESERVE = "Reserve this car";

export const APP_NEXT_TEST_DRIVE = "Book a test drive";

export const APP_NEXT_CALL = "Call us now";

export const APP_NEXT_BACK_DEAL = "Back to your next step";

export const APP_CALLBACK_WITHIN = (name: string, minutes: number) =>
  `${name} will call you within ${minutes} minutes`;

export const APP_SECTION_TITLES = {
  personal: "Personal details",
  address: "Address history",
  employment: "Employment",
  income: "Income and outgoings",
  bank: "Bank details",
  licence: "Driving licence and consent",
} as const;

export const APP_SECTION_SHORT = {
  personal: "Personal",
  address: "Address",
  employment: "Employment",
  income: "Income",
  bank: "Bank",
  licence: "Licence",
} as const;

/** Marital options — confirm exact lender list with compliance. */
export const APP_MARITAL_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "civil-partnership", label: "Civil partnership" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
] as const;

export const APP_EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" },
] as const;
