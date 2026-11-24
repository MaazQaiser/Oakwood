import type { MetadataRoute } from "next";
import { FINANCE_INTENT_SLUGS } from "@/config/finance";
import {
  CASH_BUDGET_BANDS,
  getBlogPostUrl,
  getBodyTypeUrl,
  getCashBudgetUrl,
  getFinanceIntentUrl,
  getFuelTypeUrl,
  getLocationUrl,
  getMonthlyBudgetUrl,
  getVehicleUrl,
  MONTHLY_BUDGET_BANDS,
  routes,
} from "@/config/routes";
import { listContentEntries } from "@/content/editorial";
import { showroomProfiles } from "@/config/locations";
import { getSiteOrigin } from "@/lib/seo/site";
import { CATALOGUE_DATE, shouldIndexVehicle } from "@/lib/vehicles/sold";
import { listBodyBrowseSlugs, listFuelBrowseSlugs } from "@/lib/vehicles/browse-segments";
import { mockVehicles } from "@/lib/mock/data";

const LAST_MODIFIED = new Date(CATALOGUE_DATE);

function absolute(path: string): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteOrigin()}${normalised}`;
}

function entry(path: string): MetadataRoute.Sitemap[number] {
  return { url: absolute(path), lastModified: LAST_MODIFIED };
}

function indexableStaticPaths(): string[] {
  const paths: string[] = [
    routes.home,
    routes.usedCars,
    routes.usedVans,
    routes.electricCars,
    routes.priceDrops,
    routes.usedCarsAutomatic,
    routes.cheapToRun,
    routes.finance,
    routes.financeCalculator,
    routes.service,
    routes.servicingPlans,
    routes.servicingAudi,
    routes.mot,
    routes.warranty,
    routes.about,
    routes.ourGarage,
    routes.ourOnlineReviews,
    routes.aaStandards,
    routes.howItWorks,
    routes.whatToExpect,
    routes.deliveryAndCollection,
    routes.thirtyDayGuarantee,
    routes.pricePromise,
    routes.protection,
    routes.careers,
    routes.help,
    routes.blog,
    routes.locations,
  ];

  for (const band of MONTHLY_BUDGET_BANDS) {
    paths.push(getMonthlyBudgetUrl(band));
  }
  for (const band of CASH_BUDGET_BANDS) {
    paths.push(getCashBudgetUrl(band));
  }
  for (const body of listBodyBrowseSlugs()) {
    paths.push(getBodyTypeUrl(body));
  }
  for (const fuel of listFuelBrowseSlugs()) {
    paths.push(getFuelTypeUrl(fuel));
  }
  for (const intent of FINANCE_INTENT_SLUGS) {
    paths.push(getFinanceIntentUrl(intent));
  }
  for (const profile of showroomProfiles) {
    paths.push(getLocationUrl(profile.slug));
  }
  for (const item of listContentEntries("published")) {
    paths.push(getBlogPostUrl(item.slug));
  }

  return paths;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const vehiclePaths = mockVehicles
    .filter(shouldIndexVehicle)
    .map((vehicle) => getVehicleUrl(vehicle));

  const paths = Array.from(
    new Set([...indexableStaticPaths(), ...vehiclePaths]),
  );

  return paths.map(entry);
}