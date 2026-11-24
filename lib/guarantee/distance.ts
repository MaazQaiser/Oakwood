import { getShowroom } from "@/config/locations";

/** Deterministic mock one-way distance from a postcode to a selling site (miles). */
export function mockDistanceToSiteMiles(
  postcode: string,
  siteSlug: string,
): number {
  const profile = getShowroom(siteSlug);
  const seed = `${postcode.replace(/\s/g, "").toUpperCase()}|${profile?.postcode ?? siteSlug}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 997;
  }
  return 8 + (hash % 55);
}