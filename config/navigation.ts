import {
  getBodyTypeUrl,
  getBookingUrl,
  getCashBudgetUrl,
  getFinanceIntentUrl,
  getFuelTypeUrl,
  getLocationStockUrl,
  getMonthlyBudgetUrl,
  routes,
} from "@/config/routes";

export interface NavigationItem {
  id: string;
  label: string;
  href: string | null;
  pending?: boolean;
  notes?: string;
  external?: boolean;
}

export interface NavigationGroup {
  id: string;
  label: string;
  href?: string | null;
  children: NavigationItem[];
}

export const primaryNavigation: NavigationGroup[] = [
  {
    id: "buy",
    label: "Buy",
    href: routes.usedCars,
    children: [
      { id: "used-cars", label: "Used cars", href: routes.usedCars },
      { id: "electric-cars", label: "Electric cars", href: routes.electricCars },
      { id: "used-vans", label: "Used vans", href: routes.usedVans },
      { id: "price-drops", label: "Price drops", href: routes.priceDrops },
      {
        id: "bury-stock",
        label: "Cars in Bury",
        href: getLocationStockUrl("bury"),
      },
      {
        id: "chorley-stock",
        label: "Cars in Chorley",
        href: getLocationStockUrl("chorley"),
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    href: routes.finance,
    children: [
      {
        id: "eligibility",
        label: "Check my rate",
        href: routes.eligibilityQuestions,
      },
      {
        id: "finance-hub",
        label: "Car finance",
        href: routes.finance,
      },
      {
        id: "zero-percent",
        label: "0% finance",
        href: routes.interestFree,
      },
      {
        id: "negative-equity",
        label: "Negative equity",
        href: routes.negativeEquity,
      },
      {
        id: "calculator",
        label: "Calculator",
        href: routes.financeCalculator,
      },
    ],
  },
  {
    id: "sell",
    label: "Sell",
    href: routes.partExchange,
    children: [
      { id: "part-exchange", label: "Part exchange", href: routes.partExchange },
      {
        id: "sell-my-car",
        label: "Sell my car",
        href: routes.sellMyCar,
      },
    ],
  },
  {
    id: "servicing",
    label: "Servicing",
    href: routes.service,
    children: [
      { id: "servicing", label: "Servicing", href: routes.service },
      {
        id: "manufacturer",
        label: "Manufacturer servicing",
        href: routes.servicingAudi,
      },
      { id: "mot", label: "MOT", href: routes.mot },
      {
        id: "diagnosis",
        label: "60 minute diagnostic",
        href: getBookingUrl({ type: "diagnostic" }),
      },
      { id: "plans", label: "Service plans", href: routes.servicingPlans },
      { id: "booking", label: "Book a service", href: routes.booking },
      { id: "warranty", label: "Warranty", href: routes.warranty },
    ],
  },
  {
    id: "about",
    label: "About",
    href: routes.about,
    children: [
      { id: "about", label: "About us", href: routes.about },
      { id: "reviews", label: "Reviews", href: routes.ourOnlineReviews },
      {
        id: "bury",
        label: "Bury",
        href: `${routes.locations}/bury`,
      },
      {
        id: "chorley",
        label: "Chorley",
        href: `${routes.locations}/chorley`,
      },
      { id: "aa-standards", label: "AA standards", href: routes.aaStandards },
      { id: "our-garage", label: "Our garage", href: routes.ourGarage },
      { id: "visit-us", label: "Visit us", href: routes.locations },
      { id: "contact", label: "Contact", href: routes.contact },
    ],
  },
];

export const homepagePrimaryAction: NavigationItem = {
  id: "eligibility",
  label: "Check my rate",
  href: routes.eligibility,
  notes: "Homepage primary commercial action.",
};

export const headerPrimaryAction = {
  id: "find-your-car",
  label: "Find your car",
  href: routes.search,
} as const;

export const financeCta = {
  anonymousLabel: "Check my rate",
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
    id: "buy",
    label: "Buy",
    href: routes.usedCars,
    children: [
      { id: "used-cars", label: "Used cars", href: routes.usedCars },
      { id: "used-vans", label: "Used vans", href: routes.usedVans },
      { id: "electric-cars", label: "Electric cars", href: routes.electricCars },
      { id: "price-drops", label: "Price drops", href: routes.priceDrops },
      { id: "saved-cars", label: "Saved cars", href: routes.savedCars },
      { id: "compare", label: "Compare cars", href: routes.compare },
      {
        id: "thirty-day",
        label: "30 day guarantee",
        href: routes.thirtyDayGuarantee,
      },
      {
        id: "delivery",
        label: "Delivery and collection",
        href: routes.deliveryAndCollection,
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    href: routes.finance,
    children: [
      { id: "finance-hub", label: "Car finance", href: routes.finance },
      {
        id: "eligibility",
        label: "Check my rate",
        href: routes.eligibility,
      },
      {
        id: "calculator",
        label: "Calculator",
        href: routes.financeCalculator,
      },
      {
        id: "hp-pcp",
        label: "HP or PCP",
        href: getFinanceIntentUrl("hp"),
      },
      {
        id: "zero-percent",
        label: "0% finance",
        href: routes.interestFree,
      },
      {
        id: "negative-equity",
        label: "Negative equity",
        href: routes.negativeEquity,
      },
      {
        id: "no-deposit",
        label: "No deposit",
        href: getFinanceIntentUrl("no-deposit"),
      },
      {
        id: "bad-credit",
        label: "Bad credit",
        href: getFinanceIntentUrl("bad-credit"),
      },
      {
        id: "ccj",
        label: "CCJ",
        href: getFinanceIntentUrl("ccj"),
      },
    ],
  },
  {
    id: "sell-servicing",
    label: "Sell and Servicing",
    href: routes.partExchange,
    children: [
      { id: "part-exchange", label: "Part exchange", href: routes.partExchange },
      {
        id: "sell-my-car",
        label: "Sell my car",
        href: routes.sellMyCar,
      },
      { id: "servicing", label: "Servicing", href: routes.service },
      { id: "mot", label: "MOT", href: routes.mot },
      { id: "booking", label: "Book a service", href: routes.booking },
      { id: "warranty", label: "Warranty", href: routes.warranty },
      {
        id: "warranty-claims",
        label: "Warranty claims",
        href: routes.warrantyClaims,
      },
      { id: "protection", label: "Protection", href: routes.protection },
    ],
  },
  {
    id: "oakwood",
    label: "Oakwood",
    href: routes.about,
    children: [
      { id: "about", label: "About", href: routes.about },
      {
        id: "thirty-day",
        label: "30 Day Guarantee",
        href: routes.thirtyDayGuarantee,
      },
      { id: "reviews", label: "Reviews", href: routes.ourOnlineReviews },
      { id: "aa-standards", label: "AA standards", href: routes.aaStandards },
      { id: "bury", label: "Bury", href: `${routes.locations}/bury` },
      { id: "chorley", label: "Chorley", href: `${routes.locations}/chorley` },
      { id: "contact", label: "Contact", href: routes.contact },
      { id: "help", label: "Help", href: routes.help },
      {
        id: "problem",
        label: "Problem with your car?",
        href: routes.problemWithYourCar,
      },
      { id: "blog", label: "Blog", href: routes.blog },
      { id: "careers", label: "Careers", href: routes.careers },
    ],
  },
];

export const legalNavigation: NavigationItem[] = [
  { id: "terms", label: "Terms of use", href: routes.termsOfUse },
  { id: "privacy", label: "Privacy", href: routes.privacyPolicy },
  { id: "cookies", label: "Cookies", href: routes.cookiePolicy },
  { id: "purchase", label: "Purchase terms", href: routes.vehiclePurchaseTerms },
  {
    id: "reservation-terms",
    label: "Reservation terms",
    href: routes.reservationTerms,
  },
  {
    id: "thirty-day-terms",
    label: "30 day guarantee terms",
    href: routes.thirtyDayGuaranteeTerms,
  },
  {
    id: "cancellation",
    label: "Cancellation and refund",
    href: routes.cancellationRefund,
  },
  { id: "delivery-terms", label: "Delivery", href: routes.deliveryTerms },
  {
    id: "distance-selling",
    label: "Distance selling",
    href: routes.distanceSelling,
  },
  {
    id: "status-disclosure",
    label: "Status disclosure",
    href: routes.statusDisclosure,
  },
  { id: "accessibility", label: "Accessibility", href: routes.accessibility },
  {
    id: "complaints",
    label: "Complaints",
    href: routes.problemWithYourCar,
  },
];

export const socialLinks: NavigationItem[] = [];

export const browseMonthlyBudgetLinks = [
  {
    label: "Cars under",
    price: "£200",
    href: getMonthlyBudgetUrl("under-200"),
  },
  {
    label: "Cars under",
    price: "£300",
    href: getMonthlyBudgetUrl("under-300"),
  },
  {
    label: "Cars under",
    price: "£400",
    href: getMonthlyBudgetUrl("under-400"),
  },
  {
    label: "Cars under",
    price: "£500",
    href: getMonthlyBudgetUrl("under-500"),
  },
  {
    label: "Cars over",
    price: "£500",
    href: getMonthlyBudgetUrl("over-500"),
  },
] as const;

export const browseCashBudgetLinks = [
  {
    label: "Cars under",
    price: "£7,500",
    href: getCashBudgetUrl("under-7500"),
  },
  {
    label: "Cars under",
    price: "£10,000",
    href: getCashBudgetUrl("under-10000"),
  },
  {
    label: "Cars under",
    price: "£15,000",
    href: getCashBudgetUrl("under-15000"),
  },
  {
    label: "Cars under",
    price: "£20,000",
    href: getCashBudgetUrl("under-20000"),
  },
  {
    label: "Cars over",
    price: "£20,000",
    href: getCashBudgetUrl("over-20000"),
  },
] as const;

export const browseBodyTypeLinks = [
  { label: "SUV", href: getBodyTypeUrl("suv") },
  { label: "Hatchback", href: getBodyTypeUrl("hatchback") },
  { label: "Estate", href: getBodyTypeUrl("estate") },
  { label: "Saloon", href: getBodyTypeUrl("saloon") },
  { label: "MPV", href: getBodyTypeUrl("mpv") },
] as const;

export const browseFuelLinks = [
  { label: "Petrol", href: getFuelTypeUrl("petrol") },
  { label: "Diesel", href: getFuelTypeUrl("diesel") },
  { label: "Hybrid", href: getFuelTypeUrl("hybrid") },
  { label: "Electric", href: getFuelTypeUrl("electric") },
] as const;

export function visibleItems(items: NavigationItem[]) {
  return items.filter((item) => Boolean(item.href) && !item.pending);
}

export function visibleGroups(groups: NavigationGroup[]): NavigationGroup[] {
  return groups.map((group) => ({
    ...group,
    children: visibleItems(group.children),
  }));
}
