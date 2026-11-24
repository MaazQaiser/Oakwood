import type { InterestFreeVehicleInput } from "@/lib/finance/interest-free/deal";

export interface InterestFreeStockCar extends InterestFreeVehicleInput {
  slug: string;
  imageSrc: string;
  imageAlt: string;
}

export interface InterestFreePageModel {
  cars: InterestFreeStockCar[];
  hero: InterestFreeStockCar | null;
  initialStockId: string | null;
}
