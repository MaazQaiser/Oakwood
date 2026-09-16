import {
  getBookingUrl,
  getEligibilityUrl,
  getFinanceCalculatorUrl,
  getFinanceIntentUrl,
  getUsedCarsUrl,
  routes,
} from "@/config/routes";
import {
  financeHubFaqs,
} from "@/lib/finance/intent/content";
import {
  motFailCopy,
  motFaqs,
  motWhenRequired,
  serviceFaqs,
  warrantyFaqs,
} from "@/lib/aftersales/content";
import { PX_INSPECTION_CAVEAT, PX_INTRO_SUPPORT } from "@/lib/part-exchange/copy";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { reservationCopy } from "@/lib/reservation/copy";
import { reservationConfig } from "@/config/reservation";
import { SOFT_SEARCH_DISCLAIMER } from "@/lib/eligibility/copy";
import { deliverySections, howItWorksCopy, howItWorksSteps } from "@/lib/trust/content";
import type {
  SupportComplaintCategory,
  SupportEnquiryType,
  SupportFaqCategory,
  SupportFaqItem,
  SupportPathway,
} from "@/types/support";

function faq(
  id: string,
  category: SupportFaqCategory,
  question: string,
  answer: string,
  link?: { href: string; hrefLabel: string },
): SupportFaqItem {
  return {
    id,
    category,
    question,
    answer,
    href: link?.href,
    hrefLabel: link?.hrefLabel,
  };
}

export const supportEnquiryTypes: Array<{
  value: SupportEnquiryType;
  label: string;
}> = [
  { value: "buying", label: "Buying a car" },
  { value: "finance", label: "Finance" },
  { value: "part-exchange", label: "Part exchange" },
  { value: "reservation", label: "Reservation" },
  { value: "servicing", label: "Servicing" },
  { value: "mot", label: "MOT" },
  { value: "warranty", label: "Warranty" },
  { value: "delivery", label: "Delivery or collection" },
  { value: "existing-order", label: "Existing order" },
  { value: "general", label: "General enquiry" },
];

export const supportComplaintCategories: Array<{
  value: SupportComplaintCategory;
  label: string;
}> = [
  { value: "buying", label: "Buying a car" },
  { value: "finance", label: "Finance" },
  { value: "reservation", label: "Reservation" },
  { value: "part-exchange", label: "Part exchange" },
  { value: "aftersales", label: "Servicing, MOT or warranty" },
  { value: "delivery", label: "Delivery or collection" },
  { value: "other", label: "Something else" },
];

export const supportFaqCategories: Array<{
  value: SupportFaqCategory;
  label: string;
}> = [
  { value: "buying", label: "Buying" },
  { value: "finance", label: "Finance" },
  { value: "vehicles", label: "Vehicles" },
  { value: "part-exchange", label: "Part exchange" },
  { value: "reservation", label: "Reservation" },
  { value: "delivery", label: "Delivery" },
  { value: "servicing", label: "Servicing" },
  { value: "mot", label: "MOT" },
  { value: "warranty", label: "Warranty" },
  { value: "journey", label: "Your journey" },
];

export const supportPathways: SupportPathway[] = [
  {
    href: `${routes.contact}#contact`,
    title: "Contact Oakwood",
    body: "Call, send a message, or request a callback.",
  },
  {
    href: routes.faq,
    title: "Frequently asked questions",
    body: "Published answers about buying, finance, reservations and aftersales.",
  },
  {
    href: routes.finance,
    title: "Finance help",
    body: "Eligibility, the calculator, HP and PCP — without a full application.",
  },
  {
    href: routes.howItWorks,
    title: "Buying a car",
    body: "How Oakwood’s finance-first buying journey works.",
  },
  {
    href: routes.partExchange,
    title: "Part exchange",
    body: "Get an estimated valuation and use equity towards a deposit.",
  },
  {
    href: getUsedCarsUrl(),
    title: "Reservations",
    body: "Reserve a car online. Terms are shown before you pay.",
  },
  {
    href: routes.service,
    title: "Servicing",
    body: "Book a service at Bury or Chorley.",
  },
  {
    href: routes.warranty,
    title: "Warranty",
    body: "Available cars include a 12-month warranty.",
  },
  {
    href: routes.complaints,
    title: "Complaints",
    body: "Raise a complaint online or by phone.",
  },
];

const reservationAmount = reservationAmountLabel(reservationConfig.amount);
const holdPeriod = formatHoldPeriod(reservationConfig.holdDurationDays);

