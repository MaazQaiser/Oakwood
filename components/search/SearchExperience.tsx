"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconFilters } from "@/components/ui/icons";
import { FinancePersonalisationBanner } from "@/components/search/FinancePersonalisationBanner";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { MobileFilterSheet } from "@/components/search/MobileFilterSheet";
import {
  ActiveFilterChips,
  getFilterChips,
} from "@/components/search/ActiveFilterChips";
import { MobileSortButton, SortDropdown } from "@/components/search/SortDropdown";
import { VehicleGrid } from "@/components/search/VehicleGrid";
import { EmptyResults, StockErrorState } from "@/components/search/EmptyResults";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  applyLockedFilters,
  buildSearchHref,
  getSearchSort,
  mergeSearchQuery,
  splitFilterValues,
  type SearchQuery,
  type SearchSort,
} from "@/lib/validation/search";
import {
  FEW_RESULTS_THRESHOLD,
  SEARCH_PAGE_SIZE,
  describeSearch,
  filterVehicles,
  getAlternativeSearches,
  resolveSearchQuery,
  sortVehicles,
} from "@/lib/vehicles/search";
import { countLabel, fewResultsLabel, getSearchCopy } from "@/lib/vehicles/searchCopy";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import type { Vehicle } from "@/types/vehicle";

