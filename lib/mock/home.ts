import { getFinanceIntentUrl, getSearchUrl, routes } from "@/config/routes";
import { mockVehicles } from "@/lib/mock/data";
import type { Vehicle } from "@/types/vehicle";

export interface FeaturedVehicle extends Vehicle {
  monthly: number;
}

export const featuredVehicles: FeaturedVehicle[] = mockVehicles
  .filter((vehicle) => vehicle.category === "car")
  .slice(0, 4)
  .map((vehicle) => ({
    ...vehicle,
    monthly: vehicle.monthlyPayment,
  }));

export const budgetBands = [
  {
    id: "under-150",
    label: "Under £150",
    count: 86,
    href: getSearchUrl({ monthly_max: 150 }),
  },
  {
    id: "150-200",
    label: "£150–£200",
    count: 124,
    href: getSearchUrl({ monthly_min: 150, monthly_max: 200 }),
  },
  {
    id: "200-250",
    label: "£200–£250",
    count: 98,
    href: getSearchUrl({ monthly_min: 200, monthly_max: 250 }),
  },
  {
    id: "250-300",
    label: "£250–£300",
    count: 71,
    href: getSearchUrl({ monthly_min: 250, monthly_max: 300 }),
  },
  {
    id: "300-400",
    label: "£300–£400",
    count: 54,
    href: getSearchUrl({ monthly_min: 300, monthly_max: 400 }),
  },
  {
    id: "400-plus",
    label: "£400+",
    count: 31,
    href: getSearchUrl({ monthly_min: 400 }),
  },
];

export const needCategories = [
  {
    id: "small",
    title: "Small cars",
    description: "Easy to park and economical to run.",
    href: getSearchUrl({ body_style: "hatchback", need: "small" }),
  },
  {
    id: "family",
    title: "Family cars",
    description: "More space for everyday journeys.",
    href: getSearchUrl({ need: "family" }),
  },
  {
    id: "suv",
    title: "SUVs",
    description: "More room for people and luggage.",
    href: getSearchUrl({ body_style: "SUV" }),
  },
  {
    id: "automatic",
    title: "Automatic cars",
    description: "Simple, comfortable driving.",
    href: getSearchUrl({ transmission: "Automatic" }),
  },
  {
    id: "hybrid-electric",
    title: "Hybrid & electric",
    description: "Explore efficient ways to drive.",
    href: getSearchUrl({ fuel: "Electric", need: "hybrid-electric" }),
  },
  {
    id: "low-mileage",
    title: "Low mileage",
    description: "Cars with fewer miles on the clock.",
    href: getSearchUrl({ max_mileage: 20000 }),
  },
  {
    id: "vans",
    title: "Vans",
    description: "Practical vehicles for work and business.",
    href: routes.usedVans,
  },
];

export const whyOakwood = [
  {
    number: "01",
    title: "Know your finance",
    copy: "Check your eligibility before you start shopping, with no impact on your credit score.",
  },
  {
    number: "02",
    title: "See what you'll pay",
    copy: "Your finance profile follows you through the journey, so you can see personalised monthly figures.",
  },
  {
    number: "03",
    title: "Know the car",
    copy: "See the vehicle's history, condition, specification and important documents before you buy.",
  },
  {
    number: "04",
    title: "Buy your way",
    copy: "Choose your deposit, term, part exchange and optional products when you build your deal.",
  },
];

export const financeGuides = [
  {
    title: "How car finance works",
    description: "Understand deposits, monthly payments, terms and total cost.",
    href: routes.finance,
  },
  {
    title: "HP vs PCP",
    description: "See how the two finance options compare.",
    href: getFinanceIntentUrl("pcp"),
  },
  {
    title: "Car finance with bad credit",
    description: "Understand your options if your credit history isn't perfect.",
    href: getFinanceIntentUrl("bad-credit"),
  },
  {
    title: "No deposit car finance",
    description: "Learn what no-deposit finance means and what to consider.",
    href: getFinanceIntentUrl("no-deposit"),
  },
  {
    title: "First-time buyer",
    description: "New to car finance? Start here.",
    href: getFinanceIntentUrl("first-time-buyer"),
  },
];

export const mockReviews = {
  rating: 4.8,
  count: 312,
  items: [
    {
      id: "review-1",
      name: "Sarah M.",
      location: "Bury",
      quote:
        "Checking eligibility first made the whole process calmer. I knew the monthly figure before I looked at cars.",
    },
    {
      id: "review-2",
      name: "James P.",
      location: "Chorley",
      quote:
        "Clear information, no pressure, and the finance figures matched what we were told from the start.",
    },
    {
      id: "review-3",
      name: "Amira K.",
      location: "Bury",
      quote:
        "We found a car that fitted the budget we already had, then reserved it the same day.",
    },
  ],
};