export const supportFaqs: SupportFaqItem[] = [
  faq(
    "how-does-buying-work",
    "buying",
    "How does buying a car from Oakwood work?",
    `${howItWorksCopy.description} ${howItWorksSteps.map((step) => step.title).join(", then ")}.`,
    { href: routes.howItWorks, hrefLabel: "How it works" },
  ),
  faq(
    "do-i-need-an-account",
    "journey",
    "Do I need an account to check finance or send a message?",
    "No account is required to check finance eligibility or to send Oakwood a message.",
    { href: getEligibilityUrl(), hrefLabel: "Check my eligibility" },
  ),
  faq(
    "eligibility-credit-score",
    "finance",
    "Does checking my eligibility affect my credit score?",
    `${SOFT_SEARCH_DISCLAIMER} A regulated finance application happens later, when you build a deal on a specific vehicle.`,
    { href: getEligibilityUrl(), hrefLabel: "Check my eligibility" },
  ),
  ...financeHubFaqs.map((item, index) =>
    faq(
      `finance-hub-${index + 1}`,
      "finance",
      item.question,
      item.answer,
      { href: routes.finance, hrefLabel: "Car finance" },
    ),
  ),
  faq(
    "hp-explained",
    "finance",
    "How does HP car finance work?",
    "Hire Purchase spreads the amount you finance over a fixed term. You own the vehicle once all payments are made. Figures before a full application are illustrations.",
    { href: getFinanceIntentUrl("hp"), hrefLabel: "How HP works" },
  ),
  faq(
    "pcp-explained",
    "finance",
    "How does PCP car finance work?",
    "Personal Contract Purchase usually has a lower monthly illustration because an optional final payment is held back until the end of the agreement. Annual mileage is part of PCP.",
    { href: getFinanceIntentUrl("pcp"), hrefLabel: "How PCP works" },
  ),
  faq(
    "bad-credit-finance",
    "finance",
    "Can I get car finance with bad credit?",
    "A weaker credit history does not automatically mean there are no options, and it does not mean finance is guaranteed. Check eligibility to see a personalised finance profile.",
    { href: getFinanceIntentUrl("bad-credit"), hrefLabel: "Finance with bad credit" },
  ),
  faq(
    "finance-calculator",
    "finance",
    "Can I estimate a monthly payment without checking eligibility?",
    "Yes. The calculator is an estimate for planning. It is not eligibility and not a finance application.",
    { href: getFinanceCalculatorUrl(), hrefLabel: "Finance calculator" },
  ),
  faq(
    "choosing-a-car",
    "vehicles",
    "What information is listed on a vehicle page?",
    "Each vehicle page lists monthly and cash price, specification, location, MOT, provenance notes and the preparation work recorded for that car.",
    { href: getUsedCarsUrl(), hrefLabel: "Browse used cars" },
  ),
  faq(
    "px-value-deposit",
    "part-exchange",
    "How does my part-exchange value affect my deposit?",
    `${PX_INTRO_SUPPORT} Positive equity can be used towards the deposit. ${PX_INSPECTION_CAVEAT}`,
    { href: routes.partExchange, hrefLabel: "Part exchange" },
  ),
  faq(
    "reservation-amount",
    "reservation",
    `How does the ${reservationAmount} reservation work?`,
    `Pay ${reservationAmount} to hold the vehicle while you complete your purchase. ${reservationCopy.fullyRefundable}. ${reservationCopy.appliedToPurchase} The vehicle is held for ${holdPeriod}.`,
    { href: getUsedCarsUrl(), hrefLabel: "Browse cars to reserve" },
  ),
  faq(
    "reservation-refund",
    "reservation",
    "Can I get a refund on a reservation?",
    `${reservationCopy.payAbove} ${reservationCopy.requestRefund} The vehicle is released once the refund request is submitted.`,
  ),
  faq(
    "reservation-expired",
    "reservation",
    "What happens when a reservation expires?",
    `${reservationCopy.expiredHeading} ${reservationCopy.expiredSupporting}`,
  ),
  faq(
    "reservation-unavailable",
    "reservation",
    "What if the vehicle becomes unavailable?",
    `${reservationCopy.soldHeading} ${reservationCopy.soldSupporting}`,
  ),
  faq(
    "delivery-collection",
    "delivery",
    "Can I collect the car or have it delivered?",
    deliverySections.map((section) => `${section.title}: ${section.body}`).join(" "),
    { href: routes.deliveryAndCollection, hrefLabel: "Delivery and collection" },
  ),
  ...serviceFaqs.map((item, index) =>
    faq(`servicing-${index + 1}`, "servicing", item.question, item.answer, {
      href: getBookingUrl({ type: "service", source: "enquiry" }),
      hrefLabel: "Book a service",
    }),
  ),
  faq("mot-when", "mot", "When does my car need an MOT?", motWhenRequired, {
    href: routes.mot,
    hrefLabel: "MOT",
  }),
  ...motFaqs.map((item, index) =>
    faq(`mot-${index + 1}`, "mot", item.question, item.answer, {
      href: routes.mot,
      hrefLabel: "MOT",
    }),
  ),
  faq("mot-fail", "mot", "What happens if my car fails?", motFailCopy),
  ...warrantyFaqs.map((item, index) =>
    faq(`warranty-${index + 1}`, "warranty", item.question, item.answer, {
      href: routes.warranty,
      hrefLabel: "Warranty",
    }),
  ),
];

export function getSupportFaq(id: string): SupportFaqItem | undefined {
  return supportFaqs.find((item) => item.id === id);
}

export function faqsForCategory(
  category?: SupportFaqCategory,
): SupportFaqItem[] {
  if (!category) {
    return uniqueFaqs(supportFaqs);
  }
  return uniqueFaqs(supportFaqs.filter((item) => item.category === category));
}

function uniqueFaqs(items: SupportFaqItem[]): SupportFaqItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.question.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
