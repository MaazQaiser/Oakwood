import { getEligibilityUrl, routes } from "@/config/routes";
import type { ProcessStep, TrustPageCopy, TrustSection } from "@/types/trust";

export const CMS_TRUST_NOTICE =
  "Further company history, awards and policy detail will appear here when the trust content source is connected.";

export const aboutCopy: TrustPageCopy = {
  eyebrow: "About",
  title: "Oakwood Motor Company",
  description:
    "Oakwood is a finance-first used-car retailer with showrooms in Bury and Chorley.",
  metaTitle: "About",
  metaDescription:
    "About Oakwood Motor Company. Finance-first used cars in Bury and Chorley, with eligibility, deal building, part exchange and aftersales.",
};

export const aboutStory: TrustSection = {
  title: "Oakwood story",
  body: "Oakwood Motor Company helps customers find a used car that fits their monthly budget. We show finance figures first, then the car, so you can see what you can afford before you visit Bury or Chorley.",
};

export const aboutWhatWeDo: TrustSection = {
  title: "What we do",
  body: "Check finance eligibility without affecting your credit score, browse used cars and vans, build a deal, part-exchange your current car, reserve online, and book aftersales at our showrooms.",
};

export const aboutCustomerExperience: TrustSection = {
  title: "Customer experience",
  body: "You can start online and finish in the showroom, or continue the purchase digitally. Vehicle history, preparation notes and warranty information are listed with each car rather than held back for an enquiry.",
};

export const howItWorksCopy: TrustPageCopy = {
  eyebrow: "How it works",
  title: "Buy with finance first",
  description:
    "Know your monthly budget before you fall for a car. Then find stock that fits, build your deal, and reserve when you are ready.",
  metaTitle: "How it works",
  metaDescription:
    "How buying a used car with Oakwood works: check finance eligibility, find a car that fits, build your deal, part exchange, reserve, and collect or receive your car.",
};

export const howItWorksSteps: ProcessStep[] = [
  {
    number: "1",
    title: "Check your finance eligibility",
    copy: "Answer a short set of questions. Oakwood uses a soft search, so this will not affect your credit score.",
    href: getEligibilityUrl(),
    cta: "Check my eligibility",
  },
  {
    number: "2",
    title: "Find a car that fits your budget",
    copy: "Browse used cars with monthly figures first. If you have already checked eligibility, those figures follow you through the site.",
    href: routes.usedCars,
    cta: "Browse cars",
  },
  {
    number: "3",
    title: "Build your deal",
    copy: "Choose finance type, deposit, term and optional products on the deal builder. The illustration is indicative until a full application.",
    href: routes.finance,
    cta: "Car finance",
  },
  {
    number: "4",
    title: "Part exchange your car",
    copy: "Get an estimated valuation with your registration and mileage, then add it to the deal if you want to.",
    href: routes.partExchange,
    cta: "Part exchange",
  },
  {
    number: "5",
    title: "Reserve your car",
    copy: "Pay a reservation to hold the vehicle while you complete the purchase. Terms are shown before you pay.",
    href: routes.usedCars,
    cta: "Browse cars",
  },
  {
    number: "6",
    title: "Complete your purchase",
    copy: "Finish the finance application and any remaining paperwork. Oakwood is a credit broker, not a lender. Finance is subject to status.",
    href: routes.statusDisclosure,
    cta: "Status disclosure",
  },
  {
    number: "7",
    title: "Collect or receive your car",
    copy: "Collect from Bury or Chorley, or ask about delivery. Collection and delivery detail is listed where it has been published.",
    href: routes.deliveryAndCollection,
    cta: "Delivery and collection",
  },
];

export const whatToExpectCopy: TrustPageCopy = {
  eyebrow: "What to expect",
  title: "What happens when you buy with Oakwood",
  description:
    "A practical look at the steps before, during and after you buy, using the same journey as the rest of the site.",
  metaTitle: "What to expect",
  metaDescription:
    "What to expect when buying a used car from Oakwood: finance, choosing a car, part exchange, reservation, purchase, collection or delivery, and aftercare.",
};

export const whatToExpectSections: TrustSection[] = [
  {
    title: "Before you buy",
    body: "Check eligibility so you know a monthly range. You can browse without doing this, but representative figures are used until a finance profile exists.",
  },
  {
    title: "Choosing your car",
    body: "Each vehicle page lists monthly and cash price, specification, location, MOT, provenance notes and the preparation work recorded for that car.",
  },
  {
    title: "Finance",
    body: "Deal illustrations are indicative. A full application is required before finance can be agreed. Oakwood is a credit broker, not a lender.",
  },
  {
    title: "Part exchange",
    body: "An online valuation is an estimate. Settlement figures, if you have finance on your current car, change how much equity sits in the deal.",
  },
  {
    title: "Reservation",
    body: "A reservation holds the car for a stated period. Read the reservation terms before you pay. A reservation is not the completed purchase.",
  },
  {
    title: "Purchase",
    body: "You complete the remaining finance and purchase steps with Oakwood. Distance-selling rights, where they apply, are described on the legal pages.",
  },
  {
    title: "Collection or delivery",
    body: "You can collect from the showroom where the car is located. Delivery options and any charges are confirmed with you. Prices are not published here until the content source provides them.",
  },
  {
    title: "Aftercare",
    body: "Available cars include a 12-month warranty. Servicing, MOT and warranty claim requests can be started from Aftersales.",
  },
];

