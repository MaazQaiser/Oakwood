import {
  AFTERSALES_SESSION_TTL_MS,
  BOOKING_SESSION_COOKIE,
  CLAIM_SESSION_COOKIE,
} from "@/features/aftersales/store";
import { DEAL_SESSION_COOKIE, DEAL_SESSION_TTL_MS } from "@/features/deal/store";
import {
  ELIGIBILITY_SESSION_COOKIE,
  SESSION_TTL_MS as ELIGIBILITY_SESSION_TTL_MS,
} from "@/features/eligibility/store";
import { PX_SESSION_COOKIE, PX_SESSION_TTL_MS } from "@/features/part-exchange/store";
import {
  RESERVATION_SESSION_COOKIE,
  RESERVATION_SESSION_TTL_MS,
} from "@/features/reservation/store";
import { reservationConfig } from "@/config/reservation";
import { routes } from "@/config/routes";
import { analyticsIntegrations } from "@/lib/api/integrations";
import {
  CALCULATOR_APPLICATION_EXPLAIN,
  CALCULATOR_APPLICATION_LABEL,
  CALCULATOR_CONTENT_DEPENDENCY_NOTE,
  CALCULATOR_ELIGIBILITY_EXPLAIN,
  CALCULATOR_ELIGIBILITY_LABEL,
  CALCULATOR_ESTIMATE_EXPLAIN,
  CALCULATOR_ESTIMATE_LABEL,
  CALCULATOR_REPRESENTATIVE_APR_UNAVAILABLE,
} from "@/lib/finance/calculator-copy";
import {
  DEAL_APPLICATION_BOUNDARY,
  DEAL_ILLUSTRATION_PERSONALISED,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
} from "@/lib/deal/copy";
import { MARKETING_CONSENT_WORDING, SOFT_SEARCH_DISCLAIMER } from "@/lib/eligibility/copy";
import { CONSENT_BANNER_WORDING, FINANCE_DISCLAIMER_MISSING } from "@/lib/legal/copy";
import {
  howItWorksSteps,
  introSupportingCopy,
  reservationCopy,
} from "@/lib/reservation/copy";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { COMPLAINTS_PROCEDURE_PENDING } from "@/lib/support/copy";
import { deliverySections, statusDisclosureCopy } from "@/lib/trust/content";
import { SUPPORT_CRM_NOTICE } from "@/lib/support/copy";
import type { LegalDocument, LegalHubItem } from "@/types/legal";

const amount = reservationAmountLabel(reservationConfig.amount);
const hold = formatHoldPeriod(reservationConfig.holdDurationDays);

function hoursFromMs(ms: number): string {
  return `${Math.round(ms / (60 * 60 * 1000))} hours`;
}

function related(
  items: Array<{ href: string; label: string }>,
): LegalDocument["related"] {
  return items;
}

export const termsDocument: LegalDocument = {
  slug: "terms",
  title: "Terms of use",
  path: routes.termsOfUse,
  canonicalPath: routes.termsOfUse,
  metaTitle: "Terms of use",
  metaDescription:
    "Terms of use for the Oakwood Motor Company website. Approved terms wording is published here when the legal content source supplies it.",
  hubLabel: "Terms of use",
  hubDescription: "Website terms. Approved wording is not in the content source yet.",
  missing: [
    "Approved Terms of Use document (heading hierarchy, sections, effective date, governing law, and website-use rules).",
  ],
  sections: [
    {
      id: "status",
      title: "What this page can say today",
      paragraphs: [
        "A complete Terms of Use document has not been supplied in the Oakwood legal content source.",
        "This page does not invent website-use rules, liability wording, or governing-law clauses.",
      ],
    },
  ],
  related: related([
    { href: routes.privacyPolicy, label: "Privacy policy" },
    { href: routes.cookiePolicy, label: "Cookie policy" },
    { href: routes.statusDisclosure, label: "Status disclosure" },
    { href: routes.contact, label: "Contact Oakwood" },
  ]),
};

