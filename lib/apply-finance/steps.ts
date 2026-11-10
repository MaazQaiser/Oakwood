import {
  ADDRESS_TENURE_OPTIONS,
  BUDGET_OPTIONS,
  CAR_TYPE_OPTIONS,
  CREDIT_OPTIONS,
  DEPOSIT_OPTIONS,
  EMPLOYMENT_OPTIONS,
  JOINT_ADDRESS_TENURE_OPTIONS,
  JOINT_EMPLOYMENT_OPTIONS,
  JOINT_LIVING_OPTIONS,
  JOINT_OPTIONS,
  JOB_DURATION_OPTIONS,
  LICENCE_OPTIONS,
  LIVING_OPTIONS,
  PASSPORT_NATIONALITY_OPTIONS,
  RELATIONSHIP_OPTIONS,
  TIMEFRAME_OPTIONS,
  YES_NO_OPTIONS,
  isWorkingStatus,
} from "@/lib/apply-finance/options";
import {
  hasText,
  isAdult,
  isEmail,
  isPastOrToday,
  isReasonableAmount,
  isUkMobile,
  normaliseMobile,
  normalisePostcode,
} from "@/lib/apply-finance/validators";
import type {
  ApplicationData,
  ApplyFieldErrors,
  ApplySectionId,
  ApplyStep,
  ApplyStepId,
} from "@/types/apply-finance";

export interface ApplySection {
  id: ApplySectionId;
  label: string;
}

const SECTIONS: {
  id: ApplySectionId;
  label: string;
  when?: (data: ApplicationData) => boolean;
}[] = [
  { id: "quick-start", label: "Quick Start" },
  { id: "your-details", label: "Your Details" },
  { id: "address", label: "Address" },
  { id: "employment", label: "Employment" },
  { id: "finance", label: "Finance Details" },
  {
    id: "joint",
    label: "Joint Applicant",
    when: (data) => data.jointApplicant === true,
  },
  {
    id: "part-exchange",
    label: "Part Exchange",
    when: (data) => data.hasPartExchange === "yes",
  },
  { id: "review", label: "Review" },
  { id: "decision", label: "Decision" },
];

function step(
  id: ApplyStepId,
  section: ApplySectionId,
  kind: ApplyStep["kind"],
  title: string,
  extra?: Pick<ApplyStep, "support" | "choices">,
): ApplyStep {
  return { id, section, kind, title, ...extra };
}

export function getStepperSections(data: ApplicationData): ApplySection[] {
  return SECTIONS.filter((section) => !section.when || section.when(data)).map(
    ({ id, label }) => ({ id, label }),
  );
}

