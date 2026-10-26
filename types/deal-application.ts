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

/** Where the saved application is held. Never a lending decision. */
export type DealApplicationProvider = "queued" | "hero-admiral";

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
  submittedAt: string;
  reference: string;
  /** True when bank details were supplied — never echo the values in UI summaries. */
  bankDetailsProvided: boolean;
  /**
   * queued: saved on the Oakwood deal for an advisor.
   * hero-admiral: accepted by the live finance provider.
   * Neither value is an approval, referral, or decline.
   */
  provider: DealApplicationProvider;
}

export interface DealFinanceApplicationDraft {
  section: DealApplicationSectionId;
  form: DealApplicationFormState;
  result?: DealApplicationResult;
  /** Last message after a failed save, so the customer can try again. */
  submitError?: string;
}
