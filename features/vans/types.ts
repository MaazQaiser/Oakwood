import type { VehicleCategory } from "@/types/vehicle";

export type VanCategory = Extract<VehicleCategory, "van">;

export const VAN_CATEGORY: VanCategory = "van";
