export const BEAT_LOAN_OFFER = {
  title: "Already have a loan offer?",
  description:
    "Tell us the lender, the rate and the term. We will try to beat it.",
  submitLabel: "Send my offer",
  successTitle: "Thanks — we have your offer",
  successBody:
    "A colleague will review it and get back to you. This is not a credit application and does not affect your credit score.",
  metaTitle: "Beat my loan offer",
  metaDescription:
    "Share an existing personal loan offer with Oakwood. We will try to beat the rate and term you already have.",
} as const;

export interface BeatLoanOfferInput {
  name: string;
  email: string;
  telephone: string;
  lender: string;
  rateApr: string;
  termMonths: string;
  notes?: string;
}
