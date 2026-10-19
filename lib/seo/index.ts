export { createDynamicTitle, createPageMetadata, getCanonicalUrl } from "./metadata";
export type { PageSeoInput } from "./metadata";
export { getSiteOrigin } from "./site";
export { createFaqJsonLd, createLocalBusinessJsonLd, createVehicleJsonLd, createArticleJsonLd, createBreadcrumbJsonLd } from "./json-ld";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function createBreadcrumbs(
  items: BreadcrumbItem[],
): BreadcrumbItem[] {
  return items;
}

/**
 * Sitemap generation is deferred until the SEO/GEO specification is supplied.
 */
export function getSitemapPlaceholder(): [] {
  return [];
}

/**
 * Sold vehicles are removed from the sitemap immediately while the URL
 * continues to resolve for the retention period.
 */
export { shouldIndexVehicle } from "@/lib/vehicles/sold";

/**
 * @deprecated Prefer app/robots.ts. Kept for call sites that still import the placeholder.
 */
export function getRobotsPlaceholder(): null {
  return null;
}
