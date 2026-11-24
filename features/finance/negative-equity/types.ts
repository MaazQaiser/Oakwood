import type { NegEquityVehicle } from "@/lib/finance/negative-equity/quote";

export interface NegEquityStockCar extends NegEquityVehicle {
  slug: string;
  imageSrc: string;
  imageAlt: string;
  transmission: string;
  bodyStyle: string;
  locationName: string;
}

export interface NegEquityPageModel {
  cars: NegEquityStockCar[];
  initialStockId: string | null;
}
