import { getBorrowingTable, maskEmail } from "@/lib/eligibility/borrowing";
import type { FinanceProfile } from "@/types/finance";
import type {
  EligibilityAnswers,
  EligibilityOutcomeKind,
  EligibilityResultDisplay,
} from "@/types/eligibility";

const DEFAULT_APR = 16.9;
const DEFAULT_TERM = 60;

export interface EligibilityDecision {
  kind: EligibilityOutcomeKind;
  profile?: FinanceProfile;
  display?: EligibilityResultDisplay;
}

function createProfile(
  maxAdvance: number,
  decisionIdentifier: string,
  now: Date,
): FinanceProfile {
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    apr: DEFAULT_APR,
    maximumAdvance: maxAdvance,
    maximumTerm: DEFAULT_TERM,
    productType: "hp",
    decisionIdentifier,
    decisionDate: now.toISOString(),
    expiry: expiry.toISOString(),
  };
}

function toDisplay(
  profile: FinanceProfile,
  answers: EligibilityAnswers,
  extras?: Pick<EligibilityResultDisplay, "selectedVehicleAmount" | "depositShortfall">,
): EligibilityResultDisplay {
  const deposit = answers.deposit ?? 0;
  return {
    apr: profile.apr,
    maxAdvance: profile.maximumAdvance,
    deposit,
    term: profile.maximumTerm,
    productType: profile.productType,
    borrowingRows: getBorrowingTable(profile.maximumAdvance, deposit),
    maskedEmail: answers.email ? maskEmail(answers.email) : undefined,
    ...extras,
  };
}

function mockAdvance(income: number): number {
  return Math.min(30000, Math.max(8000, Math.round(income * 12)));
}

/**
 * Mock decisioning until Autoconvert is connected.
 * Never returns customer-facing decline copy — callers map `alternative`.
 */
export function decideEligibility(
  answers: EligibilityAnswers,
  decisionIdentifier: string,
  now = new Date(),
): EligibilityDecision {
  const email = answers.email?.trim().toLowerCase() ?? "";
  const income = answers.monthlyIncome ?? 0;

  if (email.startsWith("error@")) {
    return { kind: "error" };
  }

  if (email.startsWith("help@") || email.startsWith("options@") || income < 900) {
    return { kind: "alternative" };
  }

  if (email.startsWith("refer@") || (income >= 900 && income < 1300)) {
    return { kind: "refer" };
  }

  const maxAdvance = mockAdvance(income);
  const profile = createProfile(maxAdvance, decisionIdentifier, now);
  const selectedVehicleAmount =
    answers.monthlyBudget === "400-plus" ? 18000 : undefined;
  const deposit = answers.deposit ?? 0;
  const shortfall =
    selectedVehicleAmount !== undefined
      ? Math.max(0, selectedVehicleAmount - deposit - maxAdvance)
      : 0;

  if (shortfall > 0) {
    return {
      kind: "conditional",
      profile,
      display: toDisplay(profile, answers, {
        selectedVehicleAmount,
        depositShortfall: shortfall,
      }),
    };
  }

  return {
    kind: "accepted",
    profile,
    display: toDisplay(profile, answers),
  };
}

export function shouldDelayDecision(answers: EligibilityAnswers): boolean {
  return (answers.email?.trim().toLowerCase() ?? "").startsWith("timeout@");
}
