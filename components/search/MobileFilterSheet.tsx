"use client";

import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Dialogs";
import { FilterFields } from "@/components/search/FilterFields";
import type { LockedFilters, SearchQuery } from "@/lib/validation/search";
import type { CustomerFinanceMode } from "@/features/eligibility/CustomerFinanceProvider";
import type { VehicleCategory } from "@/types/vehicle";

export function MobileFilterSheet({
  open,
  query,
  locked,
  financeMode,
  resultCount,
  onChange,
  onClose,
  onClear,
  category = "car",
  resultLabel = "cars",
}: {
  open: boolean;
  query: SearchQuery;
  locked: LockedFilters;
  financeMode: CustomerFinanceMode;
  resultCount: number;
  onChange: (patch: Partial<SearchQuery>) => void;
  onClose: () => void;
  onClear: () => void;
  category?: VehicleCategory;
  resultLabel?: string;
}) {
  return (
    <Drawer
      open={open}
      title="Filters"
      size="full"
      onClose={onClose}
      headerAction={
        <Button variant="text" onClick={onClear}>
          Clear all
        </Button>
      }
      footer={
        <Button className="w-full" onClick={onClose}>
          Show {resultCount} {resultCount === 1 ? resultLabel.replace(/s$/, "") : resultLabel}
        </Button>
      }
    >
      <FilterFields
        query={query}
        locked={locked}
        financeMode={financeMode}
        onChange={onChange}
        category={category}
        idPrefix="mobile-"
      />
    </Drawer>
  );
}
