"use server";

import { createBeatLoanOffer } from "@/features/finance/beat-loan-offer-store";
import type { BeatLoanOfferInput } from "@/lib/finance/beat-loan-offer";
import { contactError } from "@/lib/support/validation";

function fieldError(value: string, label: string): string | undefined {
  if (!value.trim()) {
    return `Enter ${label}.`;
  }
  return undefined;
}

function rateError(value: string): string | undefined {
  const missing = fieldError(value, "the rate");
  if (missing) return missing;
  const n = Number(value.replace(/%/g, "").trim());
  if (!Number.isFinite(n) || n <= 0 || n > 100) {
    return "Enter the APR as a number, for example 9.4.";
  }
  return undefined;
}

function termError(value: string): string | undefined {
  const missing = fieldError(value, "the term");
  if (missing) return missing;
  const n = Number(value.trim());
  if (!Number.isFinite(n) || n < 1 || n > 84) {
    return "Enter the term in months, for example 48.";
  }
  return undefined;
}

export async function submitBeatLoanOffer(
  input: BeatLoanOfferInput,
): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const invalidContact = contactError(input);
    if (invalidContact) {
      return { ok: false, error: invalidContact };
    }
    const lenderInvalid = fieldError(input.lender, "the lender");
    if (lenderInvalid) {
      return { ok: false, error: lenderInvalid };
    }
    const rateInvalid = rateError(input.rateApr);
    if (rateInvalid) {
      return { ok: false, error: rateInvalid };
    }
    const termInvalid = termError(input.termMonths);
    if (termInvalid) {
      return { ok: false, error: termInvalid };
    }

    const record = createBeatLoanOffer(input);
    return { ok: true, reference: record.reference };
  } catch {
    return { ok: false, error: "We couldn't send your offer details." };
  }
}
