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
  onMakeChange,
  category = "car",
}: {
  query: SearchQuery;
  locked: LockedFilters;
  financeMode: CustomerFinanceMode;
  onChange: (patch: Partial<SearchQuery>) => void;
  onMakeChange?: (makeSlug: string | undefined) => void;
  category?: VehicleCategory;
}) {
  return (
    <aside className="hidden min-w-0 lg:block lg:w-72 lg:shrink-0">
      <div className="lg:sticky lg:top-[calc(0.75rem+var(--oak-header-height)+0.75rem)] lg:z-20 lg:max-h-[calc(100dvh-0.75rem-var(--oak-header-height)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:rounded-[18px] lg:border lg:border-border/70 lg:bg-primary-soft lg:p-4 lg:pr-3">
        <p className="text-h4">Filters</p>
        <FilterFields
          query={query}
          locked={locked}
          financeMode={financeMode}
          onChange={onChange}
          onMakeChange={onMakeChange}
          category={category}
          idPrefix="desktop-"
        />
      </div>
    </aside>
  );
}

export { FilterFields as SearchFilters };