export function getApplySteps(data: ApplicationData): ApplyStep[] {
  const steps: ApplyStep[] = [
    step("budget", "quick-start", "choice", "What monthly payment are you after?", {
      choices: BUDGET_OPTIONS,
    }),
    step("credit-rating", "quick-start", "choice", "How would you describe your credit?", {
      choices: CREDIT_OPTIONS,
    }),
    step("deposit", "quick-start", "choice", "How much deposit do you have?", {
      choices: DEPOSIT_OPTIONS,
    }),
    step(
      "part-exchange-choice",
      "quick-start",
      "choice",
      "Do you have a vehicle to part exchange?",
      { choices: YES_NO_OPTIONS },
    ),
    step("car-type", "quick-start", "choice", "What kind of car do you need?", {
      choices: CAR_TYPE_OPTIONS,
    }),
    step("when", "quick-start", "choice", "When do you need it?", {
      choices: TIMEFRAME_OPTIONS,
    }),
    step("name", "your-details", "form", "First, your name.", {
      support: "As it appears on your driving licence.",
    }),
    step("mobile", "your-details", "form", "Your mobile number."),
    step("email", "your-details", "form", "And your email."),
    step("dob", "your-details", "form", "Your date of birth.", {
      support: "You need to be 18 or over.",
    }),
    step("joint-choice", "your-details", "choice", "Applying", {
      choices: JOINT_OPTIONS,
    }),
    step("licence", "your-details", "choice", "What licence do you hold?", {
      choices: LICENCE_OPTIONS,
    }),
    step("uk-passport", "your-details", "choice", "Do you have a UK passport?", {
      choices: YES_NO_OPTIONS,
    }),
  ];

  if (data.ukPassport === "yes") {
    steps.push(
      step(
        "passport-nationality",
        "your-details",
        "choice",
        "What type of UK passport do you have?",
        { choices: PASSPORT_NATIONALITY_OPTIONS },
      ),
    );
  }
  if (data.ukPassport === "no") {
    steps.push(
      step("passport-country", "your-details", "form", "Which passport do you have?", {
        support: "For example, Poland, India, or France.",
      }),
    );
  }

  steps.push(
    step("address", "address", "address", "Where do you live?", {
      support: "Enter your postcode, then choose your address.",
    }),
    step(
      "address-duration",
      "address",
      "choice",
      "Have you lived at your current address for 3 years or more?",
      { choices: ADDRESS_TENURE_OPTIONS },
    ),
    step("living", "address", "choice", "What's your situation there?", {
      choices: LIVING_OPTIONS,
    }),
  );

  if (data.addressTenure === "under-3-years") {
    steps.push(
      step("previous-address", "address", "address", "Your previous address?"),
      step("previous-address-duration", "address", "form", "When did you live there?", {
        support: "Approximate dates are fine.",
      }),
    );
  }

  steps.push(
    step("employment", "employment", "choice", "What's your employment status?", {
      choices: EMPLOYMENT_OPTIONS,
    }),
  );

  if (isWorkingStatus(data.employmentStatusFull)) {
    steps.push(
      step("employer", "employment", "form", "Where do you work?"),
      step("job-title", "employment", "form", "What's your job title?"),
      step(
        "job-duration",
        "employment",
        "choice",
        data.employmentStatusFull === "self-employed"
          ? "How long have you been self-employed?"
          : "How long have you worked there?",
        { choices: JOB_DURATION_OPTIONS },
      ),
    );
    if (data.jobDuration === "under-3-months") {
      steps.push(
        step("previous-employer", "employment", "form", "Who was your previous employer?"),
        step("previous-job-title", "employment", "form", "What was your job title?"),
        step(
          "previous-employment-start",
          "employment",
          "form",
          "When did you start that role?",
        ),
        step("previous-employment-end", "employment", "form", "When did that role end?"),
      );
    }
  }

  steps.push(
    step("income", "finance", "form", "Your monthly income.", {
      support: "Before tax.",
    }),
    step("other-income", "finance", "form", "Any other regular income?", {
      support: "Overtime, benefits, or a second job. Leave this blank if there isn't any.",
    }),
  );

  if (data.jointApplicant) {
    steps.push(...jointSteps(data));
  }
  if (data.hasPartExchange === "yes") {
    steps.push(...partExchangeSteps(data));
  }

  steps.push(
    step("consent", "review", "confirm", "Review and submit", {
      support:
        "Check your answers, then send them for a soft search. This won't affect your credit score.",
    }),
  );

  return steps;
}

