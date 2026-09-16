"use client";

import { FilterFields } from "@/components/search/FilterFields";
import type { LockedFilters, SearchQuery } from "@/lib/validation/search";
import type { CustomerFinanceMode } from "@/features/eligibility/CustomerFinanceProvider";
import type { VehicleCategory } from "@/types/vehicle";

export function FilterSidebar({
  query,
  locked,
  financeMode,
  onChange,
  category = "car",
}: {
  query: SearchQuery;
  locked: LockedFilters;
  financeMode: CustomerFinanceMode;
  onChange: (patch: Partial<SearchQuery>) => void;
  category?: VehicleCategory;
}) {
  return (
    <aside className="hidden min-w-0 lg:block lg:w-72 lg:shrink-0">
      <div className="lg:sticky lg:top-[calc(var(--oak-header-height)+1rem)]">
        <p className="text-h4">Filters</p>
        <FilterFields
          query={query}
          locked={locked}
          financeMode={financeMode}
          onChange={onChange}
          category={category}
          idPrefix="desktop-"
        />
      </div>
    </aside>
  );
}

export { FilterFields as SearchFilters };
