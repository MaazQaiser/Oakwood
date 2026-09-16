import { reviewProviderIntegration } from "@/lib/api/integrations";
import type { ReviewFeed } from "@/types/reviews";

export const REVIEW_PROVIDER_NOTICE =
  "Customer reviews will appear here when the review provider is connected. We do not display placeholder quotes.";

/**
 * Live review feed is not connected.
 * Do not invent ratings, counts, or review text.
 */
export function getReviewFeed(locationSlug?: string): ReviewFeed {
  void reviewProviderIntegration;
  void locationSlug;

  return {
    status: "unavailable",
    items: [],
    notice: REVIEW_PROVIDER_NOTICE,
  };
}
