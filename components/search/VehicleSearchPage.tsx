import { Container, Section } from "@/components/layout/Container";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchExperience } from "@/components/search/SearchExperience";
import { SearchSeoContent } from "@/components/search/SearchSeoContent";
import { FinanceSearchCTA } from "@/components/search/FinanceSearchCTA";
import {
  applyLockedFilters,
  parseSearchQuery,
  type LockedFilters,
} from "@/lib/validation/search";
import { getInventoryContext } from "@/lib/vehicles/inventory";
import { listVehicles } from "@/lib/vehicles/query";
import { searchCatalog } from "@/lib/vehicles/search";
import type { VehicleCategory } from "@/types/vehicle";

export function VehicleSearchPage({
  searchParams,
  locked = {},
  variant = "inventory",
  basePath,
  category = "car",
}: {
  searchParams: Record<string, string | string[] | undefined>;
  locked?: LockedFilters;
  variant?: "inventory" | "search";
  basePath?: string;
  category?: VehicleCategory;
}) {
  const query = parseSearchQuery(searchParams);
  const context = getInventoryContext(locked, {
    variant,
    basePath,
    category,
    query: applyLockedFilters(query, locked),
  });
  const catalog = listVehicles(category);
  const results = searchCatalog(query, locked, { category });
  const loadFailed = query.error === "stock";
  const visibleCount = results.page * results.pageSize;

  return (
    <>
      <Section className="overflow-x-hidden">
        <Container width="wide">
          <SearchHeader context={context} query={query.q} />
          <SearchExperience
            context={context}
            query={applyLockedFilters(query, locked)}
            catalog={catalog}
            initialVehicles={results.vehicles.slice(0, visibleCount)}
            initialTotal={results.total}
            page={results.page}
            loadFailed={loadFailed}
          />
        </Container>
      </Section>
      <SearchSeoContent context={context} />
      <FinanceSearchCTA basePath={context.basePath} category={category} />
    </>
  );
}
