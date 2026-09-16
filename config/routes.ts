import type { FinanceIntentSlug } from "@/types/finance";
import type { Vehicle } from "@/types/vehicle";

export type StockCategory = "cars" | "vans";

export type DealStep =
  | "configure"
  | "part-exchange"
  | "products"
  | "application"
  | "decision"
  | "confirmation";

export type ReservationStep =
  | "reserve"
  | "payment"
  | "success"
  | "failed"
  | "manage"
  | "refund";

export type EligibilityStep = "start" | "questions" | "result" | "resume";

export type LocationUrlVariant = "canonical" | "legacy";

export interface PendingRoute {
  key: string;
  label: string;
  url: null;
  status: "url-unconfirmed";
  notes: string;
}

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function stockBase(category: StockCategory = "cars"): "/used-cars" | "/used-vans" {
  return category === "vans" ? "/used-vans" : "/used-cars";
}

export const routes = {
  home: "/",

  usedCars: "/used-cars",
  usedVans: "/used-vans",
  search: "/search",

  locations: "/locations",
  locationLegacy: "/location",

  blog: "/blog",

  finance: "/finance.php",
  financeCalculator: "/finance.php/calculator",

  eligibility: "/finance-eligibility",
  eligibilityQuestions: "/finance-eligibility/questions",
  eligibilityResult: "/finance-eligibility/result",
  eligibilityResume: "/finance-eligibility/resume",

  deal: "/deal",
  dealResume: "/deal/resume",
  reserve: "/reserve",

  sellMyCar: "/sell-my-car",
  partExchange: "/partex.php",
  valuation: "/valuation",
  valuationResult: "/valuation/result",

  aftersales: "/aftersales",
  service: "/service",
  servicingAudi: "/servicing-audi.php",
  mot: "/mot",
  warranty: "/warranty",
  warrantyClaims: "/warranty-claims",
  booking: "/booking",

  about: "/about.php",
  ourGarage: "/our-garage.php",
  ourOnlineReviews: "/our-online-reviews.php",
  aaStandards: "/aa-standards.php",
  howItWorks: "/how-it-works",
  whatToExpect: "/what-to-expect",
  deliveryAndCollection: "/delivery-and-collection",
  contact: "/contact",
  faq: "/faq",
  complaints: "/complaints",

  getAQuote: "/get-a-quote.php",
  bookingEnquiry: "/booking_enquiry.php",
  compare: "/compare.php",
  referAFriend: "/refer-a-friend.php",

  termsOfUse: "/terms-of-use.php",
  privacyPolicy: "/privacy-policy.php",
  cookiePolicy: "/cookie-policy.php",
  distanceSelling: "/distance-selling.php",
  statusDisclosure: "/status-disclosure.php",
  complaintProcedure: "/complaint-procedure.php",

  legal: "/legal",
  accessibility: "/accessibility",
  vehiclePurchaseTerms: "/legal/vehicle-purchase",
  reservationTerms: "/legal/reservation",
  cancellationRefund: "/legal/cancellation-refund",
  deliveryTerms: "/legal/delivery",

  designSystem: "/design-system",
} as const;

export type ConfirmedRoute = (typeof routes)[keyof typeof routes];

export const pendingRoutes = {
  preparationStandards: {
    key: "preparation-standards",
    label: "Preparation standards",
    url: null,
    status: "url-unconfirmed",
    notes:
      "Trust/process page. SEO URL not confirmed. Live content is on /our-garage.php.",
  },
} as const satisfies Record<string, PendingRoute>;

export function getUsedCarsUrl(): string {
  return routes.usedCars;
}

export function getUsedVansUrl(): string {
  return routes.usedVans;
}

