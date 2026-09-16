import { listVehicles } from "@/lib/vehicles/query";
import { searchCatalog } from "@/lib/vehicles/search";
import { parseSearchQuery, type LockedFilters } from "@/lib/validation/search";
import type { Vehicle } from "@/types/vehicle";
import { VAN_CATEGORY } from "@/features/vans/types";

export function searchVans(
  searchParams: Record<string, string | string[] | undefined>,
  locked: LockedFilters = {},
): Vehicle[] {
  const query = parseSearchQuery(searchParams);
  return searchCatalog(query, locked, { category: VAN_CATEGORY }).vehicles;
}

export function listVanCatalog(): Vehicle[] {
  return listVehicles(VAN_CATEGORY);
}
