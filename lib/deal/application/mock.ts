import { DEAL_APPLICATION_CONFIG } from "@/config/deal-application";
import type {
  DealApplicationCustomerOutcome,
  DealApplicationFormState,
  DealApplicationLenderOutcome,
  DealApplicationResult,
} from "@/types/deal-application";
import { bankDetailsProvided } from "@/lib/deal/application/validation";

/**
 * Prototype outcome triggers (mock only — not live underwriting):
 * - Last name contains "error" → client submit failure (see shouldMockSubmitFail)
 * - Last name contains "decline" → declined
 * - Last name contains "refer" OR income < £12k → referred
 * - Otherwise → approved (shown as pre-approved when toggle OFF)
 */
export function shouldMockSubmitFail(form: DealApplicationFormState): boolean {
  return /\berror\b/i.test(form.personal.fullName);
}

export function resolveMockLenderOutcome(
  form: DealApplicationFormState,
): DealApplicationLenderOutcome {
  const name = form.personal.fullName.toLowerCase();
  if (/\bdecline/.test(name)) {
    return "declined";
  }
  const income =
    typeof form.income.grossAnnualIncome === "number"
      ? form.income.grossAnnualIncome
      : Number(form.income.grossAnnualIncome);
  if (/\brefer/.test(name) || (Number.isFinite(income) && income < 12000)) {
    return "referred";
  }
  return "approved";
}

export function toCustomerOutcome(
  lender: DealApplicationLenderOutcome,
  autoDecisionDisplay = DEAL_APPLICATION_CONFIG.autoDecisionDisplay,
): DealApplicationCustomerOutcome {
  // Launch: auto_decision_display OFF — approved maps to soft pre-approved process update.
  if (autoDecisionDisplay === "off") {
    if (lender === "approved") return "pre_approved";
    if (lender === "referred") return "referred";
    return "declined";
  }
  if (lender === "approved") return "pre_approved";
  if (lender === "referred") return "referred";
  return "declined";
}

function mockReference(dealId: string): string {
  const seed = dealId.replace(/[^a-zA-Z0-9]/g, "").slice(-6);
  return `APP-${seed.toUpperCase() || "DEMO01"}`;
}

export function buildMockApplicationResult(
  dealId: string,
  form: DealApplicationFormState,
): DealApplicationResult {
  const lenderOutcome = resolveMockLenderOutcome(form);
  const customerOutcome = toCustomerOutcome(lenderOutcome);
  const income =
    typeof form.income.grossAnnualIncome === "number"
      ? form.income.grossAnnualIncome
      : Number(form.income.grossAnnualIncome);

  return {
    lenderOutcome,
    customerOutcome,
    submittedAt: new Date().toISOString(),
    reference: mockReference(dealId),
    bankDetailsProvided: bankDetailsProvided(form),
    // Stored for admin/Eskimo mock only — never render while toggle is OFF.
    mockApr:
      lenderOutcome === "approved"
        ? income >= 40000
          ? 9.9
          : 12.9
        : undefined,
  };
}

/** Simulated network latency for submit UX. */
export function mockSubmitDelayMs(): number {
  return 1400;
}
