/**
 * Embedded finance application copy (Deal Builder v4 §8–9).
 * Flagged lines require compliance / FCA sign-off before production.
 */

export const APP_COMPLIANCE_FLAG =
  "Compliance review required before production.";

export const APP_TITLE = "Apply for finance";

export const APP_SUPPORTING =
  "Complete this mock application for your selected deal. Nothing is sent to a live lender in this prototype.";

export const APP_NOT_CREDIT_DECISION =
  "This is not a real credit decision or final lending approval. Figures on your deal remain illustrative until Oakwood confirms terms with you.";

export const APP_PROGRESS_LABEL = (current: number, total: number) =>
  `Section ${current} of ${total}`;

export const APP_BACK = "Back";

export const APP_CONTINUE = "Continue";

export const APP_SUBMIT = "Submit application";

export const APP_SUBMITTING = "Submitting your application…";

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

/** Pre-approved (auto_decision_display OFF) — process update, not an invented APR. */
export const APP_PREAPPROVED_EYEBROW = "Application received";

export const APP_PREAPPROVED_TITLE = "You're pre-approved to continue";

export const APP_PREAPPROVED_BODY =
  "We've received your application. An Oakwood advisor will call within 20 minutes to confirm next steps. This is a process update — not a final lending decision.";

/** Compliance: "pre-approved" label needs FCA / compliance approval. */
export const APP_PREAPPROVED_COMPLIANCE =
  '"Pre-approved" customer wording requires compliance approval before launch.';

export const APP_REFERRED_EYEBROW = "Application under review";

export const APP_REFERRED_TITLE = "We need a little more time";

export const APP_REFERRED_BODY =
  "Your application needs a further look. Our team will find the right lender option where we can and call you shortly. This is not a final decision.";

export const APP_DECLINED_EYEBROW = "We're reviewing your options";

export const APP_DECLINED_TITLE = "Let's talk through the next step together";

export const APP_DECLINED_BODY =
  "We couldn't complete an automatic path for this application. An Oakwood advisor will review your details and call you — we're here to help find a workable option where we can. This is not a final credit decision shown online.";

export const APP_OUTCOME_DISCLAIMER =
  "Mock prototype only. Not a real credit decision, guaranteed rate, or final lending approval.";

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
