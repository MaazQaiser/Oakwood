import type { FinanceProductType } from "@/types/finance";

export type EligibilityMachineState =
  | "INTRO"
  | "QUESTION"
  | "REVIEW"
  | "SUBMITTING"
  | "RESULT_ACCEPTED"
  | "RESULT_CONDITIONAL"
  | "RESULT_REFER"
  | "RESULT_ALTERNATIVE"
  | "ERROR"
  | "EXPIRED";

export type EligibilityOutcomeKind =
  | "accepted"
  | "conditional"
  | "refer"
  | "alternative"
  | "error";

export type EligibilityStageId =
  | "employment"
  | "income"
  | "housing"
  | "finance"
  | "contact";

export type EligibilityQuestionId =
  | "employment"
  | "selfEmployedDuration"
  | "monthlyIncome"
  | "housing"
  | "monthlyBudget"
  | "deposit"
  | "partExchange"
  | "firstName"
  | "email"
  | "mobile"
  | "postcode"
  | "marketingConsent";

export type EligibilityEmploymentStatus =
  | "employed"
  | "self-employed"
  | "retired"
  | "student"
  | "other";

export type EligibilityHousingStatus =
  | "own"
  | "mortgage"
  | "rent"
  | "family"
  | "other";

export type EligibilityBudgetBand =
  | "under-150"
  | "150-200"
  | "200-250"
  | "250-300"
  | "300-400"
  | "400-plus";

export type EligibilityPartExchange = "yes" | "no" | "not-sure";

export interface EligibilityAnswers {
  employment?: EligibilityEmploymentStatus;
  selfEmployedDuration?: number;
  monthlyIncome?: number;
  housing?: EligibilityHousingStatus;
  monthlyBudget?: EligibilityBudgetBand;
  deposit?: number;
  partExchange?: EligibilityPartExchange;
  firstName?: string;
  email?: string;
  mobile?: string;
  postcode?: string;
  marketingConsent?: boolean;
}

export interface EligibilityConsentRecord {
  granted: boolean;
  timestamp: string;
  method: "eligibility_soft_search";
  wording: string;
}

export interface EligibilityChoiceOption {
  value: string;
  label: string;
}

export type EligibilityFieldType =
  | "single"
  | "currency"
  | "number"
  | "date"
  | "text"
  | "email"
  | "tel"
  | "postcode"
  | "yesno"
  | "consent"
  | "deposit";

export interface EligibilityQuestion {
  id: EligibilityQuestionId;
  stage: EligibilityStageId;
  type: EligibilityFieldType;
  question: string;
  support?: string;
  why?: string;
  placeholder?: string;
  options?: EligibilityChoiceOption[];
  inputMode?: "decimal" | "numeric" | "tel" | "email" | "text";
  showIf?: (answers: EligibilityAnswers) => boolean;
}

export interface EligibilityBorrowingRow {
  deposit: number;
  available: number;
}

export interface EligibilityResultDisplay {
  apr: number;
  maxAdvance: number;
  deposit: number;
  term: number;
  productType: FinanceProductType;
  borrowingRows: EligibilityBorrowingRow[];
  selectedVehicleAmount?: number;
  depositShortfall?: number;
  maskedEmail?: string;
}

export interface EligibilityUiState {
  status: "empty" | "in_progress" | "complete" | "expired";
  questionId?: EligibilityQuestionId;
  answers: EligibilityAnswers;
  outcome?: EligibilityOutcomeKind;
  display?: EligibilityResultDisplay;
  profileExpiry?: string;
}
