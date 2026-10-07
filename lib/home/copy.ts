import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import {
  getRatesFromLabel,
  getZeroPercentLabel,
} from "@/lib/finance/representative-example";

export const HOME_HERO_HEADING = "Find the car that fits your life.";
export const HOME_HERO_DESCRIPTION =
  "Explore 500+ cars, all AA inspected and prepared by Oakwood.";
export const HOME_HERO_PRIMARY = "Find my car";
export const HOME_HERO_SECONDARY = "Browse all cars";

export const HOME_FIND_HEADING = "Find your car";
export const HOME_FIND_DESCRIPTION =
  "Search by make, model, body type or just describe what you're looking for.";
export const HOME_FIND_CTA = "Search";
export const HOME_BUDGET_HEADING = "Know your budget";
export const HOME_BUDGET_DESCRIPTION =
  "See cars that fit your monthly or total budget.";
export const HOME_BUDGET_FIELD = "Budget";
export const HOME_SEARCH_PLACEHOLDER = 'Try "white Audi A3 petrol auto"';
export const HOME_PART_EXCHANGE = "Part exchange";
export const HOME_PART_EXCHANGE_SUPPORT =
  "Get a valuation for your current car";

export const HOME_PROOF_ITEMS = [
  {
    lead: "500+ cars",
    detail: "In stock across our two locations",
  },
  {
    lead: "Every car AA inspected",
    detail: "Checked, prepared and ready to drive",
  },
  {
    lead: "6-month warranty included",
    detail: "AA warranty available up to 4 years",
  },
  {
    lead: "Two showrooms + own workshop",
    detail: "Bury and Chorley",
  },
] as const;

export const HOME_PROOF_POINTS = HOME_PROOF_ITEMS.map((item) => item.lead);

export const HOME_RATES_FROM_APR = FINANCE_CALCULATOR_CONFIG.ratesFromApr;
export const HOME_RATES_FROM = getRatesFromLabel(HOME_RATES_FROM_APR) ?? "";
export const HOME_RATES_FROM_SHORT = HOME_RATES_FROM_APR
  ? `Rates from ${HOME_RATES_FROM_APR}%`
  : "";
export const HOME_ZERO_PERCENT_AVAILABLE =
  FINANCE_CALCULATOR_CONFIG.zeroPercentOnSelectedCars === true;
export const HOME_ZERO_PERCENT =
  getZeroPercentLabel(HOME_ZERO_PERCENT_AVAILABLE) ?? "";
export const HOME_ZERO_PERCENT_SHORT =
  getZeroPercentLabel(HOME_ZERO_PERCENT_AVAILABLE, "short") ?? "";

export const HOME_FINANCE_ELIGIBILITY_TITLE = "Unsure on your APR?";
export const HOME_FINANCE_ELIGIBILITY_DESCRIPTION =
  "Find out in 60 seconds, with no impact on your credit score.";
export const HOME_FINANCE_ELIGIBILITY_CTA = "Check my eligibility";
export const HOME_FINANCE_ELIGIBILITY =
  `${HOME_FINANCE_ELIGIBILITY_TITLE} ${HOME_FINANCE_ELIGIBILITY_DESCRIPTION}`.trim();
export const HOME_FINANCE_RATES_SUPPORT =
  "Competitive finance options to suit you.";
export const HOME_FINANCE_RATES_CTA = "Calculate finance";
export const HOME_FINANCE_BEAT_TITLE = "Already have a loan offer?";
export const HOME_FINANCE_BEAT_DESCRIPTION = "See if we can beat it.";
export const HOME_FINANCE_BEAT_CTA = "Compare my offer";
export const HOME_FINANCE_BEAT_OFFER =
  `${HOME_FINANCE_BEAT_TITLE} ${HOME_FINANCE_BEAT_DESCRIPTION}`.trim();

export const HOME_REPRESENTATIVE_HEADING = "Finance that fits your budget.";
export const HOME_REPRESENTATIVE_DESCRIPTION =
  "Find a car you love and explore a payment option that works for you.";
export const HOME_REPRESENTATIVE_CTA = "Find cars from £200 a month";
export const HOME_REPRESENTATIVE_BUDGET_MONTHLY = 200;

export const HOME_META_TITLE = "Used cars in stock";
export const HOME_META_DESCRIPTION =
  "Find a used car in Oakwood stock, or search by monthly budget or total price. AA-inspected cars, two showrooms and our own workshop.";

export const HOME_WARRANTY_INCLUDED = "6-month warranty included";
export const HOME_WARRANTY_AA_UPGRADE =
  "AA warranty available — upgrade up to 4 years";

export const HOME_AFTERSALES_EYEBROW = "Aftersales";
export const HOME_AFTERSALES_HEADING =
  "MOT, servicing and mechanical support from Oakwood.";
export const HOME_AFTERSALES_SUPPORT =
  "Keep your car running after you buy.";
export const HOME_AFTERSALES_CTA = "Book a service";
export const HOME_AFTERSALES_WORKSHOP = "Own workshop · Bury and Chorley";

export const HOME_AFTERSALES_IMAGE = {
  label: "Workshop",
  intended: "Oakwood's own workshop",
  src: "/images/stock/dealership-01.jpg" as string | undefined,
  alt: "Vehicles being prepared at Oakwood" as string | undefined,
};

export const HOME_AFTERSALES_SERVICES = [
  { key: "mot", title: "MOT" },
  { key: "servicing", title: "Servicing" },
  { key: "diagnostics", title: "Diagnostics" },
  { key: "mechanical", title: "Full mechanical work" },
] as const;

export const HOME_AFTERSALES_REASSURANCE = [
  { key: "all-cars", title: "All cars welcome" },
  {
    key: "manufacturer",
    title: "Manufacturer servicing without affecting warranty",
  },
  { key: "service-plans", title: "Service plans" },
  { key: "mot-plans", title: "MOT plans" },
] as const;
