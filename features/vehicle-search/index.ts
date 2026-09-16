import { listVehicles } from "@/lib/vehicles/query";
import { searchCatalog } from "@/lib/vehicles/search";
import { parseSearchQuery } from "@/lib/validation/search";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export function searchVehicles(
  searchParams: Record<string, string | string[] | undefined>,
  category: VehicleCategory = "car",
): Vehicle[] {
  const query = parseSearchQuery(searchParams);
  return searchCatalog(query, {}, { category }).vehicles;
}

export function listSearchCatalog(category: VehicleCategory = "car"): Vehicle[] {
  return listVehicles(category);
}

export { parseSearchQuery };
export {
  filterVehicles,
  listMatchingVehicles,
  searchCatalog,
} from "@/lib/vehicles/search";