export const privacyDocument: LegalDocument = {
  slug: "privacy",
  title: "Privacy policy",
  path: routes.privacyPolicy,
  canonicalPath: routes.privacyPolicy,
  metaTitle: "Privacy policy",
  metaDescription:
    "How the Oakwood Motor Company website currently handles personal data. Approved privacy-policy wording is published when the legal content source supplies it.",
  hubLabel: "Privacy policy",
  hubDescription:
    "How this website currently handles personal data, and where approved policy wording is still missing.",
  intro:
    "This page describes data handling that is actually implemented on this website. It is not a substitute for an approved Oakwood privacy policy.",
  missing: [
    "Approved Privacy Policy legal text.",
    "Legal bases for processing.",
    "Data retention periods.",
    "Documented DSAR and erasure procedure.",
    "Named processors, DPO, and ICO registration details.",
  ],
  sections: [
    {
      id: "personal-data",
      title: "Personal data collected on this website",
      paragraphs: [
        "Contact and complaint forms collect name, email, telephone and a message. Optional fields can include location, vehicle registration, stock reference, and an existing order or reservation reference.",
        "Finance eligibility collects the answers needed for a soft search, plus contact details used to return a result.",
        "Part exchange collects a registration and mileage to produce an estimated valuation.",
        "Reservation and deal journeys store the vehicle and deal context needed to continue those journeys.",
        "Aftersales booking and warranty-claim requests collect the vehicle and contact details needed to handle the request.",
        "Finance information is not requested on general contact forms.",
      ],
    },
    {
      id: "marketing-consent",
      title: "Marketing consent",
      paragraphs: [
        `Marketing emails use this wording: “${MARKETING_CONSENT_WORDING}”`,
        "That choice is separate from sending an enquiry or checking eligibility. It is unticked unless you opt in.",
        "On finance eligibility, the choice is stored with a timestamp, the method “eligibility_soft_search”, and the wording shown.",
        "On the contact form, the choice is stored with a timestamp, the method “contact_form”, and the same wording.",
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      paragraphs: [
        "GTM, GA4, Meta Pixel, Meta CAPI and Microsoft Clarity are specified for this project and are not implemented.",
        "This website does not load those tools. A cookie-preference control can record whether you would allow analytics or advertising cookies if they are connected later.",
      ],
    },
    {
      id: "finance-journey",
      title: "Finance journey",
      paragraphs: [
        SOFT_SEARCH_DISCLAIMER,
        "A regulated finance application happens later, when you build a deal on a specific vehicle. Eligibility is not that application.",
        "Finance-provider processing of a full application is not documented here because that integration is not live.",
      ],
    },
    {
      id: "third-parties",
      title: "Third-party services",
      paragraphs: [
        "The intended CRM is Eskimo. It is not live. Contact, complaint and similar records are stored until that CRM is connected.",
        SUPPORT_CRM_NOTICE,
        "Stripe is specified for reservation payments and is not implemented.",
        "Live chat, review hosting, vehicle lookup, part-exchange valuation APIs and the warranty engine are specified and not connected.",
        "Approved processor names, contracts and international-transfer wording are not in the legal content source.",
      ],
    },
    {
      id: "retention",
      title: "Data retention",
      paragraphs: [
        "Approved retention periods are not published.",
        "Journey session cookies currently expire with the session lengths listed in the cookie policy.",
        "Enquiry and complaint records currently exist only in the website’s in-memory store while the CRM is disconnected.",
      ],
    },
    {
      id: "rights",
      title: "Customer rights",
      paragraphs: [
        "A documented DSAR, correction and erasure procedure is not in the legal content source.",
        "You can contact Oakwood using the contact page or the Bury telephone number published on this website. This page does not invent statutory deadlines for those requests.",
      ],
    },
    {
      id: "storage",
      title: "Where this website does not store personal data",
      paragraphs: [
        "Submitted personal data is not written to URL parameters, localStorage or sessionStorage.",
        "Journey continuity uses httpOnly cookies that hold opaque session identifiers, not form contents.",
      ],
    },
  ],
  related: related([
    { href: routes.cookiePolicy, label: "Cookie policy" },
    { href: routes.contact, label: "Contact Oakwood" },
    { href: routes.statusDisclosure, label: "Status disclosure" },
  ]),
};

export const cookiesDocument: LegalDocument = {
  slug: "cookies",
  title: "Cookie policy",
  path: routes.cookiePolicy,
  canonicalPath: routes.cookiePolicy,
  metaTitle: "Cookie policy",
  metaDescription:
    "Cookies used on the Oakwood Motor Company website. Analytics and advertising tools are not connected.",
  hubLabel: "Cookie policy",
  hubDescription:
    "Cookies this website actually uses, and analytics tools that are not connected.",
  intro:
    "This page lists cookies that exist in the current implementation. It does not claim that analytics or advertising tools are in use.",
  missing: [
    "Approved Cookie Policy legal text.",
    "Legal wording for cookie duration, vendors, and PECR/GDPR cookie consent language beyond this implementation description.",
  ],
  sections: [
    {
      id: "necessary",
      title: "Necessary cookies currently used",
      paragraphs: [
        `${ELIGIBILITY_SESSION_COOKIE} keeps a finance eligibility journey going. The current implementation expires it after ${hoursFromMs(ELIGIBILITY_SESSION_TTL_MS)}.`,
        `${DEAL_SESSION_COOKIE} keeps a deal-builder journey going. The current implementation expires it after ${hoursFromMs(DEAL_SESSION_TTL_MS)}.`,
        `${RESERVATION_SESSION_COOKIE} keeps a reservation journey going. The current implementation expires it after ${hoursFromMs(RESERVATION_SESSION_TTL_MS)}.`,
        `${PX_SESSION_COOKIE} keeps a part-exchange valuation journey going. The current implementation expires it after ${hoursFromMs(PX_SESSION_TTL_MS)}.`,
        `${BOOKING_SESSION_COOKIE} keeps an aftersales booking request going. The current implementation expires it after ${hoursFromMs(AFTERSALES_SESSION_TTL_MS)}.`,
        `${CLAIM_SESSION_COOKIE} keeps a warranty-claim request going. The current implementation expires it after ${hoursFromMs(AFTERSALES_SESSION_TTL_MS)}.`,
        "oakwood_consent stores whether you have recorded a cookie preference. It does not store your name, email or telephone number.",
      ],
    },
    {
      id: "analytics-tools",
      title: "Analytics and advertising tools",
      paragraphs: [
        "These tools are named in the project integration list and are not implemented:",
        ...analyticsIntegrations.map(
          (item) => `${item.name}: ${item.purpose} Not connected.`,
        ),
        "This policy does not say those tools are used.",
      ],
    },
    {
      id: "consent",
      title: "Consent",
      paragraphs: [
        CONSENT_BANNER_WORDING,
        "Necessary cookies stay on because they run journeys you start. Analytics and advertising preferences stay off unless you turn them on in Privacy settings. Turning them on does not load unimplemented tools.",
        "Marketing emails are not controlled by this cookie banner. They use a separate, unticked form field.",
      ],
    },
  ],
  related: related([
    { href: routes.privacyPolicy, label: "Privacy policy" },
    { href: routes.legal, label: "Legal documents" },
  ]),
};

export const distanceSellingDocument: LegalDocument = {
  slug: "distance-selling",
  title: "Distance selling",
  path: routes.distanceSelling,
  canonicalPath: routes.distanceSelling,
  metaTitle: "Distance selling",
  metaDescription:
    "Distance-selling information for Oakwood Motor Company. Approved cooling-off and distance-selling wording is published when supplied.",
  hubLabel: "Distance selling",
  hubDescription:
    "Existing distance-selling URL. Approved cooling-off wording is not in the content source yet.",
  missing: [
    "Approved distance-selling / consumer-contracts cooling-off wording, timelines, and exceptions.",
  ],
  sections: [
    {
      id: "what-is-published",
      title: "What is already published",
      paragraphs: [
        deliverySections[2]?.body ??
          "Distance-selling rights, where they apply, are described on the distance selling page.",
      ],
    },
    {
      id: "what-is-missing",
      title: "What is not published",
      paragraphs: [
        "Approved statutory cooling-off rights, refund timelines, and exceptions for distance contracts have not been supplied.",
        "This page does not invent those rights.",
      ],
    },
  ],
  related: related([
    { href: routes.deliveryTerms, label: "Delivery terms" },
    { href: routes.cancellationRefund, label: "Cancellation and refund" },
    { href: routes.deliveryAndCollection, label: "Delivery and collection" },
  ]),
};

export const regulatoryDocument: LegalDocument = {
  slug: "regulatory",
  title: "Status disclosure",
  path: routes.statusDisclosure,
  canonicalPath: routes.statusDisclosure,
  metaTitle: statusDisclosureCopy.metaTitle,
  metaDescription: statusDisclosureCopy.metaDescription,
  hubLabel: "Regulatory disclosures",
  hubDescription:
    "Oakwood is a credit broker, not a lender. Finance figures on this website are illustrations until a full application.",
  intro: statusDisclosureCopy.description,
  missing: [
    FINANCE_DISCLAIMER_MISSING,
    "Approved representative APR / consumer-credit illustration wording.",
    "Further regulatory status wording beyond the published credit-broker sentence.",
  ],
  sections: [
    {
      id: "credit-broker",
      title: "Credit broker status",
      paragraphs: [statusDisclosureCopy.description],
    },
    {
      id: "illustrations",
      title: "How finance figures are labelled",
      paragraphs: [
        `${CALCULATOR_ESTIMATE_LABEL}: ${CALCULATOR_ESTIMATE_EXPLAIN}`,
        DEAL_ILLUSTRATION_REPRESENTATIVE,
        DEAL_ILLUSTRATION_PERSONALISED,
        CALCULATOR_REPRESENTATIVE_APR_UNAVAILABLE,
        CALCULATOR_CONTENT_DEPENDENCY_NOTE,
      ],
    },
    {
      id: "eligibility",
      title: "Eligibility",
      paragraphs: [
        `${CALCULATOR_ELIGIBILITY_LABEL}: ${CALCULATOR_ELIGIBILITY_EXPLAIN}`,
        SOFT_SEARCH_DISCLAIMER,
      ],
    },
    {
      id: "personalised-finance",
      title: "Personalised finance",
      paragraphs: [
        "If eligibility is successful, monthly figures can reflect a finance profile. That is still an illustration, not a guaranteed final rate.",
        DEAL_ILLUSTRATION_PERSONALISED,
      ],
    },
    {
      id: "regulated-application",
      title: "Regulated application",
      paragraphs: [
        `${CALCULATOR_APPLICATION_LABEL}: ${CALCULATOR_APPLICATION_EXPLAIN}`,
        DEAL_APPLICATION_BOUNDARY,
      ],
    },
    {
      id: "final-decision",
      title: "Final finance decision",
      paragraphs: [
        "A lender decision is not made on eligibility, the calculator, or a representative illustration.",
        "Oakwood does not invent lender names, guaranteed acceptance, or APRs that are not in approved content.",
      ],
    },
    {
      id: "complaints",
      title: "Complaints",
      paragraphs: [
        COMPLAINTS_PROCEDURE_PENDING,
        "Raise a complaint on the complaints page. That page is the source of truth for complaint handling on this website.",
      ],
    },
  ],
  related: related([
    { href: routes.finance, label: "Car finance" },
    { href: routes.complaints, label: "Complaints" },
    { href: routes.privacyPolicy, label: "Privacy policy" },
  ]),
};

export const vehiclePurchaseDocument: LegalDocument = {
  slug: "vehicle-purchase",
  title: "Vehicle purchase terms",
  path: routes.vehiclePurchaseTerms,
  canonicalPath: routes.vehiclePurchaseTerms,
  metaTitle: "Vehicle purchase terms",
  metaDescription:
    "Vehicle purchase terms for Oakwood Motor Company. Approved contractual wording is published when the legal content source supplies it.",
  hubLabel: "Purchase terms",
  hubDescription:
    "Intended purchase-contract page. Approved contractual terms are not in the content source yet.",
  missing: [
    "Approved vehicle purchase terms covering purchase, vehicle condition, payment, title, warranties as a contract, and other sale terms.",
  ],
  sections: [
    {
      id: "purchase",
      title: "Purchase",
      paragraphs: [
        "Approved purchase-contract wording has not been supplied. This page does not create a contract of sale.",
      ],
    },
    {
      id: "vehicle-condition",
      title: "Vehicle condition",
      paragraphs: [
        "Condition, MOT, provenance and preparation notes are listed on each vehicle page. Approved sale-contract condition clauses are not in the legal content source.",
      ],
    },
    {
      id: "payment",
      title: "Payment",
      paragraphs: [
        "Reservation payments are described in the reservation terms using the live reservation configuration. Full purchase-payment terms are not supplied.",
      ],
    },
    {
      id: "finance",
      title: "Finance",
      paragraphs: [
        statusDisclosureCopy.description,
        DEAL_APPLICATION_BOUNDARY,
      ],
    },
    {
      id: "reservation",
      title: "Reservation",
      paragraphs: [
        `A ${amount} reservation, where offered, is explained on the reservation terms page and uses the live reservation configuration.`,
      ],
    },
    {
      id: "collection-delivery",
      title: "Collection and delivery",
      paragraphs: deliverySections.map(
        (section) => `${section.title}: ${section.body}`,
      ),
    },
    {
      id: "cancellation",
      title: "Cancellation",
      paragraphs: [
        "Reservation refund and expiry behaviour is described on the cancellation and refund page using published reservation copy.",
        "Approved purchase-cancellation clauses and statutory-rights wording are not in the legal content source.",
      ],
    },
  ],
  related: related([
    { href: routes.reservationTerms, label: "Reservation terms" },
    { href: routes.cancellationRefund, label: "Cancellation and refund" },
    { href: routes.deliveryTerms, label: "Delivery terms" },
    { href: routes.statusDisclosure, label: "Status disclosure" },
  ]),
};

export const reservationDocument: LegalDocument = {
  slug: "reservation",
  title: "Reservation terms",
  path: routes.reservationTerms,
  canonicalPath: routes.reservationTerms,
  metaTitle: "Reservation terms",
  metaDescription: `How an Oakwood vehicle reservation works, including the ${amount} reservation, hold period and refund request copy already used on this website.`,
  hubLabel: "Reservation terms",
  hubDescription: `How the ${amount} reservation works, using the live reservation configuration and published reservation copy.`,
  intro: introSupportingCopy(reservationConfig.amount),
  missing: [
    "A solicitor-approved reservation/deposit terms document beyond the Platform Spec Addendum mechanics and published reservation copy.",
  ],
  sections: [
    {
      id: "amount",
      title: `The ${amount} reservation`,
      paragraphs: [
        `Pay ${amount} to hold this vehicle while you complete your purchase.`,
        reservationCopy.fullyRefundable + ".",
        reservationCopy.appliedToPurchase,
        `The vehicle is held for ${hold}.`,
      ],
    },
    {
      id: "how-it-works",
      title: "How a reservation works",
      paragraphs: howItWorksSteps(
        reservationConfig.amount,
        reservationConfig.holdDurationDays,
      ),
    },
    {
      id: "refund-request",
      title: "Requesting a refund",
      paragraphs: [
        reservationCopy.payAbove,
        reservationCopy.requestRefund,
        reservationCopy.refundSupporting,
      ],
    },
    {
      id: "expiry",
      title: "If the reservation expires",
      paragraphs: [
        `${reservationCopy.expiredHeading} ${reservationCopy.expiredSupporting}`,
        reservationConfig.automaticRefundOnExpiry
          ? "The live reservation configuration refunds automatically when a reservation expires."
          : "The live reservation configuration does not enable automatic refund on expiry.",
      ],
    },
    {
      id: "unavailable",
      title: "If the vehicle becomes unavailable",
      paragraphs: [
        `${reservationCopy.soldHeading} ${reservationCopy.soldSupporting}`,
        reservationConfig.sameDayRefundOnVehicleUnavailable
          ? "The live reservation configuration enables a same-day refund when the vehicle becomes unavailable."
          : "The live reservation configuration does not enable a same-day refund when the vehicle becomes unavailable.",
      ],
    },
    {
      id: "finance-unavailable",
      title: "If finance cannot be found",
      paragraphs: [
        `${reservationCopy.financeUnavailableHeading} ${reservationCopy.financeUnavailableSupporting}`,
        reservationConfig.sameDayRefundOnFinanceUnavailable
          ? "The live reservation configuration enables a same-day refund when finance cannot be found for the vehicle."
          : "The live reservation configuration does not enable a same-day refund when finance cannot be found.",
      ],
    },
  ],
  related: related([
    { href: routes.cancellationRefund, label: "Cancellation and refund" },
    { href: routes.vehiclePurchaseTerms, label: "Vehicle purchase terms" },
    { href: routes.usedCars, label: "Used cars" },
  ]),
};

export const cancellationDocument: LegalDocument = {
  slug: "cancellation-refund",
  title: "Cancellation and refund",
  path: routes.cancellationRefund,
  canonicalPath: routes.cancellationRefund,
  metaTitle: "Cancellation and refund",
  metaDescription:
    "How Oakwood reservation refunds, expiry and unavailable-vehicle cases are described in the published reservation copy.",
  hubLabel: "Cancellation and refund",
  hubDescription:
    "Reservation refund, expiry and unavailable-vehicle cases from the published reservation journey.",
  missing: [
    "Approved statutory cancellation rights and refund timelines outside the reservation journey.",
    "Approved distance-selling cooling-off wording.",
  ],
  sections: [
    {
      id: "reservation-refund",
      title: "Reservation refund request",
      paragraphs: [
        reservationCopy.payAbove,
        reservationCopy.refundHeading,
        reservationCopy.refundSupporting,
      ],
    },
    {
      id: "reservation-expiry",
      title: "Reservation expiry",
      paragraphs: [
        `${reservationCopy.expiredHeading} ${reservationCopy.expiredSupporting}`,
      ],
    },
    {
      id: "vehicle-unavailable",
      title: "Vehicle unavailable",
      paragraphs: [
        `${reservationCopy.soldHeading} ${reservationCopy.soldSupporting}`,
      ],
    },
    {
      id: "finance-declined",
      title: "Finance unavailable",
      paragraphs: [
        `${reservationCopy.financeUnavailableHeading} ${reservationCopy.financeUnavailableSupporting}`,
      ],
    },
    {
      id: "other",
      title: "Other cancellation scenarios",
      paragraphs: [
        "Approved wording for cancelling a completed vehicle purchase, or for statutory cooling-off outside the reservation journey, is not in the legal content source.",
        "This page does not invent those rights.",
      ],
    },
  ],
  related: related([
    { href: routes.reservationTerms, label: "Reservation terms" },
    { href: routes.distanceSelling, label: "Distance selling" },
    { href: routes.contact, label: "Contact Oakwood" },
  ]),
};

export const deliveryDocument: LegalDocument = {
  slug: "delivery",
  title: "Delivery terms",
  path: routes.deliveryTerms,
  canonicalPath: routes.deliveryTerms,
  metaTitle: "Delivery terms",
  metaDescription: deliveryCopyMeta(),
  hubLabel: "Delivery",
  hubDescription:
    "Collection and delivery information already published for Oakwood Bury and Chorley.",
  missing: [
    "Delivery regions.",
    "Delivery prices.",
    "Delivery timelines.",
    "Approved contractual customer-responsibility clauses beyond the published handover copy.",
  ],
  sections: deliverySections.map((section) => ({
    id: section.title.toLowerCase().replace(/\s+/g, "-"),
    title: section.title,
    paragraphs: [section.body],
  })),
  related: related([
    { href: routes.deliveryAndCollection, label: "Delivery and collection" },
    { href: routes.distanceSelling, label: "Distance selling" },
    { href: routes.vehiclePurchaseTerms, label: "Vehicle purchase terms" },
    { href: routes.locations, label: "Locations" },
  ]),
};

export const accessibilityDocument: LegalDocument = {
  slug: "accessibility",
  title: "Accessibility statement",
  path: routes.accessibility,
  canonicalPath: routes.accessibility,
  metaTitle: "Accessibility statement",
  metaDescription:
    "Accessibility on the Oakwood Motor Company website, including the WCAG 2.2 AA target and how to report an issue.",
  hubLabel: "Accessibility",
  hubDescription:
    "The accessibility standard this website is being built against, and how to report an issue.",
  missing: [
    "Approved Oakwood accessibility statement.",
    "Completed WCAG conformance assessment and documented known limitations from that assessment.",
  ],
  sections: [
    {
      id: "commitment",
      title: "Accessibility commitment",
      paragraphs: [
        "This website is being built so customers can use Oakwood journeys with assistive technologies and a keyboard.",
        "This page does not claim that a formal accessibility audit has been completed.",
      ],
    },
    {
      id: "standard",
      title: "Standard targeted",
      paragraphs: [
        "The interface target for this website is WCAG 2.2 AA.",
        "That is a target for the page UI. It is not a published conformance claim.",
      ],
    },
    {
      id: "limitations",
      title: "Known limitations",
      paragraphs: [
        "No completed accessibility assessment is published in the Oakwood content source, so this page does not list audited exceptions.",
        "Some third-party tools named in the project (including live chat and analytics) are not connected yet.",
      ],
    },
    {
      id: "reporting",
      title: "How to report an accessibility issue",
      paragraphs: [
        "Use the contact page or call the Bury showroom number published on this website.",
        "Describe the page you were using and what did not work. Approved SLA wording for accessibility reports is not in the content source.",
      ],
    },
  ],
  related: related([
    { href: routes.contact, label: "Contact Oakwood" },
    { href: routes.legal, label: "Legal documents" },
  ]),
};

function deliveryCopyMeta(): string {
  return "Collection from Oakwood Bury or Chorley, and delivery information where Oakwood has published it.";
}

export const legalDocuments: LegalDocument[] = [
  termsDocument,
  privacyDocument,
  cookiesDocument,
  reservationDocument,
  cancellationDocument,
  vehiclePurchaseDocument,
  deliveryDocument,
  distanceSellingDocument,
  regulatoryDocument,
  accessibilityDocument,
];

export const legalHubItems: LegalHubItem[] = [
  ...legalDocuments.map((document) => ({
    href: document.path,
    label: document.hubLabel,
    description: document.hubDescription,
  })),
  {
    href: routes.complaints,
    label: "Complaints",
    description:
      "How to raise a complaint. The complaints page is the source of truth for complaint handling.",
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((document) => document.slug === slug);
}

export function getLegalDocumentByPath(path: string): LegalDocument | undefined {
  return legalDocuments.find(
    (document) => document.path === path || document.canonicalPath === path,
  );
}

export const nestedLegalSlugs = [
  "vehicle-purchase",
  "reservation",
  "cancellation-refund",
  "delivery",
] as const;
