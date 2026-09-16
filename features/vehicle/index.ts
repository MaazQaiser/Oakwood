export {
  findVehicleBySlug,
  findVehicleByStockId,
  listVehicles,
} from "@/lib/vehicles/query";
export { isVehicleSlug, parseVehicleSlug } from "@/lib/vehicles/slug";
export { getVehicleDetail } from "@/lib/mock/vehicle-detail";
export { getSimilarVehicles } from "@/lib/vehicles/similar";