export const preparationCopy: TrustPageCopy = {
  eyebrow: "Our garage",
  title: "How Oakwood prepares cars",
  description:
    "Each car is prepared before it is offered for sale. The work recorded for that vehicle is listed on its page.",
  metaTitle: "Our garage",
  metaDescription:
    "How Oakwood Motor Company prepares used cars before sale. Recorded preparation is listed on each vehicle page.",
};

export const preparationSections: TrustSection[] = [
  {
    title: "What we publish today",
    body: "Where preparation has been recorded, the vehicle page can show the technician, date, tyre tread, brake measurements, cambelt status and diagnostic scan notes that Oakwood has stored for that car.",
  },
  {
    title: "What we do not claim here",
    body: "We do not publish a standard inspection count, a mechanical guarantee, or a certification scheme on this page. Those details are only shown when they exist on the individual vehicle or when the content source provides them.",
  },
];

export const aaStandardsCopy: TrustPageCopy = {
  eyebrow: "AA standards",
  title: "Vehicle history, shown on the page",
  description:
    "MOT, provenance, recalls and condition notes are shown with the car rather than held back for an enquiry.",
  metaTitle: "AA standards",
  metaDescription:
    "How Oakwood shows vehicle history, MOT, provenance and condition notes. Detailed AA scheme terms appear when the content source provides them.",
};

export const aaStandardsSections: TrustSection[] = [
  {
    title: "What you can see on a car page",
    body: "MOT history, provenance flags, outstanding recalls and condition notes are listed on the vehicle detail page when that information is on file.",
  },
  {
    title: "AA scheme detail",
    body: "Specific AA inspection counts, badges or scheme rules are not reproduced here until the trust content source is connected.",
  },
];

export const deliveryCopy: TrustPageCopy = {
  eyebrow: "Delivery and collection",
  title: "Collect in Bury or Chorley, or ask about delivery",
  description:
    "You can collect your car from the Oakwood showroom where it is located. Delivery is arranged with you where it is offered.",
  metaTitle: "Delivery and collection",
  metaDescription:
    "Collect your Oakwood car from Bury or Chorley, or ask about delivery. Handover details and any charges are confirmed with you.",
};

export const deliverySections: TrustSection[] = [
  {
    title: "Collection",
    body: "Collect from Oakwood Bury or Oakwood Chorley, matching the location shown on the vehicle page. Bring identification and any documents Oakwood asks for when the appointment is confirmed.",
  },
  {
    title: "Delivery",
    body: "If delivery is available for your purchase, Oakwood will confirm where we can deliver and what you need to do on the day. Delivery pricing and coverage are not published here until the content source provides them.",
  },
  {
    title: "Handover",
    body: "At handover we go through the car with you, including the documents listed on the vehicle page. Distance-selling rights, where they apply, are described on the distance selling page.",
  },
];

export const reviewsCopy: TrustPageCopy = {
  eyebrow: "Reviews",
  title: "Customer reviews",
  description:
    "Reviews will be shown by rating, location and date when the review provider is connected. Mixed ratings will be included.",
  metaTitle: "Our online reviews",
  metaDescription:
    "Customer reviews of Oakwood Motor Company in Bury and Chorley. Ratings, comments and location will appear when the review provider is connected.",
};

export const contactCopy: TrustPageCopy = {
  eyebrow: "Contact",
  title: "Contact Oakwood",
  description:
    "Call, request a callback, or visit Bury or Chorley. If we cannot take your call, leave a message and we will come back to you.",
  metaTitle: "Contact",
  metaDescription:
    "Contact Oakwood Motor Company in Bury and Chorley. Call 0161 762 1000, request a callback, or visit a showroom.",
};

export const statusDisclosureCopy: TrustPageCopy = {
  eyebrow: "Legal",
  title: "Status disclosure",
  description:
    "Oakwood Motor Company is a credit broker, not a lender. Finance is subject to status.",
  metaTitle: "Status disclosure",
  metaDescription:
    "Oakwood Motor Company is a credit broker, not a lender. Finance is subject to status. Further regulatory wording appears when the legal content source is connected.",
};
