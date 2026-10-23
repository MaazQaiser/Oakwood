import type { DealProductDefinition } from "@/types/deal";

export const COVER_YEAR_OPTIONS = [1, 2, 3, 4] as const;

/**
 * Spec §4 Step 4: every product is pre-ticked at its Oakwood default and the
 * customer deselects what they don't want. Pending Automotive Compliance Ltd
 * sign-off before launch (spec §7).
 */
export const RECOMMENDED_COVER_IDS = [
  "aa-warranty",
  "service-plan",
  "mot-maintenance",
  "supagard",
] as const;

/** AA warranty defaults to 3 years; service and MOT match the finance term, capped at 4. */
export function defaultCoverYears(termMonths: number): Record<string, number> {
  const termYears = Math.max(1, Math.min(4, Math.ceil(termMonths / 12)));
  return {
    "aa-warranty": 3,
    "service-plan": termYears,
    "mot-maintenance": termYears,
  };
}

/** @deprecated Use defaultCoverYears(term) so service and MOT follow the term. */
export const PROTOTYPE_DEFAULT_COVER_YEARS: Record<string, number> =
  defaultCoverYears(48);

/**
 * Optional products — prices and financeability are mock until Oakwood
 * supplies cost and retail per duration (spec §7).
 */
export const MOCK_OPTIONAL_PRODUCTS: DealProductDefinition[] = [
  {
    id: "aa-warranty",
    name: "AA warranty",
    type: "warranty",
    summary:
      "Mechanical and electrical cover, £2,000 claim limit per repair. Includes AA breakdown.",
    details:
      "Oakwood standard tier. Covers listed mechanical and electrical items. Optional and removable at any time.",
    price: 499,
    financeable: true,
  },
  {
    id: "service-plan",
    name: "Service plan",
    type: "service-plan",
    summary: "One full service per year at an Oakwood workshop.",
    details:
      "Covers scheduled services during the plan. Exact inclusions are confirmed before application.",
    price: 399,
    financeable: true,
  },
  {
    id: "mot-maintenance",
    name: "MOT plan",
    type: "mot-bundle",
    summary: "One MOT per year, DVSA certified test, free retest if needed.",
    details:
      "An optional MOT plan. Cover limits and financeability are confirmed by the provider.",
    price: 129,
    financeable: true,
  },
  {
    id: "supagard",
    name: "Supagard",
    type: "paint-fabric",
    summary: "Paint and interior protection, with 1 year aftercare included.",
    details:
      "Helps protect painted surfaces and cabin fabrics from day-to-day wear. Optional, individually removable, and not required to continue.",
    price: 299,
    financeable: true,
  },
];

export const COVER_INFO: Record<
  string,
  {
    covered: string[];
    notCovered: string[];
    terms: string;
    faq: { q: string; a: string }[];
    videoSrc?: string;
  }
> = {
  "aa-warranty": {
    covered: [
      "Listed mechanical and electrical components",
      "Labour for covered repairs at approved centres",
      "Breakdown assistance as described in the policy wording",
    ],
    notCovered: [
      "Wear and tear items such as tyres and brake pads",
      "Damage from misuse or unapproved modifications",
      "Routine servicing unless included in a separate plan",
    ],
    terms:
      "Full terms are confirmed before purchase. Cover is optional and can be removed from your deal at any time before reservation.",
    faq: [
      {
        q: "Can I add this to finance?",
        a: "It can be added to the amount financed. Your lender confirms this when you apply.",
      },
      {
        q: "When does cover start?",
        a: "Cover typically starts from vehicle handover, subject to the policy wording.",
      },
    ],
  },
  "service-plan": {
    covered: [
      "Scheduled services within the plan term",
      "Standard service parts and labour as listed",
    ],
    notCovered: [
      "Repairs outside scheduled services",
      "Tyres, brakes and other wear items unless listed",
    ],
    terms:
      "Service intervals follow the manufacturer schedule. Unused services are not automatically refunded unless stated.",
    faq: [
      {
        q: "Can I change the term later?",
        a: "You can change or remove the plan before you reserve. After purchase, changes follow the plan terms.",
      },
    ],
  },
  "mot-maintenance": {
    covered: ["MOT test fees for the selected years"],
    notCovered: ["Repairs required to pass the MOT", "Retest fees unless listed"],
    terms: "MOT plan terms are confirmed before purchase. Optional and removable.",
    faq: [
      {
        q: "Does this include repairs?",
        a: "No. It helps with MOT test costs. Repairs are separate.",
      },
    ],
  },
  supagard: {
    covered: [
      "Paint protection treatment",
      "Interior fabric protection as described",
    ],
    notCovered: [
      "Accident damage",
      "Neglect or incorrect cleaning products",
    ],
    terms: "Supagard is optional. Treatment details are confirmed before fitment.",
    faq: [
      {
        q: "Is there a video?",
        a: "Yes — open Info to see a short product overview.",
      },
    ],
    videoSrc: "/videos/supagard-overview.mp4",
  },
};

export function getDealProduct(id: string): DealProductDefinition | undefined {
  return MOCK_OPTIONAL_PRODUCTS.find((product) => product.id === id);
}

export function listSelectedProducts(ids: string[]): DealProductDefinition[] {
  const unique = Array.from(new Set(ids));
  return unique
    .map((id) => getDealProduct(id))
    .filter((product): product is DealProductDefinition => Boolean(product));
}

export function productPriceForYears(
  product: DealProductDefinition,
  years = 1,
): number {
  if (product.id === "supagard") {
    return product.price;
  }
  return Math.round(product.price * Math.max(1, Math.min(4, years)));
}
