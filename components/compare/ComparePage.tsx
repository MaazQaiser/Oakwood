"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import {
  CompareEmptySlot,
  CompareVehicleCard,
} from "@/components/compare/CompareVehicleCard";
import { CompareSpecTable } from "@/components/compare/CompareSpecTable";
import { VehiclePriceToggle } from "@/components/vehicle/VehiclePriceToggle";
import { EmptyState } from "@/components/ui/Feedback";
import { getCompareUrl, parseCompareIds, routes } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { pruneCompareIds, resolveCompareVehicles } from "@/lib/compare/catalog";
import {
  COMPARE_MAX,
  COMPARE_MIN_FOR_TABLE,
  compareCopy,
} from "@/lib/compare/copy";
import {
  readStoredListingPriceView,
  storeListingPriceView,
  type ListingPriceView,
} from "@/lib/vehicles/searchCopy";
import { createBreadcrumbs } from "@/lib/seo";
import { cn } from "@/lib/cn";

function CompareBackLink() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-body-sm font-semibold text-primary underline-offset-2 hover:underline"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(routes.usedCars);
      }}
    >
      ← {compareCopy.back}
    </button>
  );
}

export function ComparePage({ initialIds = [] }: { initialIds?: string[] }) {
  const { stockIds, ready, hydrateFromQuery } = useCompare();
  const router = useRouter();
  const viewed = useRef(false);
  const lastQueryKey = useRef<string | null>(null);
  const allowUrlSync = useRef(false);
  const queryKey = initialIds.join(",");
  const [priceView, setPriceView] = useState<ListingPriceView>("total");

  useEffect(() => {
    const stored = readStoredListingPriceView();
    if (stored) {
      setPriceView(stored);
    }
  }, []);

  // Re-seed whenever ?ids= changes (ComparePage can stay mounted across navigations).
  useLayoutEffect(() => {
    if (!ready) {
      return;
    }
    if (lastQueryKey.current === queryKey) {
      allowUrlSync.current = true;
      return;
    }
    lastQueryKey.current = queryKey;
    const fromQuery = pruneCompareIds(parseCompareIds(queryKey));
    if (fromQuery.length > 0) {
      // Avoid syncing the previous selection over a longer URL list.
      allowUrlSync.current = false;
      hydrateFromQuery(fromQuery);
      allowUrlSync.current = true;
      return;
    }
    allowUrlSync.current = true;
  }, [ready, queryKey, hydrateFromQuery]);

  useEffect(() => {
    if (!ready || !allowUrlSync.current) {
      return;
    }
    const canonical = getCompareUrl(stockIds);
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === canonical) {
      return;
    }
    // Defer so hydrateFromQuery state is committed before we rewrite ?ids=.
    const timer = window.setTimeout(() => {
      if (!allowUrlSync.current) {
        return;
      }
      const next = getCompareUrl(stockIds);
      const live = `${window.location.pathname}${window.location.search}`;
      if (live !== next) {
        router.replace(next, { scroll: false });
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [ready, stockIds, router]);

  useEffect(() => {
    if (!ready || viewed.current) {
      return;
    }
    viewed.current = true;
    trackEvent(analyticsEvents.compareViewed, {
      count:
        pruneCompareIds(parseCompareIds(queryKey)).length || stockIds.length,
    });
  }, [ready, queryKey, stockIds.length]);

  const vehicles = resolveCompareVehicles(stockIds);
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: compareCopy.title, href: routes.compare },
  ]);
  const showEmptySlot = vehicles.length > 0 && vehicles.length < COMPARE_MAX;

  return (
    <>
      <PageBanner
        title={compareCopy.title}
        description={
          vehicles.length === 0
            ? compareCopy.emptyDescription
            : compareCopy.countDescription(vehicles.length)
        }
        breadcrumbs={breadcrumbs}
      >
        <div className="flex flex-wrap items-center gap-4">
          <CompareBackLink />
          <Button href={routes.usedCars} variant="text" className="px-0">
            {compareCopy.changeSelection}
          </Button>
        </div>
      </PageBanner>
      <Section>
        <Container width="wide">
          {!ready ? (
            <p className="text-body-sm text-muted">Loading comparison…</p>
          ) : vehicles.length === 0 ? (
            <EmptyState
              title={compareCopy.emptyTitle}
              actions={
                <Button href={routes.usedCars}>{compareCopy.browseCars}</Button>
              }
            >
              {compareCopy.emptyBody}
            </EmptyState>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-body-sm text-muted">
                    {vehicles.length < COMPARE_MIN_FOR_TABLE
                      ? compareCopy.oneCarBody
                      : compareCopy.trayHint(vehicles.length)}
                  </p>
                </div>
                {vehicles.length >= COMPARE_MIN_FOR_TABLE ? (
                  <div className="w-full max-w-xs">
                    <VehiclePriceToggle
                      value={priceView}
                      onChange={(next) => {
                        setPriceView(next);
                        storeListingPriceView(next);
                      }}
                    />
                  </div>
                ) : null}
              </div>

              {vehicles.length === 1 ? (
                <div className="mt-6 rounded-[22px] bg-[#ECF3F8] px-5 py-4 text-[#002852]">
                  <p className="text-label">{compareCopy.oneCarTitle}</p>
                  <p className="mt-1 text-body-sm text-secondary">
                    {compareCopy.oneCarBody}
                  </p>
                </div>
              ) : null}

              <div className="-mx-[var(--oak-page-x)] mt-6 overflow-x-auto px-[var(--oak-page-x)] overscroll-x-contain [scrollbar-width:thin] md:mx-0 md:overflow-visible md:px-0">
                <div
                  className={cn(
                    "grid gap-4",
                    "w-max grid-flow-col auto-cols-[minmax(16rem,18rem)] md:w-full md:auto-cols-fr md:grid-flow-row",
                    vehicles.length + (showEmptySlot ? 1 : 0) === 1 &&
                      "md:grid-cols-1",
                    vehicles.length + (showEmptySlot ? 1 : 0) === 2 &&
                      "md:grid-cols-2",
                    vehicles.length + (showEmptySlot ? 1 : 0) === 3 &&
                      "md:grid-cols-3",
                    vehicles.length + (showEmptySlot ? 1 : 0) >= 4 &&
                      "md:grid-cols-2 xl:grid-cols-4",
                  )}
                >
                  {vehicles.map((vehicle) => (
                    <CompareVehicleCard
                      key={vehicle.stockId}
                      vehicle={vehicle}
                      priceView={priceView}
                    />
                  ))}
                  {showEmptySlot ? <CompareEmptySlot /> : null}
                </div>
              </div>

              {vehicles.length >= COMPARE_MIN_FOR_TABLE ? (
                <CompareSpecTable vehicles={vehicles} />
              ) : (
                <div className="mt-8">
                  <Button href={routes.usedCars}>{compareCopy.browseCars}</Button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