function jointSteps(data: ApplicationData): ApplyStep[] {
  const steps: ApplyStep[] = [
    step("ja-intro", "joint", "info", "Let's add your joint applicant", {
      support:
        "We'll ask for their details separately. They need to be 18 or over. Use their mobile number and email, not yours.",
    }),
    step("ja-name", "joint", "form", "What's their full name?"),
    step("ja-dob", "joint", "form", "What's their date of birth?", {
      support: "They need to be 18 or over.",
    }),
    step("ja-relationship", "joint", "choice", "What's their relationship to you?", {
      choices: RELATIONSHIP_OPTIONS,
    }),
    step("ja-address", "joint", "address", "Where do they live?", {
      support: "Enter their postcode, then choose their address.",
    }),
    step(
      "ja-address-duration",
      "joint",
      "choice",
      "Have they lived there for 3 years or more?",
      { choices: JOINT_ADDRESS_TENURE_OPTIONS },
    ),
  ];

  if (data.jointAddressTenure === "under-3-years") {
    steps.push(
      step("ja-previous-address", "joint", "address", "What's their previous address?"),
      step(
        "ja-previous-address-duration",
        "joint",
        "form",
        "When did they live there?",
        { support: "Approximate dates are fine." },
      ),
    );
  }

  steps.push(
    step("ja-living", "joint", "choice", "What's their residential status?", {
      choices: JOINT_LIVING_OPTIONS,
    }),
    step("ja-employment", "joint", "choice", "What's their employment status?", {
      choices: JOINT_EMPLOYMENT_OPTIONS,
    }),
  );

  if (isWorkingStatus(data.jointEmploymentStatusFull)) {
    steps.push(
      step("ja-employer", "joint", "form", "Where do they work?"),
      step("ja-job-title", "joint", "form", "What's their job title?"),
      step(
        "ja-job-duration",
        "joint",
        "choice",
        data.jointEmploymentStatusFull === "self-employed"
          ? "How long have they been self-employed?"
          : "How long have they worked there?",
        { choices: JOB_DURATION_OPTIONS },
      ),
    );
    if (data.jointJobDuration === "under-3-months") {
      steps.push(
        step(
          "ja-previous-employer",
          "joint",
          "form",
          "Who was their previous employer?",
        ),
        step("ja-previous-job-title", "joint", "form", "What was their job title?"),
        step(
          "ja-previous-employment-start",
          "joint",
          "form",
          "When did they start that role?",
        ),
        step(
          "ja-previous-employment-end",
          "joint",
          "form",
          "When did that role end?",
        ),
      );
    }
  }

  steps.push(
    step("ja-income", "joint", "form", "Their monthly gross income", {
      support: "Before tax.",
    }),
    step("ja-mobile", "joint", "form", "What's their mobile number?"),
    step("ja-email", "joint", "form", "What's their email address?"),
    step("ja-review", "joint", "confirm", "Check their details", {
      support: "These are the details we'll use for your joint applicant.",
    }),
  );

  return steps;
}

function partExchangeSteps(data: ApplicationData): ApplyStep[] {
  const steps: ApplyStep[] = [
    step("px-intro", "part-exchange", "info", "Tell us about your current car", {
      support: "An estimate is fine. We'll use this with your finance application.",
    }),
    step("px-registration", "part-exchange", "form", "What's the registration number?", {
      support: "Or tell us if you don't know the plate.",
    }),
    step("px-mileage", "part-exchange", "form", "What's the mileage?", {
      support: "An estimate is fine.",
    }),
    step(
      "px-on-finance",
      "part-exchange",
      "choice",
      "Is your vehicle currently on finance?",
      { choices: YES_NO_OPTIONS },
    ),
  ];

  if (data.hasFinanceToSettle === "yes") {
    steps.push(
      step("px-lender", "part-exchange", "form", "Who is the finance lender?"),
      step(
        "px-monthly-payment",
        "part-exchange",
        "form",
        "What's the current monthly payment?",
      ),
      step("px-settlement", "part-exchange", "form", "Do you know the settlement figure?", {
        support: "Leave this blank if you don't know it yet.",
      }),
    );
  }

  steps.push(
    step("px-complete", "part-exchange", "info", "Thank you.", {
      support: "That's everything we need on your current car. Next we'll review your answers.",
    }),
  );

  return steps;
}

