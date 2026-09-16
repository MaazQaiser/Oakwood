import { routes } from "@/config/routes";
import type { VehicleCategory } from "@/types/vehicle";

export interface SearchCopy {
  category: VehicleCategory;
  noun: "car" | "van";
  nounPlural: "cars" | "vans";
  hubLabel: string;
  hubHref: string;
  landingTitle: string;
  landingDescription: string;
  searchHint: string;
  emptyHeading: string;
  emptyFallback: string;
  browseAllLabel: string;
  requestLabel: string;
  showNotify: boolean;
  showHeroActions: boolean;
  heroPrimary: string;
  heroSecondary: string;
  bannerTitle: string;
  bannerBody: string;
  bannerCta: string;
  personalisedTitle: string;
  personalisedBody: string;
  resultsShowing: string;
  loadMore: string;
  viewCta: string;
  affordableCta: string;
  financeFooterTitle: string;
  financeFooterBody: string;
  affordableFooterTitle: string;
  affordableFooterBody: string;
  stockErrorTitle: string;
  stockErrorBody: string;
  newestSort: string;
  bodyFilterTitle: string;
  depositHint: string;
  affordableHintEligible: string;
  affordableHintGuest: string;
}

const CAR_COPY: SearchCopy = {
  category: "car",
  noun: "car",
  nounPlural: "cars",
  hubLabel: "Used Cars",
  hubHref: routes.usedCars,
  landingTitle: "Used Cars for Sale",
  landingDescription:
    "Explore our used cars and find one that fits your budget, lifestyle and finance options.",
  searchHint: "Try “BMW automatic under £300 a month” or “Family SUV under £15,000”.",
  emptyHeading: "No cars match those filters.",
  emptyFallback: "Try removing a filter or broaden your search.",
  browseAllLabel: "Browse all cars",
  requestLabel: "Request a car",
  showNotify: true,
  showHeroActions: false,
  heroPrimary: "Check my eligibility",
  heroSecondary: "Browse cars",
  bannerTitle: "Know your budget before you shop.",
  bannerBody:
    "Check your finance eligibility in around 60 seconds. It won't affect your credit score.",
  bannerCta: "Check my eligibility",
  personalisedTitle: "Your finance profile is ready",
  personalisedBody:
    "Cars are shown with your personalised monthly figures. Based on your current finance profile.",
  resultsShowing: "Showing cars that match your search",
  loadMore: "Load more cars",
  viewCta: "View car",
  affordableCta: "View affordable cars",
  financeFooterTitle: "Want to know what you could afford?",
  financeFooterBody:
    "Check your finance eligibility before you choose a car. It takes around 60 seconds and won't affect your credit score.",
  affordableFooterTitle: "Looking for something within your budget?",
  affordableFooterBody:
    "Show cars that fit your current finance profile. You can turn this off at any time.",
  stockErrorTitle: "We're having trouble loading all available cars.",
  stockErrorBody: "You can try again, speak to Oakwood, or request a specific car.",
  newestSort: "Newest cars",
  bodyFilterTitle: "Body type",
  depositHint:
    "Deposit and term update your finance assumptions. They do not hide cars on their own.",
  affordableHintEligible: "Show cars within my current finance profile.",
  affordableHintGuest: "Check eligibility to personalise affordability.",
};

const VAN_COPY: SearchCopy = {
  category: "van",
  noun: "van",
  nounPlural: "vans",
  hubLabel: "Used Vans",
  hubHref: routes.usedVans,
  landingTitle: "Used Vans for Sale",
  landingDescription:
    "Browse available Oakwood vans and find one that fits your budget. Compare monthly payments, cash price and specification, then continue into finance or reserve.",
  searchHint: "Try “Ford Transit under £300 a month” or “Diesel van in Bury”.",
  emptyHeading: "We couldn't find a van matching those filters.",
  emptyFallback: "Try removing a filter or broaden your search.",
  browseAllLabel: "Browse all vans",
  requestLabel: "Request a van",
  showNotify: false,
  showHeroActions: true,
  heroPrimary: "Check my eligibility",
  heroSecondary: "Browse vans",
  bannerTitle: "Know what you could afford",
  bannerBody: "Check your finance eligibility before you browse.",
  bannerCta: "Check my eligibility",
  personalisedTitle: "Your finance profile is ready",
  personalisedBody:
    "Vans are shown with your personalised monthly figures. Based on your current finance profile.",
  resultsShowing: "Showing vans that match your search",
  loadMore: "Load more vans",
  viewCta: "View van",
  affordableCta: "View affordable vans",
  financeFooterTitle: "Want to know what you could afford?",
  financeFooterBody:
    "Check your finance eligibility before you choose a van. It takes around 60 seconds and won't affect your credit score.",
  affordableFooterTitle: "Looking for something within your budget?",
  affordableFooterBody:
    "Show vans that fit your current finance profile. You can turn this off at any time.",
  stockErrorTitle: "We're having trouble loading all available vans.",
  stockErrorBody: "You can try again, speak to Oakwood, or request a specific van.",
  newestSort: "Newest vans",
  bodyFilterTitle: "Van type",
  depositHint:
    "Deposit and term update your finance assumptions. They do not hide vans on their own.",
  affordableHintEligible: "Show vans within my current finance profile.",
  affordableHintGuest: "Check eligibility to personalise affordability.",
};

export function getSearchCopy(category: VehicleCategory = "car"): SearchCopy {
  return category === "van" ? VAN_COPY : CAR_COPY;
}

export function countLabel(count: number, copy: SearchCopy): string {
  if (copy.category === "van") {
    return `${count} ${count === 1 ? "used van" : "used vans"}`;
  }

  return `${count} ${count === 1 ? "used car" : "used cars"}`;
}

export function fewResultsLabel(count: number, copy: SearchCopy): string {
  const match = count === 1 ? `${copy.noun} matches` : `${copy.nounPlural} match`;
  return `Only ${count} ${match} your search. Try broadening your search.`;
}
