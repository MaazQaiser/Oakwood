import { MARKETING_CONSENT_WORDING } from "@/lib/eligibility/copy";
import type {
  EligibilityAnswers,
  EligibilityQuestion,
  EligibilityQuestionId,
  EligibilityStageId,
} from "@/types/eligibility";

export const ELIGIBILITY_STAGES: { id: EligibilityStageId; label: string }[] = [
  { id: "employment", label: "Employment" },
  { id: "income", label: "Income" },
  { id: "housing", label: "Housing" },
  { id: "finance", label: "Finance" },
  { id: "contact", label: "Contact" },
];

export const ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  {
    id: "employment",
    stage: "employment",
    type: "single",
    question: "What's your employment status?",
    options: [
      { value: "employed", label: "Employed" },
      { value: "self-employed", label: "Self-employed" },
      { value: "retired", label: "Retired" },
      { value: "student", label: "Student" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "selfEmployedDuration",
    stage: "employment",
    type: "number",
    question: "How many months have you been self-employed?",
    support: "Use the length of your current self-employment.",
    placeholder: "Months",
    inputMode: "numeric",
    showIf: (answers) => answers.employment === "self-employed",
  },
  {
    id: "monthlyIncome",
    stage: "income",
    type: "currency",
    question: "What's your monthly income?",
    support: "Use your usual monthly income before tax.",
    placeholder: "Amount",
    inputMode: "decimal",
  },
  {
    id: "housing",
    stage: "housing",
    type: "single",
    question: "What's your living situation?",
    options: [
      { value: "own", label: "Own my home" },
      { value: "mortgage", label: "Mortgage" },
      { value: "rent", label: "Rent" },
      { value: "family", label: "Living with family" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "monthlyBudget",
    stage: "finance",
    type: "single",
    question: "What monthly payment would work for you?",
    support: "This helps us show cars around a monthly amount that feels comfortable.",
    options: [
      { value: "under-150", label: "Under £150" },
      { value: "150-200", label: "£150–£200" },
      { value: "200-250", label: "£200–£250" },
      { value: "250-300", label: "£250–£300" },
      { value: "300-400", label: "£300–£400" },
      { value: "400-plus", label: "£400+" },
    ],
  },
  {
    id: "deposit",
    stage: "finance",
    type: "deposit",
    question: "How much could you put towards your deposit?",
    support: "You can change this later. It will update the cars within your profile.",
    placeholder: "Amount",
    options: [
      { value: "0", label: "£0" },
      { value: "500", label: "£500" },
      { value: "1000", label: "£1,000" },
      { value: "2000", label: "£2,000" },
      { value: "3000", label: "£3,000+" },
    ],
  },
  {
    id: "partExchange",
    stage: "finance",
    type: "single",
    question: "Do you have a car to part exchange?",
    support: "This is optional. You can get a valuation after this check.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "firstName",
    stage: "contact",
    type: "text",
    question: "What's your first name?",
    why: "We'll use this so we can send your result to the right person.",
    placeholder: "First name",
  },
  {
    id: "email",
    stage: "contact",
    type: "email",
    question: "What's your email address?",
    support: "We'll email you a copy of your result. You'll still see it on screen.",
    placeholder: "name@email.com",
    inputMode: "email",
  },
  {
    id: "mobile",
    stage: "contact",
    type: "tel",
    question: "What's your mobile number?",
    why: "We may need this if the Oakwood team has to follow up.",
    placeholder: "07...",
    inputMode: "tel",
  },
  {
    id: "postcode",
    stage: "contact",
    type: "postcode",
    question: "What's your postcode?",
    support:
      "We use this to understand your address area and assess your application.",
    why: "Address lookup is not connected yet, so only your postcode is needed for this preview.",
    placeholder: "Enter postcode",
  },
  {
    id: "marketingConsent",
    stage: "contact",
    type: "consent",
    question: "Would you like updates from Oakwood?",
    support:
      "Your marketing preferences are separate from your finance eligibility check.",
    options: [{ value: "yes", label: MARKETING_CONSENT_WORDING }],
  },
];

export function getVisibleQuestions(
  answers: EligibilityAnswers,
): EligibilityQuestion[] {
  return ELIGIBILITY_QUESTIONS.filter(
    (question) => !question.showIf || question.showIf(answers),
  );
}

export function getQuestionById(
  id: EligibilityQuestionId,
): EligibilityQuestion | undefined {
  return ELIGIBILITY_QUESTIONS.find((question) => question.id === id);
}

export function getStageIndex(stage: EligibilityStageId): number {
  return ELIGIBILITY_STAGES.findIndex((item) => item.id === stage);
}

function readAnswer(
  answers: EligibilityAnswers,
  id: EligibilityQuestionId,
): string | number | boolean | undefined {
  return answers[id];
}

const UK_POSTCODE =
  /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function normaliseUkMobile(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("+44")) {
    return `0${digitsOnly(trimmed.slice(3))}`;
  }
  return digitsOnly(trimmed);
}

export function parseCurrency(value: string): number | undefined {
  const cleaned = value.replace(/[£,\s]/g, "");
  if (!cleaned) {
    return undefined;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function validateQuestion(
  question: EligibilityQuestion,
  answers: EligibilityAnswers,
): string | undefined {
  const value = readAnswer(answers, question.id);

  if (question.type === "consent") {
    return undefined;
  }

  if (value === undefined || value === "") {
    return "This information is required to continue.";
  }

  if (question.type === "single" || question.type === "yesno") {
    const allowed = question.options?.some((option) => option.value === value);
    return allowed ? undefined : "Choose one of the options to continue.";
  }

  if (question.type === "currency" || question.type === "deposit") {
    const amount = typeof value === "number" ? value : parseCurrency(String(value));
    if (amount === undefined || amount < 0 || amount > 1_000_000) {
      return "Enter a valid amount.";
    }
    if (question.id === "monthlyIncome" && amount < 1) {
      return "Enter a valid amount.";
    }
    return undefined;
  }

  if (question.type === "number") {
    const amount = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(amount) || amount < 1 || amount > 600) {
      return "Enter a valid number of months.";
    }
    return undefined;
  }

  if (question.type === "email") {
    return EMAIL.test(String(value).trim())
      ? undefined
      : "Enter a valid email address.";
  }

  if (question.type === "tel") {
    const mobile = normaliseUkMobile(String(value));
    return /^07\d{9}$/.test(mobile)
      ? undefined
      : "Enter a valid UK mobile number.";
  }

  if (question.type === "postcode") {
    return UK_POSTCODE.test(String(value).trim())
      ? undefined
      : "Enter a valid UK postcode.";
  }

  if (question.type === "text") {
    return String(value).trim().length >= 2
      ? undefined
      : "Enter at least two characters.";
  }

  return undefined;
}

export function sanitiseAnswers(answers: EligibilityAnswers): EligibilityAnswers {
  const next: EligibilityAnswers = { ...answers };
  if (next.employment !== "self-employed") {
    delete next.selfEmployedDuration;
  }
  return next;
}
