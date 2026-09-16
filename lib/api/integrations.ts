export interface IntegrationBoundary {
  name: string;
  implemented: false;
  purpose: string;
}

export const stripeIntegration: IntegrationBoundary = {
  name: "stripe",
  implemented: false,
  purpose: "Reservation card payments, refunds, webhooks, Apple Pay, Google Pay.",
};

export const financeProviderIntegration: IntegrationBoundary = {
  name: "finance-provider",
  implemented: false,
  purpose: "Soft search, quotation, regulated application, decisioned APR.",
};

export const autoconvertIntegration: IntegrationBoundary = {
  name: "autoconvert",
  implemented: false,
  purpose: "Eligibility journey routing.",
};

export const eskimoIntegration: IntegrationBoundary = {
  name: "eskimo",
  implemented: false,
  purpose: "CRM lead and customer record payload.",
};

export const vAutoStockIntegration: IntegrationBoundary = {
  name: "vautostock",
  implemented: false,
  purpose: "Inbound vehicle inventory feed.",
};

export const vaIntegration: IntegrationBoundary = {
  name: "va",
  implemented: false,
  purpose: "Vehicle documents, prep stage, readiness, publishing gate.",
};

export const warrantyEngineIntegration: IntegrationBoundary = {
  name: "warranty-engine",
  implemented: false,
  purpose: "Warranty pricing, coverage terms, and claims processing.",
};

export const aftersalesCmsIntegration: IntegrationBoundary = {
  name: "aftersales-cms",
  implemented: false,
  purpose: "Service inclusions, intervals, manufacturer schedules, and pricing.",
};

export const bookingDiaryIntegration: IntegrationBoundary = {
  name: "booking-diary",
  implemented: false,
  purpose: "Aftersales appointment availability, slot reservation, and confirmation.",
};

export const partExchangeApiIntegration: IntegrationBoundary = {
  name: "part-exchange-api",
  implemented: false,
  purpose: "Valuation and condition pricing.",
};

export const vehicleLookupIntegration: IntegrationBoundary = {
  name: "vehicle-lookup-api",
  implemented: false,
  purpose: "Registration lookup, rate limited and cached.",
};

export const liveChatIntegration: IntegrationBoundary = {
  name: "live-chat",
  implemented: false,
  purpose: "Managed live chat with CRM handover.",
};

export const locationCmsIntegration: IntegrationBoundary = {
  name: "location-cms",
  implemented: false,
  purpose: "Showroom addresses, opening hours, holiday exceptions, and local copy.",
};

export const reviewProviderIntegration: IntegrationBoundary = {
  name: "review-provider",
  implemented: false,
  purpose: "Aggregate ratings, review count, and location-specific review feed.",
};

export const analyticsIntegrations: IntegrationBoundary[] = [
  {
    name: "gtm",
    implemented: false,
    purpose: "Tag management.",
  },
  {
    name: "ga4",
    implemented: false,
    purpose: "Analytics.",
  },
  {
    name: "meta-pixel",
    implemented: false,
    purpose: "Paid social tracking.",
  },
  {
    name: "capi",
    implemented: false,
    purpose: "Server-side conversion tracking.",
  },
  {
    name: "microsoft-clarity",
    implemented: false,
    purpose: "Behavioural analytics.",
  },
];
