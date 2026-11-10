export type ApplySectionId =
  | "quick-start"
  | "your-details"
  | "address"
  | "employment"
  | "finance"
  | "joint"
  | "part-exchange"
  | "review"
  | "decision";

export type ApplyStepId =
  | "budget"
  | "credit-rating"
  | "deposit"
  | "part-exchange-choice"
  | "car-type"
  | "when"
  | "name"
  | "mobile"
  | "email"
  | "dob"
  | "joint-choice"
  | "licence"
  | "uk-passport"
  | "passport-nationality"
  | "passport-country"
  | "address"
  | "address-duration"
  | "living"
  | "previous-address"
  | "previous-address-duration"
  | "employment"
  | "employer"
  | "job-title"
  | "job-duration"
  | "previous-employer"
  | "previous-job-title"
  | "previous-employment-start"
  | "previous-employment-end"
  | "income"
  | "other-income"
  | "ja-intro"
  | "ja-name"
  | "ja-dob"
  | "ja-relationship"
  | "ja-address"
  | "ja-address-duration"
  | "ja-previous-address"
  | "ja-previous-address-duration"
  | "ja-living"
  | "ja-employment"
  | "ja-employer"
  | "ja-job-title"
  | "ja-job-duration"
  | "ja-previous-employer"
  | "ja-previous-job-title"
  | "ja-previous-employment-start"
  | "ja-previous-employment-end"
  | "ja-income"
  | "ja-mobile"
  | "ja-email"
  | "ja-review"
  | "px-intro"
  | "px-registration"
  | "px-mileage"
  | "px-on-finance"
  | "px-lender"
  | "px-monthly-payment"
  | "px-settlement"
  | "px-complete"
  | "consent";

export type ApplyStepKind = "choice" | "form" | "address" | "confirm" | "info";

export interface ApplyChoice {
  value: string;
  label: string;
  quiet?: boolean;
}

export interface ApplyStep {
  id: ApplyStepId;
  section: ApplySectionId;
  kind: ApplyStepKind;
  title: string;
  support?: string;
  choices?: ApplyChoice[];
}

export interface ApplicationData {
  budgetBand?: string;
  creditRating?: string;
  depositBand?: string;
  hasPartExchange?: "yes" | "no";
  carType?: string;
  purchaseTimeframe?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  dateOfBirth?: string;
  jointApplicant?: boolean;
  drivingLicence?: string;
  ukPassport?: "yes" | "no";
  ukPassportNationality?: string;
  passportCountry?: string;
  postcode?: string;
  address?: string;
  addressTenure?: string;
  livingStatus?: string;
  previousPostcode?: string;
  previousAddress?: string;
  previousAddressMovedIn?: string;
  previousAddressMovedOut?: string;
  employmentStatusFull?: string;
  employerName?: string;
  jobTitle?: string;
  jobDuration?: string;
  previousEmployerName?: string;
  previousJobTitle?: string;
  previousEmploymentStart?: string;
  previousEmploymentEnd?: string;
  monthlyIncome?: string;
  otherIncome?: string;
  jointFirstName?: string;
  jointLastName?: string;
  jointDateOfBirth?: string;
  jointRelationship?: string;
  jointPostcode?: string;
  jointAddress?: string;
  jointAddressTenure?: string;
  jointPreviousPostcode?: string;
  jointPreviousAddress?: string;
  jointPreviousMovedIn?: string;
  jointPreviousMovedOut?: string;
  jointLivingStatus?: string;
  jointEmploymentStatusFull?: string;
  jointEmployerName?: string;
  jointJobTitle?: string;
  jointJobDuration?: string;
  jointPreviousEmployerName?: string;
  jointPreviousJobTitle?: string;
  jointPreviousEmploymentStart?: string;
  jointPreviousEmploymentEnd?: string;
  jointMonthlyIncome?: string;
  jointMobile?: string;
  jointEmail?: string;
  partExchangeRegistration?: string;
  partExchangeRegUnknown?: boolean;
  partExchangeMileage?: string;
  hasFinanceToSettle?: "yes" | "no";
  partExchangeLender?: string;
  partExchangeMonthlyPayment?: string;
  settlementAmount?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
  marketingConsent?: boolean;
}

export interface ApplyDraft {
  data: ApplicationData;
  stepId: ApplyStepId;
  progress: Partial<Record<ApplySectionId, number>>;
}

export type ApplyFieldErrors = Record<string, string>;
