import { formatPounds } from "@/lib/format/money";
import {
  ADDRESS_TENURE_OPTIONS,
  JOINT_ADDRESS_TENURE_OPTIONS,
  BUDGET_OPTIONS,
  CAR_TYPE_OPTIONS,
  CREDIT_OPTIONS,
  DEPOSIT_OPTIONS,
  EMPLOYMENT_OPTIONS,
  JOINT_EMPLOYMENT_OPTIONS,
  JOINT_LIVING_OPTIONS,
  JOB_DURATION_OPTIONS,
  LICENCE_OPTIONS,
  LIVING_OPTIONS,
  PASSPORT_NATIONALITY_OPTIONS,
  RELATIONSHIP_OPTIONS,
  TIMEFRAME_OPTIONS,
  isWorkingStatus,
  optionLabel,
} from "@/lib/apply-finance/options";
import type { ApplicationData, ApplySectionId, ApplyStepId } from "@/types/apply-finance";

export interface ReviewRow {
  label: string;
  value: string;
  stepId: ApplyStepId;
}

export interface ReviewGroup {
  id: string;
  title: string;
  section: ApplySectionId;
  rows: ReviewRow[];
}

function money(value?: string): string {
  if (!value) return "";
  const amount = Number(value);
  return Number.isFinite(amount) ? formatPounds(amount) : "";
}

function dateLabel(value?: string): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function row(
  label: string,
  value: string | undefined,
  stepId: ApplyStepId,
): ReviewRow | null {
  if (!value) return null;
  return { label, value, stepId };
}

function compact(rows: Array<ReviewRow | null>): ReviewRow[] {
  return rows.filter((item): item is ReviewRow => item !== null);
}

export function getReviewGroups(data: ApplicationData): ReviewGroup[] {
  const passport =
    data.ukPassport === "yes"
      ? optionLabel(PASSPORT_NATIONALITY_OPTIONS, data.ukPassportNationality)
      : data.passportCountry;

  const groups: ReviewGroup[] = [
    {
      id: "personal",
      title: "Personal",
      section: "your-details",
      rows: compact([
        row(
          "Name",
          [data.firstName, data.lastName].filter(Boolean).join(" "),
          "name",
        ),
        row("Mobile", data.mobile, "mobile"),
        row("Email", data.email, "email"),
        row("Date of birth", dateLabel(data.dateOfBirth), "dob"),
        row(
          "Applying",
          data.jointApplicant === true
            ? "With someone else"
            : data.jointApplicant === false
              ? "Just me"
              : "",
          "joint-choice",
        ),
        row("Licence", optionLabel(LICENCE_OPTIONS, data.drivingLicence), "licence"),
        row(
          "UK passport",
          data.ukPassport === "yes" ? "Yes" : data.ukPassport === "no" ? "No" : "",
          "uk-passport",
        ),
        row("Passport", passport, data.ukPassport === "no" ? "passport-country" : "passport-nationality"),
      ]),
    },
    {
      id: "address",
      title: "Address",
      section: "address",
      rows: compact([
        row("Address", data.address, "address"),
        row("Time at address", optionLabel(ADDRESS_TENURE_OPTIONS, data.addressTenure), "address-duration"),
        row("Living situation", optionLabel(LIVING_OPTIONS, data.livingStatus), "living"),
        row("Previous address", data.previousAddress, "previous-address"),
        row(
          "Previous address dates",
          data.previousAddressMovedIn
            ? `${dateLabel(data.previousAddressMovedIn)} – ${dateLabel(data.previousAddressMovedOut)}`
            : "",
          "previous-address-duration",
        ),
      ]),
    },
    {
      id: "employment",
      title: "Employment",
      section: "employment",
      rows: compact([
        row("Status", optionLabel(EMPLOYMENT_OPTIONS, data.employmentStatusFull), "employment"),
        row(
          data.employmentStatusFull === "self-employed" ? "Business" : "Employer",
          data.employerName,
          "employer",
        ),
        row("Job title", data.jobTitle, "job-title"),
        row("Time in role", optionLabel(JOB_DURATION_OPTIONS, data.jobDuration), "job-duration"),
        row("Previous employer", data.previousEmployerName, "previous-employer"),
        row("Previous job title", data.previousJobTitle, "previous-job-title"),
        row("Previous role started", dateLabel(data.previousEmploymentStart), "previous-employment-start"),
        row("Previous role ended", dateLabel(data.previousEmploymentEnd), "previous-employment-end"),
      ]),
    },
    {
      id: "income",
      title: "Income",
      section: "finance",
      rows: compact([
        row("Monthly income", money(data.monthlyIncome), "income"),
        row("Other income", data.otherIncome ? money(data.otherIncome) : "None", "other-income"),
      ]),
    },
    {
      id: "vehicle",
      title: "Vehicle / Quick Start",
      section: "quick-start",
      rows: compact([
        row("Monthly payment", optionLabel(BUDGET_OPTIONS, data.budgetBand), "budget"),
        row("Credit", optionLabel(CREDIT_OPTIONS, data.creditRating), "credit-rating"),
        row("Deposit", optionLabel(DEPOSIT_OPTIONS, data.depositBand), "deposit"),
        row(
          "Part exchange",
          data.hasPartExchange === "yes" ? "Yes" : data.hasPartExchange === "no" ? "No" : "",
          "part-exchange-choice",
        ),
        row("Car", optionLabel(CAR_TYPE_OPTIONS, data.carType), "car-type"),
        row("When", optionLabel(TIMEFRAME_OPTIONS, data.purchaseTimeframe), "when"),
      ]),
    },
  ];

  if (data.jointApplicant) {
    groups.push({
      id: "joint",
      title: "Joint Applicant",
      section: "joint",
      rows: getJointReviewRows(data),
    });
  }

  if (data.hasPartExchange === "yes") {
    groups.push({
      id: "part-exchange",
      title: "Part Exchange",
      section: "part-exchange",
      rows: compact([
        row(
          "Registration",
          data.partExchangeRegUnknown
            ? "Not known"
            : data.partExchangeRegistration,
          "px-registration",
        ),
        row(
          "Mileage",
          data.partExchangeMileage ? `${Number(data.partExchangeMileage).toLocaleString("en-GB")} miles` : "",
          "px-mileage",
        ),
        row(
          "On finance",
          data.hasFinanceToSettle === "yes" ? "Yes" : data.hasFinanceToSettle === "no" ? "No" : "",
          "px-on-finance",
        ),
        row("Lender", data.partExchangeLender, "px-lender"),
        row("Monthly payment", money(data.partExchangeMonthlyPayment), "px-monthly-payment"),
        row(
          "Settlement",
          data.settlementAmount ? money(data.settlementAmount) : data.hasFinanceToSettle === "yes" ? "Not known" : "",
          "px-settlement",
        ),
      ]),
    });
  }

  return groups;
}

