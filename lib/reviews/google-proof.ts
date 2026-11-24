import { getReviewFeed } from "@/lib/reviews/provider";

export interface GoogleReviewProof {
  rating: number;
  count: number;
  label: string;
}

/**
 * Proof line for the finance rate CTA. Live from the review provider only —
 * never invent or hardcode a score or count in the CTA.
 */
export function getGoogleReviewProof(): GoogleReviewProof | null {
  const feed = getReviewFeed();
  if (feed.status !== "available" || !feed.aggregate) {
    return null;
  }

  const { rating, count } = feed.aggregate;
  if (!(rating > 0) || !(count > 0)) {
    return null;
  }

  const ratingLabel = Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1);

  return {
    rating,
    count,
    label: `★ ${ratingLabel} from ${count.toLocaleString("en-GB")} Google reviews`,
  };
}
