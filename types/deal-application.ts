/** Six-section embedded finance application (Deal Builder v4 §8). */

export type DealApplicationSectionId =
  | "personal"
  | "address"
  | "employment"
  | "income"
  | "bank"
  | "licence";

export type MaritalStatus =
  | "single"
  | "married"
  | "civil-partnership"
  | "divorced"
  | "widowed"
  | "separated";

export type EmploymentStatus =
  | "employed"
  | "self-employed"
  | "retired"
  | "unemployed"
  | "other";

export interface DealApplicationAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  /** YYYY-MM moved in. */
  movedIn: string;
  /** YYYY-MM moved out (previous addresses only). */
  movedOut?: string;
}

export interface DealApplicationEmployment {
  status: EmploymentStatus | "";
  employerName: string;
  jobTitle: string;
  /** YYYY-MM started. */
  started: string;
  /** YYYY-MM ended (previous roles only). */
  ended?: string;
}

export interface DealApplicationBankDetails {
  sortCode: string;
  accountNumber: string;
  yearsAtBank: number | "";
  monthsAtBank: number | "";
}

/**
 * Lender-side mock outcome. Not shown as a hard credit decision while
 * auto_decision_display is OFF — customer sees process messaging instead.
 */
export type DealApplicationLenderOutcome =
  | "approved"
  | "referred"
  | "declined";

/** Customer-facing screens with auto_decision_display OFF at launch. */
export type DealApplicationCustomerOutcome =
  | "pre_approved"
  | "referred"
  | "declined";

export interface DealApplicationPersonal {
  fullName: string;
  dateOfBirth: string;
  maritalStatus: MaritalStatus | "";
  email: string;
  phone: string;
}

export interface DealApplicationIncome {
  /** Gross annual income before tax. */
  grossAnnualIncome: number | "";
  /** Total monthly outgoings (single field — do not invent category rows). */
  monthlyOutgoings: number | "";
}

export interface DealApplicationLicence {
  drivingLicenceNumber: string;
  consentToSearch: boolean;
}

export interface DealApplicationFormState {
  personal: DealApplicationPersonal;
  addresses: DealApplicationAddress[];
  employment: DealApplicationEmployment[];
  income: DealApplicationIncome;
  /** Present when collect_bank_details is optional/required and customer entered values. */
  bank?: DealApplicationBankDetails;
  licence: DealApplicationLicence;
}

export interface DealApplicationResult {
  /** Internal mock lender outcome (stored silently; not a live credit decision). */
  lenderOutcome: DealApplicationLenderOutcome;
  /** What the customer sees under the launch toggle. */
  customerOutcome: DealApplicationCustomerOutcome;
  submittedAt: string;
  reference: string;
  /** True when bank details were supplied — never echo the values in UI summaries. */
  bankDetailsProvided: boolean;
  /**
   * Mock APR for Eskimo/admin only. Must not surface while auto_decision_display is OFF.
   * Compliance: credit-tier / APR labels need sign-off before customer display.
   */
  mockApr?: number;
}

export interface DealFinanceApplicationDraft {
  section: DealApplicationSectionId;
  form: DealApplicationFormState;
  result?: DealApplicationResult;
  /** Last client-side error message after a failed mock submit. */
  submitError?: string;
}
