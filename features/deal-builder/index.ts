import { mockDealId } from "@/lib/mock/data";
import type { Deal } from "@/types/deal";

/** @deprecated Use features/deal and calculateDeal instead. */
export function getMockDeal(dealId = mockDealId): Deal {
  return {
    id: dealId,
    vehicleStockId: "7848117",
    financeType: "hp",
    deposit: 1000,
    termMonths: 48,
    products: [],
    state: "draft",
  };
}
