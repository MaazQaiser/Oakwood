"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import {
  CompareEmptySlot,
  CompareVehicleCard,
} from "@/components/compare/CompareVehicleCard";
import { CompareSpecTable } from "@/components/compare/CompareSpecTable";
import { EmptyState } from "@/components/ui/Feedback";
import { getCompareUrl, parseCompareIds, routes } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { pruneCompareIds, resolveCompareVehicles } from "@/lib/compare/catalog";
import { compareCopy } from "@/lib/compare/copy";
import { createBreadcrumbs } from "@/lib/seo";

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
  const pathname = usePathname();
  const viewed = useRef(false);
  const queryApplied = useRef(false);
  const queryKey = initialIds.join(",");

  useEffect(() => {
    if (!ready) {
      return;
    }
    const fromQuery = pruneCompareIds(parseCompareIds(queryKey));
    if (!queryApplied.current) {
      queryApplied.current = true;
      if (fromQuery.length > 0) {
        hydrateFromQuery(fromQuery);
        return;
      }
    }
    const canonical = getCompareUrl(stockIds);
    const current = `${pathname}${window.location.search}`;
    if (current !== canonical) {
      router.replace(canonical, { scroll: false });
    }
  }, [ready, queryKey, stockIds, pathname, router, hydrateFromQuery]);

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
        <CompareBackLink />
      </PageBanner>
      <Section>
        <Container width="wide">
          {!ready ? null : vehicles.length === 0 ? (
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
              <div className="grid gap-4 md:grid-cols-2">
                {vehicles.map((vehicle) => (
                  <CompareVehicleCard
                    key={vehicle.stockId}
                    vehicle={vehicle}
                  />
                ))}
                {vehicles.length === 1 ? <CompareEmptySlot /> : null}
              </div>
              <CompareSpecTable vehicles={vehicles} />
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
