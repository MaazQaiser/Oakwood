import { getFinanceIntentUrl, routes } from "@/config/routes";

export interface NavigationItem {
  id: string;
  label: string;
  href: string | null;
  pending?: boolean;
  notes?: string;
}

export interface NavigationGroup {
  id: string;
  label: string;
  href?: string | null;
  children: NavigationItem[];
}

export const primaryNavigation: NavigationGroup[] = [
  {
    id: "cars",
    label: "Cars",
    href: routes.usedCars,
    children: [
      { id: "used-cars", label: "Used cars", href: routes.usedCars },
      { id: "used-vans", label: "Used vans", href: routes.usedVans },
      { id: "search", label: "Search cars", href: routes.search },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    href: routes.finance,
    children: [
      {
        id: "eligibility",
        label: "Check my eligibility",
        href: routes.eligibility,
      },
      {
        id: "deal",
        label: "Build my deal",
        href: routes.deal,
      },
      {
        id: "reserve",
        label: "Reserve a car",
        href: routes.reserve,
      },
      {
        id: "finance-calculator",
        label: "Calculator",
        href: routes.financeCalculator,
      },
    ],
  },
  {
    id: "sell",
    label: "Sell",
    href: routes.sellMyCar,
    children: [
      { id: "sell-my-car", label: "Sell my car", href: routes.sellMyCar },
      { id: "part-exchange", label: "Part exchange", href: routes.partExchange },
      { id: "valuation", label: "Valuation", href: routes.valuation },
    ],
  },
  {
    id: "aftersales",
    label: "Aftersales",
    href: routes.aftersales,
    children: [
      { id: "booking", label: "Book a service", href: routes.booking },
      { id: "service", label: "Service", href: routes.service },
      { id: "mot", label: "MOT", href: routes.mot },
      { id: "warranty", label: "Warranty", href: routes.warranty },
      {
        id: "warranty-claims",
        label: "Warranty claims",
        href: routes.warrantyClaims,
      },
    ],
  },
  {
    id: "about-trust",
    label: "About",
    href: routes.about,
    children: [
      { id: "about", label: "About us", href: routes.about },
      { id: "how-it-works", label: "How it works", href: routes.howItWorks },
      { id: "bury", label: "Bury", href: `${routes.locations}/bury` },
      { id: "chorley", label: "Chorley", href: `${routes.locations}/chorley` },
      { id: "contact", label: "Contact", href: routes.contact },
      { id: "faq", label: "FAQs", href: routes.faq },
    ],
  },
];

export const homepagePrimaryAction: NavigationItem = {
  id: "eligibility",
  label: "Check my eligibility",
  href: routes.eligibility,
  notes: "Homepage primary commercial action.",
};

export const financeCta = {
  anonymousLabel: "Check my eligibility",
  anonymousShortLabel: "Check eligibility",
  personalisedLabel: "Your finance is personalised",
  personalisedShortLabel: "Personalised",
  href: routes.eligibility,
} as const;

export const utilityNavigation: NavigationItem[] = [
  { id: "search", label: "Search", href: routes.search },
];

export const footerNavigation: NavigationGroup[] = [
  {
    id: "cars",
    label: "Cars",
    href: routes.usedCars,
    children: [
      { id: "used-cars", label: "Used cars", href: routes.usedCars },
      { id: "used-vans", label: "Used vans", href: routes.usedVans },
      { id: "search", label: "Search cars", href: routes.search },
      { id: "compare", label: "Compare cars", href: routes.compare },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    href: routes.finance,
    children: [
      { id: "finance-hub", label: "Car finance", href: routes.finance },
      { id: "eligibility", label: "Finance eligibility", href: routes.eligibility },
      { id: "deal", label: "Build my deal", href: routes.deal },
      { id: "reserve", label: "Reserve a car", href: routes.reserve },
      { id: "calculator", label: "Finance calculator", href: routes.financeCalculator },
      { id: "hp-pcp", label: "HP vs PCP", href: getFinanceIntentUrl("pcp") },
      { id: "hp", label: "How HP works", href: getFinanceIntentUrl("hp") },
      { id: "pcp", label: "How PCP works", href: getFinanceIntentUrl("pcp") },
      { id: "bad-credit", label: "Bad credit", href: getFinanceIntentUrl("bad-credit") },
      { id: "no-deposit", label: "No deposit", href: getFinanceIntentUrl("no-deposit") },
      { id: "ccj", label: "CCJ", href: getFinanceIntentUrl("ccj") },
      { id: "self-employed", label: "Self-employed", href: getFinanceIntentUrl("self-employed") },
      { id: "first-time-buyer", label: "First-time buyer", href: getFinanceIntentUrl("first-time-buyer") },
    ],
  },
  {
    id: "sell",
    label: "Sell",
    href: routes.sellMyCar,
    children: [
      { id: "sell-my-car", label: "Sell my car", href: routes.sellMyCar },
      { id: "part-exchange", label: "Part exchange", href: routes.partExchange },
      { id: "valuation", label: "Valuation", href: routes.valuation },
    ],
  },
  {
    id: "aftersales",
    label: "Aftersales",
    href: routes.aftersales,
    children: [
      { id: "aftersales-hub", label: "Aftersales", href: routes.aftersales },
      { id: "servicing", label: "Servicing", href: routes.service },
      { id: "mot", label: "MOT", href: routes.mot },
      { id: "warranty", label: "Warranty", href: routes.warranty },
      { id: "warranty-claims", label: "Warranty claims", href: routes.warrantyClaims },
      {
        id: "servicing-audi",
        label: "Manufacturer servicing",
        href: routes.servicingAudi,
      },
      { id: "booking", label: "Book a service", href: routes.booking },
    ],
  },
  {
    id: "oakwood",
    label: "Oakwood",
    href: routes.about,
    children: [
      { id: "about", label: "About", href: routes.about },
      { id: "how-it-works", label: "How it works", href: routes.howItWorks },
      { id: "what-to-expect", label: "What to expect", href: routes.whatToExpect },
      { id: "our-garage", label: "Our garage", href: routes.ourGarage },
      { id: "reviews", label: "Reviews", href: routes.ourOnlineReviews },
      { id: "aa-standards", label: "AA standards", href: routes.aaStandards },
      {
        id: "delivery",
        label: "Delivery and collection",
        href: routes.deliveryAndCollection,
      },
      { id: "locations-bury", label: "Bury", href: `${routes.locations}/bury` },
      { id: "locations-chorley", label: "Chorley", href: `${routes.locations}/chorley` },
      { id: "contact", label: "Contact", href: routes.contact },
      { id: "faq", label: "FAQs", href: routes.faq },
      { id: "complaints", label: "Complaints", href: routes.complaints },
      { id: "blog", label: "Blog", href: routes.blog },
    ],
  },
];

export const legalNavigation: NavigationItem[] = [
  { id: "hub", label: "Legal documents", href: routes.legal },
  { id: "terms", label: "Terms of use", href: routes.termsOfUse },
  { id: "privacy", label: "Privacy policy", href: routes.privacyPolicy },
  { id: "cookies", label: "Cookie policy", href: routes.cookiePolicy },
  { id: "purchase", label: "Purchase terms", href: routes.vehiclePurchaseTerms },
  { id: "reservation-terms", label: "Reservation terms", href: routes.reservationTerms },
  { id: "cancellation", label: "Cancellation and refund", href: routes.cancellationRefund },
  { id: "delivery-terms", label: "Delivery", href: routes.deliveryTerms },
  { id: "distance-selling", label: "Distance selling", href: routes.distanceSelling },
  { id: "status-disclosure", label: "Status disclosure", href: routes.statusDisclosure },
  { id: "accessibility", label: "Accessibility", href: routes.accessibility },
  { id: "complaints", label: "Complaints", href: routes.complaints },
];

export const socialLinks: NavigationItem[] = [];

export function visibleItems(items: NavigationItem[]) {
  return items.filter((item) => Boolean(item.href) && !item.pending);
}

export function visibleGroups(groups: NavigationGroup[]): NavigationGroup[] {
  return groups.map((group) => ({
    ...group,
    children: visibleItems(group.children),
  }));
}
