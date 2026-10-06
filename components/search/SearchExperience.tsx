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
import { SearchRecovery } from "@/components/search/SearchRecovery";
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
  applyUnmatchedRemainder,
  describeClosestMatches,
  describeRelaxation,
  describeShowingWithout,
  describeUnmatchedSearch,
  getClosestSearchResults,
  relaxedKeysFrom,
  unmatchedRemainderFrom,
} from "@/lib/vehicles/closest";
import {
  interpretNaturalLanguage,
  removeNaturalLanguageTerm,
} from "@/lib/vehicles/natural-language";
import {
  FEW_RESULTS_THRESHOLD,
  SEARCH_PAGE_SIZE,
  filterVehicles,
  getAlternativeSearches,
  resolveSearchQuery,
  sortVehicles,
} from "@/lib/vehicles/search";
import { countLabel, fewResultsLabel, getSearchCopy } from "@/lib/vehicles/searchCopy";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import type { Vehicle } from "@/types/vehicle";
import { getMakeUrl, routes, type StockCategory } from "@/config/routes";

function stripTermFromQuery(
  q: string | undefined,
  key: keyof SearchQuery,
  catalog: Vehicle[],
  value?: string,
): string | undefined {
  if (!q) {
    return q;
  }

  const { terms } = interpretNaturalLanguage(q, catalog);
  const matches = terms
    .filter((term) => {
      const keyMatch =
        term.key === key ||
        (key === "monthly" && term.key === "monthly_max") ||
        (key === "monthly_max" && term.key === "monthly") ||
        (key === "min_price" && term.key === "max_price");
      if (!keyMatch) {
        return false;
      }
      if (!value) {
        return true;
      }
      return term.value.toLowerCase() === value.toLowerCase();
    })
    .sort((a, b) => b.start - a.start);

  return matches.reduce(
    (current, term) => removeNaturalLanguageTerm(current, term),
    q,
  ).trim() || undefined;
}

