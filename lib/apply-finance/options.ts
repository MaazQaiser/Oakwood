import type { ApplyChoice } from "@/types/apply-finance";

export const BUDGET_OPTIONS: ApplyChoice[] = [
  { value: "under-150", label: "Under £150" },
  { value: "150-200", label: "£150–£200" },
  { value: "200-300", label: "£200–£300" },
  { value: "300-400", label: "£300–£400" },
  { value: "400-plus", label: "£400+" },
  {
    value: "unsure",
    label: "I'm not sure yet — show me what I can afford",
    quiet: true,
  },
];

export const CREDIT_OPTIONS: ApplyChoice[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
  { value: "refused", label: "I've been refused before" },
];

export const DEPOSIT_OPTIONS: ApplyChoice[] = [
  { value: "0", label: "£0 Deposit" },
  { value: "under-500", label: "Under £500" },
  { value: "500-1000", label: "£500–£1,000" },
  { value: "1000-1500", label: "£1,000–£1,500" },
  { value: "1500-2500", label: "£1,500–£2,500" },
  { value: "2500-plus", label: "£2,500+" },
];

export const YES_NO_OPTIONS: ApplyChoice[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const CAR_TYPE_OPTIONS: ApplyChoice[] = [
  { value: "small", label: "Small car" },
  { value: "family", label: "Family car or estate" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van or pickup" },
  { value: "unsure", label: "Not sure yet" },
];

export const TIMEFRAME_OPTIONS: ApplyChoice[] = [
  { value: "this-week", label: "This week" },
  { value: "within-a-month", label: "Within a month" },
  { value: "1-3-months", label: "1 to 3 months" },
  { value: "looking", label: "Just looking for now" },
];

export const JOINT_OPTIONS: ApplyChoice[] = [
  { value: "no", label: "Just me" },
  { value: "yes", label: "With someone else" },
];

export const LICENCE_OPTIONS: ApplyChoice[] = [
  { value: "full-uk", label: "Full UK licence" },
  { value: "provisional", label: "Provisional licence" },
  { value: "eu-international", label: "EU or international licence" },
  { value: "none", label: "No licence" },
];

export const PASSPORT_NATIONALITY_OPTIONS: ApplyChoice[] = [
  { value: "british-citizen", label: "British citizen" },
  { value: "botc", label: "British overseas territories citizen (BOTC)" },
  { value: "boc", label: "British overseas citizen (BOC)" },
  { value: "british-subject", label: "British subject" },
  { value: "bno", label: "British national (overseas) (BN(O))" },
  { value: "bpp", label: "British protected person (BPP)" },
];

export const ADDRESS_TENURE_OPTIONS: ApplyChoice[] = [
  {
    value: "over-3-years",
    label: "Yes, I've lived here for 3 years or more",
  },
  {
    value: "under-3-years",
    label: "No, I've moved within the last 3 years",
  },
];

export const JOINT_ADDRESS_TENURE_OPTIONS: ApplyChoice[] = [
  {
    value: "over-3-years",
    label: "Yes, they've lived there for 3 years or more",
  },
  {
    value: "under-3-years",
    label: "No, they've moved within the last 3 years",
  },
];

export const LIVING_OPTIONS: ApplyChoice[] = [
  { value: "homeowner-mortgage", label: "Homeowner with a mortgage" },
  { value: "homeowner", label: "Homeowner, no mortgage" },
  { value: "renting-private", label: "Renting privately" },
  { value: "renting-council", label: "Renting from council or housing association" },
  { value: "family", label: "Living with parents or family" },
  { value: "other", label: "Other" },
];

export const EMPLOYMENT_OPTIONS: ApplyChoice[] = [
  { value: "employed-full-time", label: "Employed full time" },
  { value: "employed-part-time", label: "Employed part time" },
  { value: "self-employed", label: "Self employed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
  { value: "receiving-benefits", label: "Receiving benefits" },
  { value: "homemaker", label: "Homemaker" },
];

export const JOB_DURATION_OPTIONS: ApplyChoice[] = [
  { value: "over-3-years", label: "Over 3 years" },
  { value: "1-3-years", label: "1–3 years" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "under-3-months", label: "Under 3 months" },
];

export const RELATIONSHIP_OPTIONS: ApplyChoice[] = [
  { value: "husband-wife", label: "Husband / Wife" },
  { value: "partner", label: "Partner" },
  { value: "parent", label: "Parent" },
  { value: "family", label: "Family Member" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

export const JOINT_LIVING_OPTIONS: ApplyChoice[] = [
  { value: "homeowner", label: "Homeowner" },
  { value: "mortgage", label: "Mortgage" },
  { value: "renting", label: "Renting" },
  { value: "family", label: "Living with Parents" },
  { value: "other", label: "Other" },
];

export const JOINT_EMPLOYMENT_OPTIONS: ApplyChoice[] = [
  { value: "employed-full-time", label: "Full Time" },
  { value: "employed-part-time", label: "Part Time" },
  { value: "self-employed", label: "Self Employed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "receiving-benefits", label: "Benefits" },
  { value: "other", label: "Other" },
];

export function optionLabel(options: ApplyChoice[], value?: string): string {
  if (!value) return "";
  return options.find((option) => option.value === value)?.label ?? value;
}

export function isWorkingStatus(status?: string): boolean {
  return (
    status === "employed-full-time" ||
    status === "employed-part-time" ||
    status === "self-employed"
  );
}
