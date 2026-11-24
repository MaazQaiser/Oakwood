import type { BeatLoanOfferInput } from "@/lib/finance/beat-loan-offer";

export interface BeatLoanOfferRecord extends BeatLoanOfferInput {
  id: string;
  reference: string;
  createdAt: number;
}

const offers = new Map<string, BeatLoanOfferRecord>();

function opaqueId(): string {
  return `blo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function reference(id: string): string {
  return `BLO-${id.slice(-6).toUpperCase()}`;
}

export function createBeatLoanOffer(
  input: BeatLoanOfferInput,
): BeatLoanOfferRecord {
  const id = opaqueId();
  const record: BeatLoanOfferRecord = {
    id,
    reference: reference(id),
    createdAt: Date.now(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    telephone: input.telephone.trim(),
    lender: input.lender.trim(),
    rateApr: input.rateApr.trim(),
    termMonths: input.termMonths.trim(),
    notes: input.notes?.trim() || undefined,
  };
  offers.set(id, record);
  return record;
}