export function getJointReviewRows(data: ApplicationData): ReviewRow[] {
  return compact([
    row(
      "Name",
      [data.jointFirstName, data.jointLastName].filter(Boolean).join(" "),
      "ja-name",
    ),
    row("Date of birth", dateLabel(data.jointDateOfBirth), "ja-dob"),
    row("Relationship", optionLabel(RELATIONSHIP_OPTIONS, data.jointRelationship), "ja-relationship"),
    row("Address", data.jointAddress, "ja-address"),
    row(
      "Time at address",
      optionLabel(JOINT_ADDRESS_TENURE_OPTIONS, data.jointAddressTenure),
      "ja-address-duration",
    ),
    row("Previous address", data.jointPreviousAddress, "ja-previous-address"),
    row(
      "Previous address dates",
      data.jointPreviousMovedIn
        ? `${dateLabel(data.jointPreviousMovedIn)} – ${dateLabel(data.jointPreviousMovedOut)}`
        : "",
      "ja-previous-address-duration",
    ),
    row("Residential status", optionLabel(JOINT_LIVING_OPTIONS, data.jointLivingStatus), "ja-living"),
    row(
      "Employment",
      optionLabel(JOINT_EMPLOYMENT_OPTIONS, data.jointEmploymentStatusFull),
      "ja-employment",
    ),
    ...(isWorkingStatus(data.jointEmploymentStatusFull)
      ? [
          row(
            data.jointEmploymentStatusFull === "self-employed" ? "Business" : "Employer",
            data.jointEmployerName,
            "ja-employer",
          ),
          row("Job title", data.jointJobTitle, "ja-job-title"),
          row("Time in role", optionLabel(JOB_DURATION_OPTIONS, data.jointJobDuration), "ja-job-duration"),
          row("Previous employer", data.jointPreviousEmployerName, "ja-previous-employer"),
          row("Previous job title", data.jointPreviousJobTitle, "ja-previous-job-title"),
          row(
            "Previous role started",
            dateLabel(data.jointPreviousEmploymentStart),
            "ja-previous-employment-start",
          ),
          row(
            "Previous role ended",
            dateLabel(data.jointPreviousEmploymentEnd),
            "ja-previous-employment-end",
          ),
        ]
      : []),
    row("Monthly income", money(data.jointMonthlyIncome), "ja-income"),
    row("Mobile", data.jointMobile, "ja-mobile"),
    row("Email", data.jointEmail, "ja-email"),
  ]);
}
