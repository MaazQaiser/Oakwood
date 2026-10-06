import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import {
  getRatesFromLabel,
  getZeroPercentLabel,
} from "@/lib/finance/representative-example";

export const HOME_FIND_HEADING = "Find your car";
export const HOME_BUDGET_HEADING = "Know your budget";
export const HOME_SEARCH_PLACEHOLDER = "try white Audi A3 petrol auto";
export const HOME_PART_EXCHANGE = "Part exchange";

export const HOME_PROOF_POINTS = [
  ">500 cars",
  "Every car AA inspected",
  "AA warranty available",
  "Two showrooms + own workshop",
] as const;

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

export const HOME_FINANCE_ELIGIBILITY =
  "Unsure on your APR? Find out in 60 seconds, no impact on your credit score";
export const HOME_FINANCE_BEAT_OFFER =
  "Already have a loan offer? See if we beat it.";

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
  src: undefined as string | undefined,
  alt: undefined as string | undefined,
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
