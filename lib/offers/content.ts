import { getOfferUrl, routes } from "@/config/routes";
import type { RepresentativeFinanceExample } from "@/lib/finance/representative-example";

export interface OfferCampaign {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  metaDescription: string;
  validUntil?: string;
  terms: readonly string[];
  representativeExample?: RepresentativeFinanceExample;
  /** Stock filter for the eligible grid — fuel slug, body slug, or make slug. */
  stockFilter?: { fuel?: string; body_style?: string; make?: string };
}

export const offerCampaigns: Record<string, OfferCampaign> = {
  "winter-finance-event": {
    slug: "winter-finance-event",
    title: "Winter finance event",
    eyebrow: "Limited-time offer",
    intro:
      "Selected used cars with illustrated monthly payments from our representative example. Check eligibility for your own profile before you reserve.",
    metaDescription:
      "Browse eligible Oakwood stock for the winter finance event. Representative example shown; your figures may differ.",
    validUntil: "2026-12-31",
    terms: [
      "Illustrations use the Oakwood representative example unless personalised finance is active.",
      "Eligible vehicles are marked on this page only.",
      "A regulated finance application is completed later in the deal.",
      "Offer may be withdrawn without notice when stock sells.",
    ],
    stockFilter: { fuel: "hybrid" },
  },
};

export function listOfferSlugs(): string[] {
  return Object.keys(offerCampaigns);
}

export function getOfferCampaign(slug: string): OfferCampaign | undefined {
  return offerCampaigns[slug];
}

export function getOfferPaths() {
  return {
    hub: routes.offers,
    campaign: (slug: string) => getOfferUrl(slug),
  };
}