import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo/site";

/**
 * Preview deploy stays out of search indexes until live stock and integrations
 * are connected. Flip to Allow: / (plus a sitemap) at public launch.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    host: getSiteOrigin(),
  };
}
