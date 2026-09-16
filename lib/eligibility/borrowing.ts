import type { EligibilityAnswers, EligibilityBorrowingRow } from "@/types/eligibility";

const DEPOSIT_STEPS = [0, 1000, 2000, 3000];

export function getBorrowingTable(
  maxAdvance: number,
  selectedDeposit?: number,
): EligibilityBorrowingRow[] {
  const deposits = new Set(DEPOSIT_STEPS);
  if (selectedDeposit !== undefined && selectedDeposit >= 0) {
    deposits.add(Math.round(selectedDeposit));
  }

  return [...deposits]
    .sort((a, b) => a - b)
    .map((deposit) => ({
      deposit,
      available: maxAdvance + deposit,
    }));
}

export function getBudgetBandLabel(band: EligibilityAnswers["monthlyBudget"]): string {
  switch (band) {
    case "under-150":
      return "Under £150";
    case "150-200":
      return "£150–£200";
    case "200-250":
      return "£200–£250";
    case "250-300":
      return "£250–£300";
    case "300-400":
      return "£300–£400";
    case "400-plus":
      return "£400+";
    default:
      return "Not set";
  }
}

export function getEmploymentLabel(
  status: EligibilityAnswers["employment"],
): string {
  switch (status) {
    case "employed":
      return "Employed";
    case "self-employed":
      return "Self-employed";
    case "retired":
      return "Retired";
    case "student":
      return "Student";
    case "other":
      return "Other";
    default:
      return "Not set";
  }
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) {
    return "your email";
  }

  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}
