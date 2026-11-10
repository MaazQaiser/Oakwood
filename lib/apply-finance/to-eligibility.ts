import type { ApplicationData } from "@/types/apply-finance";
import type {
  EligibilityAnswers,
  EligibilityBudgetBand,
  EligibilityEmploymentStatus,
  EligibilityHousingStatus,
} from "@/types/eligibility";

const DEPOSIT_AMOUNTS: Record<string, number> = {
  "0": 0,
  "under-500": 250,
  "500-1000": 750,
  "1000-1500": 1250,
  "1500-2500": 2000,
  "2500-plus": 2500,
};

const BUDGET_MAP: Record<string, EligibilityBudgetBand> = {
  "under-150": "under-150",
  "150-200": "150-200",
  "200-300": "250-300",
  "300-400": "300-400",
  "400-plus": "400-plus",
};

function mapEmployment(status?: string): EligibilityEmploymentStatus | undefined {
  switch (status) {
    case "employed-full-time":
    case "employed-part-time":
      return "employed";
    case "self-employed":
      return "self-employed";
    case "retired":
      return "retired";
    case "student":
      return "student";
    case "unemployed":
    case "receiving-benefits":
    case "homemaker":
    case "other":
      return "other";
    default:
      return undefined;
  }
}

function mapHousing(status?: string): EligibilityHousingStatus | undefined {
  switch (status) {
    case "homeowner-mortgage":
      return "mortgage";
    case "homeowner":
      return "own";
    case "renting-private":
    case "renting-council":
      return "rent";
    case "family":
      return "family";
    case "other":
      return "other";
    default:
      return undefined;
  }
}

function amount(value?: string): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  return Number(value);
}

/** Maps the apply-finance answers onto the eligibility decision the result page already uses. */
export function toEligibilityAnswers(data: ApplicationData): EligibilityAnswers {
  const monthlyBudget = data.budgetBand ? BUDGET_MAP[data.budgetBand] : undefined;
  return {
    firstName: data.firstName?.trim(),
    surname: data.lastName?.trim(),
    email: data.email?.trim(),
    mobile: data.mobile?.trim(),
    dateOfBirth: data.dateOfBirth,
    postcode: data.postcode?.trim().toUpperCase(),
    addressLine: data.address?.trim(),
    monthlyIncome: amount(data.monthlyIncome),
    deposit: data.depositBand ? DEPOSIT_AMOUNTS[data.depositBand] : undefined,
    monthlyBudget,
    employment: mapEmployment(data.employmentStatusFull),
    housing: mapHousing(data.livingStatus),
    partExchange:
      data.hasPartExchange === "yes" || data.hasPartExchange === "no"
        ? data.hasPartExchange
        : undefined,
    marketingConsent: Boolean(data.marketingConsent),
    timeAtAddress: data.addressTenure === "over-3-years" ? 36 : undefined,
  };
}