export function choiceValue(id: ApplyStepId, data: ApplicationData): string | undefined {
  switch (id) {
    case "budget":
      return data.budgetBand;
    case "credit-rating":
      return data.creditRating;
    case "deposit":
      return data.depositBand;
    case "part-exchange-choice":
      return data.hasPartExchange;
    case "car-type":
      return data.carType;
    case "when":
      return data.purchaseTimeframe;
    case "joint-choice":
      if (data.jointApplicant === true) return "yes";
      if (data.jointApplicant === false) return "no";
      return undefined;
    case "licence":
      return data.drivingLicence;
    case "uk-passport":
      return data.ukPassport;
    case "passport-nationality":
      return data.ukPassportNationality;
    case "address-duration":
      return data.addressTenure;
    case "living":
      return data.livingStatus;
    case "employment":
      return data.employmentStatusFull;
    case "job-duration":
      return data.jobDuration;
    case "ja-relationship":
      return data.jointRelationship;
    case "ja-address-duration":
      return data.jointAddressTenure;
    case "ja-living":
      return data.jointLivingStatus;
    case "ja-employment":
      return data.jointEmploymentStatusFull;
    case "ja-job-duration":
      return data.jointJobDuration;
    case "px-on-finance":
      return data.hasFinanceToSettle;
    default:
      return undefined;
  }
}

export function commitChoice(
  id: ApplyStepId,
  data: ApplicationData,
  value: string,
): ApplicationData {
  switch (id) {
    case "budget":
      return { ...data, budgetBand: value };
    case "credit-rating":
      return { ...data, creditRating: value };
    case "deposit":
      return { ...data, depositBand: value };
    case "part-exchange-choice":
      return { ...data, hasPartExchange: value === "yes" ? "yes" : "no" };
    case "car-type":
      return { ...data, carType: value };
    case "when":
      return { ...data, purchaseTimeframe: value };
    case "joint-choice":
      return { ...data, jointApplicant: value === "yes" };
    case "licence":
      return { ...data, drivingLicence: value };
    case "uk-passport":
      return value === "yes"
        ? { ...data, ukPassport: "yes", passportCountry: undefined }
        : { ...data, ukPassport: "no", ukPassportNationality: undefined };
    case "passport-nationality":
      return { ...data, ukPassportNationality: value };
    case "address-duration":
      return { ...data, addressTenure: value };
    case "living":
      return { ...data, livingStatus: value };
    case "employment":
      return { ...data, employmentStatusFull: value };
    case "job-duration":
      return { ...data, jobDuration: value };
    case "ja-relationship":
      return { ...data, jointRelationship: value };
    case "ja-address-duration":
      return { ...data, jointAddressTenure: value };
    case "ja-living":
      return { ...data, jointLivingStatus: value };
    case "ja-employment":
      return { ...data, jointEmploymentStatusFull: value };
    case "ja-job-duration":
      return { ...data, jointJobDuration: value };
    case "px-on-finance":
      return { ...data, hasFinanceToSettle: value === "yes" ? "yes" : "no" };
    default:
      return data;
  }
}

function datePair(
  start: string | undefined,
  end: string | undefined,
  startKey: string,
  endKey: string,
  startLabel: string,
  endLabel: string,
): ApplyFieldErrors {
  const errors: ApplyFieldErrors = {};
  if (!isPastOrToday(start)) errors[startKey] = `Enter a valid ${startLabel}.`;
  if (!isPastOrToday(end)) errors[endKey] = `Enter a valid ${endLabel}.`;
  if (!errors[startKey] && !errors[endKey] && start && end && end <= start) {
    errors[endKey] = "The end date needs to be after the start date.";
  }
  return errors;
}

function addressErrors(
  postcode: string | undefined,
  address: string | undefined,
  postcodeKey: string,
  addressKey: string,
): ApplyFieldErrors {
  const errors: ApplyFieldErrors = {};
  if (!normalisePostcode(postcode)) errors[postcodeKey] = "Enter a valid UK postcode.";
  if (!hasText(address, 5)) errors[addressKey] = "Choose an address to continue.";
  return errors;
}

