import { DEAL_APPLICATION_CONFIG } from "@/config/deal-application";
import type {
  DealApplicationAddress,
  DealApplicationEmployment,
  DealApplicationFormState,
  DealApplicationSectionId,
} from "@/types/deal-application";

export type SectionErrors = Record<string, string>;

function monthsBetween(fromYm: string, toYm: string): number {
  const [fy, fm] = fromYm.split("-").map(Number);
  const [ty, tm] = toYm.split("-").map(Number);
  if (!fy || !fm || !ty || !tm) return 0;
  return (ty - fy) * 12 + (tm - fm);
}

function nowYm(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Rough coverage check for ~3 years of history. */
export function historyCoversThreeYears(
  entries: Array<{ start: string; end?: string }>,
): boolean {
  if (!entries.length || !entries[0]?.start) return false;
  let total = 0;
  const today = nowYm();
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (!entry?.start) continue;
    const end = entry.end || (i === 0 ? today : entries[i - 1]?.start);
    if (!end) continue;
    total += Math.max(0, monthsBetween(entry.start, end));
  }
  return total >= 36;
}

function validatePersonal(form: DealApplicationFormState): SectionErrors {
  const errors: SectionErrors = {};
  const { personal } = form;
  if (personal.fullName.trim().split(/\s+/).length < 2) {
    errors.fullName = "Enter your first and last name.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(personal.dateOfBirth)) {
    errors.dateOfBirth = "Enter your date of birth.";
  } else {
    const dob = new Date(personal.dateOfBirth);
    const age =
      new Date().getFullYear() -
      dob.getFullYear() -
      (new Date() <
      new Date(new Date().getFullYear(), dob.getMonth(), dob.getDate())
        ? 1
        : 0);
    if (age < 18) {
      errors.dateOfBirth = "You must be 18 or over to apply for finance.";
    }
  }
  if (!personal.maritalStatus) {
    errors.maritalStatus = "Choose your marital status.";
  }
  if (!/^\S+@\S+\.\S+$/.test(personal.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (personal.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a UK phone number.";
  }
  return errors;
}

function validateAddressEntry(
  address: DealApplicationAddress,
  index: number,
  requireMovedOut: boolean,
): SectionErrors {
  const prefix = `address-${index}`;
  const errors: SectionErrors = {};
  if (address.line1.trim().length < 3) {
    errors[`${prefix}-line1`] = "Enter the first line of the address.";
  }
  if (address.city.trim().length < 2) {
    errors[`${prefix}-city`] = "Enter the town or city.";
  }
  if (address.postcode.replace(/\s/g, "").length < 5) {
    errors[`${prefix}-postcode`] = "Enter a full UK postcode.";
  }
  if (!/^\d{4}-\d{2}$/.test(address.movedIn)) {
    errors[`${prefix}-movedIn`] = "Enter the month you moved in.";
  }
  if (requireMovedOut && !/^\d{4}-\d{2}$/.test(address.movedOut ?? "")) {
    errors[`${prefix}-movedOut`] = "Enter the month you moved out.";
  }
  return errors;
}

function validateAddress(form: DealApplicationFormState): SectionErrors {
  let errors: SectionErrors = {};
  form.addresses.forEach((address, index) => {
    errors = {
      ...errors,
      ...validateAddressEntry(address, index, index > 0),
    };
  });
  const covered = historyCoversThreeYears(
    form.addresses.map((a, i) => ({
      start: a.movedIn,
      end: i === 0 ? undefined : a.movedOut,
    })),
  );
  if (!covered && Object.keys(errors).length === 0) {
    errors.history =
      "Add previous addresses until we have about three years of history.";
  }
  return errors;
}

function validateEmploymentEntry(
  job: DealApplicationEmployment,
  index: number,
  requireEnded: boolean,
): SectionErrors {
  const prefix = `job-${index}`;
  const errors: SectionErrors = {};
  if (index === 0 && !job.status) {
    errors[`${prefix}-status`] = "Choose your employment status.";
  }
  if (
    job.status === "employed" ||
    job.status === "self-employed" ||
    index > 0
  ) {
    if (job.employerName.trim().length < 2) {
      errors[`${prefix}-employer`] = "Enter the employer or business name.";
    }
  }
  if (!/^\d{4}-\d{2}$/.test(job.started)) {
    errors[`${prefix}-started`] = "Enter the month this role started.";
  }
  if (requireEnded && !/^\d{4}-\d{2}$/.test(job.ended ?? "")) {
    errors[`${prefix}-ended`] = "Enter the month this role ended.";
  }
  return errors;
}

function validateEmployment(form: DealApplicationFormState): SectionErrors {
  let errors: SectionErrors = {};
  form.employment.forEach((job, index) => {
    errors = {
      ...errors,
      ...validateEmploymentEntry(job, index, index > 0),
    };
  });
  const current = form.employment[0];
  const needsHistory =
    current?.status === "employed" || current?.status === "self-employed";
  if (needsHistory) {
    const covered = historyCoversThreeYears(
      form.employment.map((j, i) => ({
        start: j.started,
        end: i === 0 ? undefined : j.ended,
      })),
    );
    if (!covered && Object.keys(errors).length === 0) {
      errors.history =
        "Add previous employment until we have about three years of history.";
    }
  }
  return errors;
}

function validateIncome(form: DealApplicationFormState): SectionErrors {
  const errors: SectionErrors = {};
  const income =
    typeof form.income.grossAnnualIncome === "number"
      ? form.income.grossAnnualIncome
      : Number(form.income.grossAnnualIncome);
  const outgoings =
    typeof form.income.monthlyOutgoings === "number"
      ? form.income.monthlyOutgoings
      : Number(form.income.monthlyOutgoings);
  if (!Number.isFinite(income) || income <= 0) {
    errors.grossAnnualIncome = "Enter your gross annual income.";
  }
  if (!Number.isFinite(outgoings) || outgoings < 0) {
    errors.monthlyOutgoings = "Enter your monthly outgoings.";
  }
  return errors;
}

function bankIsEmpty(form: DealApplicationFormState): boolean {
  const bank = form.bank;
  if (!bank) return true;
  return (
    !bank.sortCode.replace(/\D/g, "") &&
    !bank.accountNumber.replace(/\D/g, "") &&
    bank.yearsAtBank === "" &&
    bank.monthsAtBank === ""
  );
}

function validateBank(
  form: DealApplicationFormState,
  mode = DEAL_APPLICATION_CONFIG.collectBankDetails,
): SectionErrors {
  if (mode === "off") return {};
  if (mode === "optional" && bankIsEmpty(form)) return {};

  const errors: SectionErrors = {};
  const bank = form.bank;
  const sort = bank?.sortCode.replace(/\D/g, "") ?? "";
  const account = bank?.accountNumber.replace(/\D/g, "") ?? "";
  if (sort.length !== 6) {
    errors.sortCode = "Enter a 6-digit sort code.";
  }
  if (account.length !== 8) {
    errors.accountNumber = "Enter an 8-digit account number.";
  }
  if (bank?.yearsAtBank === "" || bank?.monthsAtBank === "") {
    errors.timeAtBank = "Tell us how long you've been with this bank.";
  }
  return errors;
}

function validateLicence(form: DealApplicationFormState): SectionErrors {
  const errors: SectionErrors = {};
  const licence = form.licence.drivingLicenceNumber.replace(/\s/g, "");
  if (licence.length < 10) {
    errors.drivingLicenceNumber = "Enter your driving licence number.";
  }
  if (!form.licence.consentToSearch) {
    errors.consentToSearch = "Confirm consent to continue.";
  }
  return errors;
}

export function validateSection(
  section: DealApplicationSectionId,
  form: DealApplicationFormState,
): SectionErrors {
  switch (section) {
    case "personal":
      return validatePersonal(form);
    case "address":
      return validateAddress(form);
    case "employment":
      return validateEmployment(form);
    case "income":
      return validateIncome(form);
    case "bank":
      return validateBank(form);
    case "licence":
      return validateLicence(form);
    default:
      return {};
  }
}

export function bankDetailsProvided(form: DealApplicationFormState): boolean {
  if (DEAL_APPLICATION_CONFIG.collectBankDetails === "off") return false;
  return !bankIsEmpty(form);
}
