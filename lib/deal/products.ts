import type { DealProductDefinition } from "@/types/deal";

/**
 * Optional products are never preselected. Financeability is a mock flag
 * until the lender confirms which products can be added to the advance.
 */
export const MOCK_OPTIONAL_PRODUCTS: DealProductDefinition[] = [
  {
    id: "extended-warranty",
    name: "Extended warranty",
    type: "warranty",
    summary: "Additional cover for your vehicle after the included warranty.",
    details:
      "Covers listed mechanical and electrical items beyond the vehicle's included warranty period. This is an optional product. Whether it can be added to the amount financed is confirmed by the finance provider during application.",
    price: 499,
    financeable: true,
  },
  {
    id: "paint-protection",
    name: "Paint and fabric protection",
    type: "paint-fabric",
    summary: "A protection treatment for paintwork and interior fabrics.",
    details:
      "Helps protect painted surfaces and cabin fabrics from day-to-day wear. Optional, individually removable, and not required to continue.",
    price: 299,
    financeable: true,
  },
  {
    id: "service-plan",
    name: "Service plan",
    type: "service-plan",
    summary: "Spread the cost of scheduled servicing over the finance term.",
    details:
      "Covers scheduled manufacturer-style services during the plan. Exact inclusions are confirmed before application. Optional and removable.",
    price: 399,
    financeable: true,
  },
  {
    id: "mot-maintenance",
    name: "MOT and maintenance plan",
    type: "mot-bundle",
    summary: "Help with MOT and routine maintenance costs.",
    details:
      "An optional MOT and maintenance product. Cover limits and financeability are confirmed by the provider. Unticked by default and removable at any time.",
    price: 129,
    financeable: true,
  },
];

export function getDealProduct(id: string): DealProductDefinition | undefined {
  return MOCK_OPTIONAL_PRODUCTS.find((product) => product.id === id);
}

export function listSelectedProducts(ids: string[]): DealProductDefinition[] {
  const unique = Array.from(new Set(ids));
  return unique
    .map((id) => getDealProduct(id))
    .filter((product): product is DealProductDefinition => Boolean(product));
}