export function validateApplyStep(id: ApplyStepId, data: ApplicationData): ApplyFieldErrors {
  switch (id) {
    case "name":
      return {
        ...(!hasText(data.firstName) ? { firstName: "Enter your first name." } : {}),
        ...(!hasText(data.lastName) ? { lastName: "Enter your last name." } : {}),
      };
    case "ja-name":
      return {
        ...(!hasText(data.jointFirstName) ? { jointFirstName: "Enter their first name." } : {}),
        ...(!hasText(data.jointLastName) ? { jointLastName: "Enter their last name." } : {}),
      };
    case "mobile":
      return isUkMobile(data.mobile) ? {} : { mobile: "Enter a valid UK mobile number." };
    case "ja-mobile": {
      if (!isUkMobile(data.jointMobile)) {
        return { jointMobile: "Enter a valid UK mobile number." };
      }
      if (normaliseMobile(data.jointMobile) === normaliseMobile(data.mobile)) {
        return { jointMobile: "Use their mobile number, not yours." };
      }
      return {};
    }
    case "email":
      return isEmail(data.email) ? {} : { email: "Enter a valid email address." };
    case "ja-email": {
      if (!isEmail(data.jointEmail)) {
        return { jointEmail: "Enter a valid email address." };
      }
      if (data.jointEmail?.trim().toLowerCase() === data.email?.trim().toLowerCase()) {
        return { jointEmail: "Use their email address, not yours." };
      }
      return {};
    }
    case "dob":
      return isAdult(data.dateOfBirth)
        ? {}
        : { dateOfBirth: "You need to be 18 or over." };
    case "ja-dob":
      return isAdult(data.jointDateOfBirth)
        ? {}
        : { jointDateOfBirth: "They need to be 18 or over." };
    case "passport-country":
      return hasText(data.passportCountry)
        ? {}
        : { passportCountry: "Enter the country of the passport." };
    case "address":
      return addressErrors(data.postcode, data.address, "postcode", "address");
    case "previous-address":
      return addressErrors(
        data.previousPostcode,
        data.previousAddress,
        "previousPostcode",
        "previousAddress",
      );
    case "ja-address":
      return addressErrors(data.jointPostcode, data.jointAddress, "jointPostcode", "jointAddress");
    case "ja-previous-address":
      return addressErrors(
        data.jointPreviousPostcode,
        data.jointPreviousAddress,
        "jointPreviousPostcode",
        "jointPreviousAddress",
      );
    case "previous-address-duration":
      return datePair(
        data.previousAddressMovedIn,
        data.previousAddressMovedOut,
        "previousAddressMovedIn",
        "previousAddressMovedOut",
        "move-in date",
        "move-out date",
      );
    case "ja-previous-address-duration":
      return datePair(
        data.jointPreviousMovedIn,
        data.jointPreviousMovedOut,
        "jointPreviousMovedIn",
        "jointPreviousMovedOut",
        "move-in date",
        "move-out date",
      );
    case "employer":
      return hasText(data.employerName)
        ? {}
        : {
            employerName:
              data.employmentStatusFull === "self-employed"
                ? "Enter the business name."
                : "Enter the employer name.",
          };
    case "ja-employer":
      return hasText(data.jointEmployerName)
        ? {}
        : {
            jointEmployerName:
              data.jointEmploymentStatusFull === "self-employed"
                ? "Enter the business name."
                : "Enter the employer name.",
          };
    case "job-title":
      return hasText(data.jobTitle) ? {} : { jobTitle: "Enter your job title." };
    case "ja-job-title":
      return hasText(data.jointJobTitle) ? {} : { jointJobTitle: "Enter their job title." };
    case "previous-employer":
      return hasText(data.previousEmployerName)
        ? {}
        : { previousEmployerName: "Enter the previous employer." };
    case "ja-previous-employer":
      return hasText(data.jointPreviousEmployerName)
        ? {}
        : { jointPreviousEmployerName: "Enter their previous employer." };
    case "previous-job-title":
      return hasText(data.previousJobTitle)
        ? {}
        : { previousJobTitle: "Enter the previous job title." };
    case "ja-previous-job-title":
      return hasText(data.jointPreviousJobTitle)
        ? {}
        : { jointPreviousJobTitle: "Enter their previous job title." };
    case "previous-employment-start":
      return isPastOrToday(data.previousEmploymentStart)
        ? {}
        : { previousEmploymentStart: "Enter a valid start date." };
    case "previous-employment-end": {
      const errors: ApplyFieldErrors = {};
      const end = data.previousEmploymentEnd;
      if (!isPastOrToday(end)) {
        errors.previousEmploymentEnd = "Enter a valid end date.";
      } else if (end && data.previousEmploymentStart && end <= data.previousEmploymentStart) {
        errors.previousEmploymentEnd = "The end date needs to be after the start date.";
      }
      return errors;
    }
    case "ja-previous-employment-start":
      return isPastOrToday(data.jointPreviousEmploymentStart)
        ? {}
        : { jointPreviousEmploymentStart: "Enter a valid start date." };
    case "ja-previous-employment-end": {
      const errors: ApplyFieldErrors = {};
      const end = data.jointPreviousEmploymentEnd;
      if (!isPastOrToday(end)) {
        errors.jointPreviousEmploymentEnd = "Enter a valid end date.";
      } else if (end && data.jointPreviousEmploymentStart && end <= data.jointPreviousEmploymentStart) {
        errors.jointPreviousEmploymentEnd = "The end date needs to be after the start date.";
      }
      return errors;
    }
    case "income":
      return isReasonableAmount(data.monthlyIncome)
        ? {}
        : { monthlyIncome: "Enter your monthly income before tax." };
    case "other-income":
      return isReasonableAmount(data.otherIncome, false)
        ? {}
        : { otherIncome: "Enter a valid amount, or leave this blank." };
    case "ja-income":
      return isReasonableAmount(data.jointMonthlyIncome)
        ? {}
        : { jointMonthlyIncome: "Enter their monthly income before tax." };
    case "px-registration": {
      if (data.partExchangeRegUnknown) return {};
      const plate = data.partExchangeRegistration?.replace(/\s/g, "") ?? "";
      return /^[A-Za-z0-9]{2,8}$/.test(plate)
        ? {}
        : { partExchangeRegistration: "Enter the registration, or tick that you don't know it." };
    }
    case "px-mileage":
      return isReasonableAmount(data.partExchangeMileage)
        ? {}
        : { partExchangeMileage: "Enter the mileage." };
    case "px-lender":
      return hasText(data.partExchangeLender)
        ? {}
        : { partExchangeLender: "Enter the finance lender." };
    case "px-monthly-payment":
      return isReasonableAmount(data.partExchangeMonthlyPayment)
        ? {}
        : { partExchangeMonthlyPayment: "Enter the monthly payment." };
    case "px-settlement":
      return isReasonableAmount(data.settlementAmount, false)
        ? {}
        : { settlementAmount: "Enter a valid amount, or leave this blank." };
    case "consent": {
      const errors: ApplyFieldErrors = {};
      if (!data.termsAccepted) errors.termsAccepted = "Please accept the terms to continue.";
      if (!data.privacyAccepted) {
        errors.privacyAccepted = "Please accept the privacy policy to continue.";
      }
      return errors;
    }
    default:
      return {};
  }
}

export function nextStepId(
  steps: ApplyStep[],
  fromId: ApplyStepId,
  returnTo: ApplyStepId | null,
  knownStepIds: ApplyStepId[] | null,
): ApplyStepId | null {
  const index = steps.findIndex((item) => item.id === fromId);
  if (index < 0) return steps[0]?.id ?? null;

  if (returnTo && knownStepIds) {
    const returnIndex = steps.findIndex((item) => item.id === returnTo);
    const known = new Set(knownStepIds);
    if (returnIndex > index) {
      for (let cursor = index + 1; cursor < returnIndex; cursor += 1) {
        if (!known.has(steps[cursor].id)) return steps[cursor].id;
      }
      return returnTo;
    }
  }

  return steps[index + 1]?.id ?? null;
}
