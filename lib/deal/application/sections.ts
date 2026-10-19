import { DEAL_APPLICATION_CONFIG } from "@/config/deal-application";
import type {
  DealApplicationFormState,
  DealApplicationSectionId,
  DealFinanceApplicationDraft,
} from "@/types/deal-application";
import type { DealDecisionInput } from "@/types/deal";
import { APP_SECTION_TITLES } from "@/lib/deal/application/copy";

export type ApplicationSectionMeta = {
  id: DealApplicationSectionId;
  title: string;
  optional?: boolean;
};

/** Ordered sections honouring collect_bank_details admin toggle. */
export function getApplicationSections(
  collectBankDetails: typeof DEAL_APPLICATION_CONFIG.collectBankDetails = DEAL_APPLICATION_CONFIG.collectBankDetails,
): ApplicationSectionMeta[] {
  const sections: ApplicationSectionMeta[] = [
    { id: "personal", title: APP_SECTION_TITLES.personal },
    { id: "address", title: APP_SECTION_TITLES.address },
    { id: "employment", title: APP_SECTION_TITLES.employment },
    { id: "income", title: APP_SECTION_TITLES.income },
  ];

  if (collectBankDetails !== "off") {
    sections.push({
      id: "bank",
      title: APP_SECTION_TITLES.bank,
      optional: collectBankDetails === "optional",
    });
  }

  sections.push({ id: "licence", title: APP_SECTION_TITLES.licence });
  return sections;
}

export function emptyApplicationForm(): DealApplicationFormState {
  return {
    personal: {
      fullName: "",
      dateOfBirth: "",
      maritalStatus: "",
      email: "",
      phone: "",
    },
    addresses: [
      {
        line1: "",
        city: "",
        postcode: "",
        movedIn: "",
      },
    ],
    employment: [
      {
        status: "",
        employerName: "",
        jobTitle: "",
        started: "",
      },
    ],
    income: {
      grossAnnualIncome: "",
      monthlyOutgoings: "",
    },
    bank: {
      sortCode: "",
      accountNumber: "",
      yearsAtBank: "",
      monthsAtBank: "",
    },
    licence: {
      drivingLicenceNumber: "",
      consentToSearch: false,
    },
  };
}

/** Seed personal fields from an earlier soft-check / decision if present. */
export function seedApplicationFromDecision(
  decision?: DealDecisionInput,
): DealApplicationFormState {
  const form = emptyApplicationForm();
  if (!decision) return form;
  form.personal.fullName = decision.fullName || "";
  form.personal.dateOfBirth = decision.dateOfBirth || "";
  form.personal.email = "";
  form.personal.phone = "";
  if (decision.postcode || decision.addressLine) {
    form.addresses[0] = {
      line1: decision.addressLine || "",
      city: "",
      postcode: decision.postcode || "",
      movedIn: "",
    };
  }
  if (decision.employmentStatus) {
    const status = decision.employmentStatus.toLowerCase();
    if (
      status === "employed" ||
      status === "self-employed" ||
      status === "retired" ||
      status === "unemployed" ||
      status === "other"
    ) {
      form.employment[0]!.status = status;
    }
  }
  if (decision.yearlyIncome > 0) {
    form.income.grossAnnualIncome = decision.yearlyIncome;
  }
  return form;
}

export function initialApplicationDraft(
  existing?: DealFinanceApplicationDraft,
  decision?: DealDecisionInput,
): DealFinanceApplicationDraft {
  if (existing?.form) {
    return {
      section: existing.section ?? "personal",
      form: existing.form,
      result: existing.result,
      submitError: existing.submitError,
    };
  }
  return {
    section: "personal",
    form: seedApplicationFromDecision(decision),
  };
}