export function getSearchUrl(
  params?: Record<string, string | number | undefined>,
): string {
  if (!params) {
    return routes.search;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${routes.search}?${query}` : routes.search;
}

export function getMakeUrl(
  make: string,
  category: StockCategory = "cars",
): string {
  return `${stockBase(category)}/${slugify(make)}`;
}

export function getModelUrl(
  make: string,
  model: string,
  category: StockCategory = "cars",
): string {
  return `${stockBase(category)}/${slugify(make)}/${slugify(model)}`;
}

export function getLocationUrl(
  location: string,
  variant: LocationUrlVariant = "canonical",
): string {
  const slug = slugify(location);
  return variant === "legacy"
    ? `${routes.locationLegacy}/${slug}`
    : `${routes.locations}/${slug}`;
}

export function getLegacyLocationUrl(location: string): string {
  return getLocationUrl(location, "legacy");
}

export function getLocationStockUrl(location: string): string {
  return `${routes.usedCars}/location/${slugify(location)}`;
}

export function getLocationMakeUrl(location: string, make: string): string {
  return `${getLocationStockUrl(location)}/${slugify(make)}`;
}

export function getLocationModelUrl(
  location: string,
  make: string,
  model: string,
): string {
  return `${getLocationMakeUrl(location, make)}/${slugify(model)}`;
}

export function getVehicleUrl(
  vehicle: Pick<Vehicle, "slug"> | string,
): string {
  if (typeof vehicle === "string") {
    return vehicle.startsWith("/") ? vehicle : `/${vehicle}`;
  }

  return `/${vehicle.slug}`;
}

export function getFinanceIntentUrl(intent: FinanceIntentSlug | string): string {
  return `${routes.finance}/${slugify(intent)}`;
}

export function getFinanceCalculatorUrl(options?: { stockId?: string }): string {
  if (!options?.stockId) {
    return routes.financeCalculator;
  }

  const searchParams = new URLSearchParams({ vehicle: options.stockId });
  return `${routes.financeCalculator}?${searchParams.toString()}`;
}

export function getContactUrl(options?: {
  stockId?: string;
  topic?: string;
}): string {
  if (!options?.stockId && !options?.topic) {
    return routes.contact;
  }

  const searchParams = new URLSearchParams();
  if (options.stockId) {
    searchParams.set("vehicle", options.stockId);
  }
  if (options.topic) {
    searchParams.set("topic", options.topic);
  }

  return `${routes.contact}?${searchParams.toString()}`;
}

export function getFaqUrl(questionId?: string): string {
  return questionId ? `${routes.faq}#${questionId}` : routes.faq;
}

export function getLegalUrl(section?: string): string {
  return section ? `${routes.legal}#${section}` : routes.legal;
}

export function getEligibilityUrl(step: EligibilityStep = "start"): string {
  switch (step) {
    case "questions":
      return routes.eligibilityQuestions;
    case "result":
      return routes.eligibilityResult;
    case "resume":
      return routes.eligibilityResume;
    default:
      return routes.eligibility;
  }
}

export function getDealUrl(dealId: string, step: DealStep = "configure"): string {
  const base = `${routes.deal}/${dealId}`;

  switch (step) {
    case "part-exchange":
      return `${base}/part-exchange`;
    case "products":
      return `${base}/products`;
    case "application":
      return `${base}/application`;
    case "decision":
      return `${base}/decision`;
    case "confirmation":
      return `${base}/confirmation`;
    default:
      return base;
  }
}

export function getDealShareUrl(token: string): string {
  return `${routes.deal}/share/${token}`;
}

export function getDealResumeUrl(token?: string): string {
  const base = routes.dealResume;
  return token ? `${base}?token=${encodeURIComponent(token)}` : base;
}

export function getReserveUrl(
  vehicleId: string,
  step: ReservationStep = "reserve",
): string {
  const base = `${routes.reserve}/${vehicleId}`;

  switch (step) {
    case "payment":
      return `${base}/payment`;
    case "success":
      return `${base}/success`;
    case "failed":
      return `${base}/failed`;
    case "manage":
      return `${base}/manage`;
    case "refund":
      return `${base}/refund`;
    default:
      return base;
  }
}

export function getBlogPostUrl(slug: string): string {
  return `${routes.blog}/${slugify(slug)}`;
}

export function getBlogTopicUrl(topic?: string): string {
  if (!topic) {
    return routes.blog;
  }

  return `${routes.blog}?topic=${encodeURIComponent(topic)}`;
}

export function getValuationUrl(result = false): string {
  return result ? routes.valuationResult : routes.valuation;
}

export type AftersalesBookingType = "service" | "mot";

export type AftersalesBookingSource =
  | "aftersales"
  | "service"
  | "mot"
  | "vdp"
  | "px"
  | "deal"
  | "enquiry";

export function getBookingUrl(options?: {
  type?: AftersalesBookingType;
  source?: AftersalesBookingSource;
  location?: string;
}): string {
  if (!options) {
    return routes.booking;
  }

  const searchParams = new URLSearchParams();
  if (options.type) {
    searchParams.set("type", options.type);
  }
  if (options.source) {
    searchParams.set("source", options.source);
  }
  if (options.location) {
    searchParams.set("location", options.location);
  }

  const query = searchParams.toString();
  return query ? `${routes.booking}?${query}` : routes.booking;
}

export const legalRoutes = {
  hub: routes.legal,
  termsOfUse: routes.termsOfUse,
  privacyPolicy: routes.privacyPolicy,
  cookiePolicy: routes.cookiePolicy,
  distanceSelling: routes.distanceSelling,
  statusDisclosure: routes.statusDisclosure,
  complaintProcedure: routes.complaintProcedure,
  vehiclePurchaseTerms: routes.vehiclePurchaseTerms,
  reservationTerms: routes.reservationTerms,
  cancellationRefund: routes.cancellationRefund,
  deliveryTerms: routes.deliveryTerms,
  accessibility: routes.accessibility,
} as const;

export const trustRoutes = {
  about: routes.about,
  ourGarage: routes.ourGarage,
  ourOnlineReviews: routes.ourOnlineReviews,
  aaStandards: routes.aaStandards,
  howItWorks: routes.howItWorks,
  whatToExpect: routes.whatToExpect,
  deliveryAndCollection: routes.deliveryAndCollection,
} as const;

export const supportRoutes = {
  contact: routes.contact,
  faq: routes.faq,
  complaints: routes.complaints,
  complaintProcedure: routes.complaintProcedure,
  getAQuote: routes.getAQuote,
  bookingEnquiry: routes.bookingEnquiry,
} as const;

export const aftersalesRoutes = {
  hub: routes.aftersales,
  service: routes.service,
  servicingAudi: routes.servicingAudi,
  mot: routes.mot,
  warranty: routes.warranty,
  warrantyClaims: routes.warrantyClaims,
  booking: routes.booking,
  bookingEnquiry: routes.bookingEnquiry,
} as const;
