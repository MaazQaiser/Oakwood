import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo/site";

/**
 * Preview deploy stays out of search indexes until live stock and integrations
 * are connected. Keep Disallow: / on preview; at public launch switch to Allow: /
 * so crawlers can use the sitemap already declared below.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
