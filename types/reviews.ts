export interface Review {
  id: string;
  rating: number;
  text: string;
  customerName?: string;
  date?: string;
  locationSlug?: string;
  locationName?: string;
  colleagueName?: string;
  source?: string;
}

export interface ReviewAggregate {
  rating: number;
  count: number;
}

export type ReviewFeedStatus = "available" | "unavailable";

export interface ReviewFeed {
  status: ReviewFeedStatus;
  items: Review[];
  aggregate?: ReviewAggregate;
  notice: string;
}