export function SearchExperience({
  context,
  query,
  catalog,
  page,
  loadFailed = false,
}: {
  context: InventoryPageContext;
  query: SearchQuery;
  catalog: Vehicle[];
  initialVehicles: Vehicle[];
  initialTotal: number;
  page: number;
  loadFailed?: boolean;
}) {
  const router = useRouter();
  const finance = useCustomerFinance();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const copy = getSearchCopy(context.category);
  const isVan = context.category === "van";
  const vanEvents = getVanSearchEvents(context.category);

  useEffect(() => {
    if (isVan) {
      trackEvent(analyticsEvents.usedVansViewed);
    }
  }, [isVan]);

  const resolved = useMemo(
    () =>
      resolveSearchQuery(applyLockedFilters(query, context.locked), catalog),
    [query, context.locked, catalog],
  );

  const eligible =
    finance.mode === "personalised" || finance.mode === "ineligible";
  const maxAdvance = eligible ? finance.maxAdvance : undefined;

  const matches = useMemo(() => {
    return sortVehicles(
      filterVehicles(catalog, resolved, {
        maxAdvance,
        deposit: finance.deposit,
      }),
      getSearchSort(resolved),
      {
        preferAffordable: eligible,
        maxAdvance,
        deposit: finance.deposit,
      },
    );
  }, [catalog, resolved, maxAdvance, eligible, finance.deposit]);

  const total = matches.length;
  const displayed = matches.slice(0, page * SEARCH_PAGE_SIZE);

  function navigate(nextQuery: SearchQuery) {
    const href = buildSearchHref(
      context.basePath,
      applyLockedFilters(nextQuery, context.locked),
      context.locked,
    );
    router.replace(href, { scroll: false });
  }

  function update(patch: Partial<SearchQuery>) {
    if (patch.affordable === "1") {
      trackEvent(analyticsEvents.affordableToMeEnabled, {
        category: context.category,
      });
    }
    if (Object.keys(patch).some((key) => key !== "sort" && key !== "page")) {
      trackEvent(analyticsEvents.filterApplied, {
        ...patch,
        category: context.category,
      });
      if (vanEvents) {
        trackEvent(vanEvents.filterApplied, patch);
      }
    }
    if (patch.deposit && eligible) {
      finance.setDeposit(Number(patch.deposit));
    }
    if (patch.term && eligible) {
      finance.setTerm(Number(patch.term));
    }
    navigate(mergeSearchQuery({ ...resolved, page: undefined }, patch));
  }

  function removeFilter(key: keyof SearchQuery, value?: string) {
    trackEvent(analyticsEvents.filterRemoved, {
      key,
      value,
      category: context.category,
    });
    if (vanEvents) {
      trackEvent(vanEvents.filterRemoved, { key, value });
    }
    if (
      value &&
      (key === "fuel" ||
        key === "transmission" ||
        key === "body_style" ||
        key === "location" ||
        key === "colour")
    ) {
      const next = splitFilterValues(resolved[key])
        .filter((item) => item !== value)
        .join(",");
      update({ [key]: next || undefined });
      return;
    }
    update({ [key]: undefined });
  }

  function clearFilters() {
    trackEvent(analyticsEvents.filtersCleared, { category: context.category });
    navigate({
      make: context.locked.make,
      model: context.locked.model,
      location: context.locked.location,
    });
  }

  const chips = getFilterChips(resolved, context.locked, removeFilter);
  const removableChips = chips.filter((chip) => Boolean(chip.onRemove));
  const alternatives = getAlternativeSearches(resolved, context.locked, {
    category: context.category,
    basePath: context.basePath,
  });
  const fewResults =
    total > 0 && total <= FEW_RESULTS_THRESHOLD && removableChips.length > 0;
  const canLoadMore = displayed.length < total;
  const nextPage = page + 1;
  const nextHref = buildSearchHref(
    context.basePath,
    { ...resolved, page: String(nextPage) },
    context.locked,
  );

  function trackSort(sort: SearchSort) {
    trackEvent(analyticsEvents.sortChanged, { sort, category: context.category });
    if (vanEvents) {
      trackEvent(vanEvents.sortChanged, { sort });
    }
    update({ sort });
  }

  return (
    <div className="mt-8">
      <FinancePersonalisationBanner copy={copy} />

      <div className="sticky top-[var(--oak-header-height)] z-30 mt-6 border-b border-border bg-page py-3 lg:hidden">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setFiltersOpen(true);
              trackEvent(analyticsEvents.filterOpened, {
                category: context.category,
              });
            }}
          >
            <IconFilters />
            Filters
          </Button>
          <MobileSortButton
            query={resolved}
            newestLabel={copy.newestSort}
            onChange={trackSort}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        <FilterSidebar
          query={resolved}
          locked={context.locked}
          financeMode={finance.mode}
          category={context.category}
          onChange={update}
        />

        <div className="min-w-0 flex-1" id="results">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-h3" aria-live="polite">
                {countLabel(total, copy)}
              </h2>
              <p className="mt-1 text-body-sm text-muted">
                {copy.resultsShowing}
              </p>
            </div>
            <SortDropdown
              query={resolved}
              newestLabel={copy.newestSort}
              onChange={trackSort}
            />
          </div>

          <div className="mt-4">
            <ActiveFilterChips chips={chips} onClearAll={clearFilters} />
          </div>

          {fewResults ? (
            <p className="mt-4 text-body-sm text-muted">
              {fewResultsLabel(total, copy)}
            </p>
          ) : null}

          <div className="mt-6">
            {loadFailed ? (
              <StockErrorState
                copy={copy}
                onRetry={() => navigate({ ...resolved, error: undefined })}
              />
            ) : total === 0 ? (
              <EmptyResults
                copy={copy}
                description={
                  describeSearch(resolved, context.category) ??
                  copy.emptyFallback
                }
                alternatives={alternatives}
                onClear={clearFilters}
                onNearest={() => {
                  update({
                    monthly_max: resolved.monthly_max
                      ? String(Number(resolved.monthly_max) + 50)
                      : undefined,
                    monthly: undefined,
                    max_price: undefined,
                    affordable: undefined,
                  });
                }}
              />
            ) : (
              <>
                <VehicleGrid
                  vehicles={displayed}
                  financeMode={finance.mode}
                  maxAdvance={finance.maxAdvance}
                  deposit={finance.deposit}
                  term={finance.term}
                  category={context.category}
                  viewLabel={copy.viewCta}
                  affordableLabel={copy.affordableCta}
                  onAdjustDeposit={() => finance.setAssumptionsOpen(true)}
                  onViewAffordable={() => {
                    if (vanEvents) {
                      trackEvent(vanEvents.financeClicked, {
                        source: "affordable_filter",
                      });
                    }
                    update({ affordable: "1" });
                  }}
                />
                {canLoadMore ? (
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <Button href={nextHref} variant="secondary">
                      {copy.loadMore}
                    </Button>
                    <p className="text-caption text-muted">
                      Showing {displayed.length} of {total}
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <MobileFilterSheet
        open={filtersOpen}
        query={resolved}
        locked={context.locked}
        financeMode={finance.mode}
        resultCount={total}
        category={context.category}
        resultLabel={copy.nounPlural}
        onChange={update}
        onClose={() => setFiltersOpen(false)}
        onClear={clearFilters}
      />
    </div>
  );
}