function stripKeysFromQuery(
  q: string | undefined,
  keys: Array<keyof SearchQuery>,
  catalog: Vehicle[],
): string | undefined {
  return keys.reduce(
    (current, key) => stripTermFromQuery(current, key, catalog),
    q,
  );
}

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

  const unmatchedRemainder = useMemo(
    () => unmatchedRemainderFrom(resolved, catalog),
    [resolved, catalog],
  );

  const matches = useMemo(() => {
    return sortVehicles(
      applyUnmatchedRemainder(
        filterVehicles(catalog, resolved, {
          maxAdvance,
          deposit: finance.deposit,
        }),
        unmatchedRemainder,
      ),
      getSearchSort(resolved),
      {
        preferAffordable: eligible,
        maxAdvance,
        deposit: finance.deposit,
      },
    );
  }, [
    catalog,
    resolved,
    maxAdvance,
    eligible,
    finance.deposit,
    unmatchedRemainder,
  ]);

  const recovery = useMemo(() => {
    if (matches.length > 0) {
      return null;
    }
    const closest = getClosestSearchResults(resolved, catalog, {
      maxAdvance,
      deposit: finance.deposit,
      locked: context.locked,
      category: context.category,
      preferAffordable: eligible,
    });
    if (closest.closest.length === 0) {
      return null;
    }
    return closest;
  }, [matches.length, resolved, catalog, maxAdvance, finance.deposit, context.locked, context.category, eligible]);

  const results = recovery?.closest ?? matches;
  const total = results.length;
  const displayed = results.slice(0, page * SEARCH_PAGE_SIZE);
  const relaxedKeys = recovery ? relaxedKeysFrom(recovery.constraints) : [];

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
    const nextQ = stripTermFromQuery(resolved.q, key, catalog, value);
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
      update({ [key]: next || undefined, q: nextQ });
      return;
    }
    update({ [key]: undefined, q: nextQ });
  }

  function clearFilters() {
    trackEvent(analyticsEvents.filtersCleared, { category: context.category });
    navigate({
      make: context.locked.make,
      model: context.locked.model,
      location: context.locked.location,
    });
  }

  function changeMake(makeSlug: string | undefined) {
    trackEvent(analyticsEvents.filterApplied, {
      make: makeSlug,
      category: context.category,
    });
    if (vanEvents) {
      trackEvent(vanEvents.filterApplied, { make: makeSlug });
    }

    const stockCategory: StockCategory =
      context.category === "van" ? "vans" : "cars";
    const hub =
      stockCategory === "vans" ? routes.usedVans : routes.usedCars;
    const nextQuery = mergeSearchQuery(
      { ...resolved, page: undefined },
      { make: makeSlug, model: undefined },
    );

    if (context.locked.make) {
      const basePath = makeSlug ? getMakeUrl(makeSlug, stockCategory) : hub;
      const locked = makeSlug ? { make: makeSlug } : {};
      router.push(buildSearchHref(basePath, nextQuery, locked));
      return;
    }

    update({ make: makeSlug, model: undefined });
  }

  const chips = getFilterChips(resolved, context.locked, removeFilter, relaxedKeys);
  const removableChips = chips.filter((chip) => Boolean(chip.onRemove));
  const alternatives = getAlternativeSearches(resolved, context.locked, {
    category: context.category,
    basePath: context.basePath,
  });
  const fewResults =
    !recovery &&
    total > 0 &&
    total <= FEW_RESULTS_THRESHOLD &&
    removableChips.length > 0;
  const canLoadMore = displayed.length < total;
  const nextPage = page + 1;
  const nextHref = buildSearchHref(
    context.basePath,
    { ...resolved, page: String(nextPage) },
    context.locked,
  );
  const unmatchedCopy = describeUnmatchedSearch(
    resolved,
    context.category,
    unmatchedRemainder,
  );

  useEffect(() => {
    if (matches.length > 0) {
      return;
    }
    trackEvent(analyticsEvents.zeroResultsViewed, {
      category: context.category,
      recovered: Boolean(recovery),
      relaxed: recovery?.constraints.map((item) => item.id).join(",") ?? "",
    });
    if (context.category === "van") {
      trackEvent(analyticsEvents.vanZeroResults, {
        recovered: Boolean(recovery),
      });
    }
  }, [matches.length, recovery, context.category]);

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
          onMakeChange={changeMake}
        />

        <div className="min-w-0 flex-1" id="results">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[1.375rem] font-medium leading-tight tracking-[-0.02em] sm:text-2xl" aria-live="polite">
                {countLabel(total, copy)}
              </h2>
              <p className="mt-1 text-body-sm text-muted">
                {recovery
                  ? describeShowingWithout(recovery.constraints)
                  : copy.resultsShowing}
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
            ) : recovery ? (
              <>
                <SearchRecovery
                  copy={copy}
                  unmatched={unmatchedCopy}
                  relaxation={describeRelaxation(recovery.constraints)}
                  closestHeading={describeClosestMatches(
                    recovery.relaxedQuery,
                    context.category,
                  )}
                  showingWithout={describeShowingWithout(recovery.constraints)}
                  onApplyClosest={() => {
                    const q = stripKeysFromQuery(
                      resolved.q,
                      relaxedKeys,
                      catalog,
                    );
                    navigate({
                      ...recovery.relaxedQuery,
                      q,
                      page: undefined,
                    });
                  }}
                />
                <div className="mt-6">
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
                </div>
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
            ) : total === 0 ? (
              <EmptyResults
                copy={copy}
                description={unmatchedCopy || copy.emptyFallback}
                alternatives={alternatives}
                onClear={clearFilters}
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
        onMakeChange={changeMake}
        onClose={() => setFiltersOpen(false)}
        onClear={clearFilters}
      />
    </div>
  );
}
