export type ReviewSource = "google" | "trustpilot";

export interface HomepageReview {
  id: string;
  source: ReviewSource;
  reviewer: string;
  text: string;
}

export interface HandoverPhoto {
  id: string;
  src: string;
  alt: string;
  family?: boolean;
}

export const HOME_REVIEWS_TITLE = "Don’t take our word for it";
export const HOME_REVIEWS_SUBTITLE = "Trusted by thousands of happy customers";

/** Eve’s Batch 3 cropped reviews — wording kept exact. */
export const HOME_BATCH3_REVIEWS: HomepageReview[] = [
  {
    id: "michelle-bartholomew",
    source: "google",
    reviewer: "Michelle Bartholomew",
    text: "Fantastic customer service, quick decision on the finance, considering my credit file isn’t brilliant. Louise was very efficient and helped me through the whole process.",
  },
  {
    id: "michaels-laird",
    source: "google",
    reviewer: "Michael’s Laird",
    text: "Louise even stayed on past closing time to make sure I could collect my car — that level of service really went above and beyond.",
  },
  {
    id: "mark-knowles",
    source: "google",
    reviewer: "Mark Knowles",
    text: "On leaving he drove me to a fuel station and put £50 in for me — classy touch. The whole process was very professional from start to finish.",
  },
  {
    id: "adam-mcewen",
    source: "google",
    reviewer: "Adam McEwen",
    text: "Due to my credit circumstances I found it tricky to replace my old car, but these guys made it so easy.",
  },
  {
    id: "josie-matthews",
    source: "google",
    reviewer: "Josie Matthews",
    text: "Olivia was fantastic throughout the whole process — friendly, helpful and professional. We couldn’t have asked for better service.",
  },
  {
    id: "sajid-khan",
    source: "google",
    reviewer: "Sajid Khan",
    text: "Within just one week, the finance was sorted, and my dream car was ready to drive away!",
  },
  {
    id: "debbie",
    source: "trustpilot",
    reviewer: "Debbie",
    text: "Riley was a top lad — helpful, knowledgeable and knows how to keep things fun, even when you’re dealing with large sums of money.",
  },
  {
    id: "jack",
    source: "trustpilot",
    reviewer: "Jack",
    text: "Recently purchased a Mercedes from here… I had a good experience, and the delivery of my car was seamless. Would use this garage again!",
  },
];

/** Family images first, then the rest of Eve’s WeTransfer set. */
export const HOME_HANDOVER_PHOTOS: HandoverPhoto[] = [
  {
    id: "family-01",
    src: "/images/handover/handover-01-family.jpg",
    alt: "A family collecting their car from Oakwood Motor Company",
    family: true,
  },
  {
    id: "couple-01",
    src: "/images/handover/handover-02-couple.jpg",
    alt: "A couple with their new car outside Oakwood Motor Company",
    family: true,
  },
  {
    id: "couple-02",
    src: "/images/handover/handover-03-couple.jpg",
    alt: "Customers with their Mini outside Oakwood Motor Company",
    family: true,
  },
  {
    id: "couple-03",
    src: "/images/handover/handover-04-couple.jpg",
    alt: "A couple with their red SUV outside Oakwood Motor Company",
    family: true,
  },
  {
    id: "friends-01",
    src: "/images/handover/handover-05-friends.jpg",
    alt: "Customers with their Hyundai outside Oakwood Motor Company",
  },
  {
    id: "group-01",
    src: "/images/handover/handover-06-family-group.jpg",
    alt: "Customers collecting a Mercedes from Oakwood Motor Company",
  },
  {
    id: "handshake-01",
    src: "/images/handover/handover-07-handshake.jpg",
    alt: "Customer handshake at Oakwood Motor Company",
  },
  {
    id: "keys-01",
    src: "/images/handover/handover-08-keys.jpg",
    alt: "Customer holding the keys to their new SUV",
  },
  {
    id: "customer-01",
    src: "/images/handover/handover-09-customer.jpg",
    alt: "Customer with their white SUV outside Oakwood Motor Company",
  },
  {
    id: "customer-02",
    src: "/images/handover/handover-10-customer.jpg",
    alt: "Customer with their Mercedes outside Oakwood Motor Company",
  },
  {
    id: "ready-01",
    src: "/images/handover/handover-11-ready.jpg",
    alt: "A car ready for handover outside Oakwood Motor Company",
  },
];

export const REVIEW_SOURCE_ICON: Record<ReviewSource, { src: string; label: string }> = {
  google: { src: "/images/reviews/google.svg", label: "Google" },
  trustpilot: { src: "/images/reviews/trustpilot.svg", label: "Trustpilot" },
};
