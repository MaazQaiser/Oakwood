"use client";

import { Button } from "@/components/ui/Button";
import { VehicleCard } from "@/components/cards/Card";
import { Grid } from "@/components/layout/Container";
import { FinancePersonalisationBanner } from "@/components/search/FinancePersonalisationBanner";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  CONTENT_NO_STOCK_BODY,
  CONTENT_NO_STOCK_TITLE,
  CONTENT_SIMILAR_CARS,
  CONTENT_STOCK_HEADING,
  CONTENT_VIEW_MODEL,
} from "@/lib/content/copy";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";
import { getVehicleUrl } from "@/config/routes";
import type { Vehicle } from "@/types/vehicle";

export function ContentStockSection({
  vehicles,
  similar,
  stockHref,
  similarHref,
  slug,
  viewLabel = CONTENT_VIEW_MODEL,
}: {
  vehicles: Vehicle[];
  similar: Vehicle[];
  stockHref: string;
  similarHref: string;
  slug: string;
  viewLabel?: string;
}) {
  if (vehicles.length === 0) {
    return (
      <section aria-labelledby="content-stock-heading">
        <h2 id="content-stock-heading" className="text-h2">
          {CONTENT_NO_STOCK_TITLE}
        </h2>
        <p className="mt-3 max-w-prose text-body text-muted">{CONTENT_NO_STOCK_BODY}</p>
        <div className="mt-4">
          <Button
            href={similarHref}
            onClick={() =>
              trackEvent(analyticsEvents.modelStockClicked, {
                slug,
                href: similarHref,
                empty: true,
              })
            }
          >
            {CONTENT_SIMILAR_CARS}
          </Button>
        </div>
        {similar.length > 0 ? (
          <Grid columns="cards" className="mt-6">
            {similar.map((vehicle) => (
              <VehicleCard key={vehicle.stockId} vehicle={vehicle} />
            ))}
          </Grid>
        ) : null}
      </section>
    );
  }

  return (
    <section aria-labelledby="content-stock-heading">
      <h2 id="content-stock-heading" className="text-h2">
        {CONTENT_STOCK_HEADING}
      </h2>
      <div className="mt-4">
        <FinancePersonalisationBanner
          copy={getSearchCopy("car")}
          browseHref={stockHref}
        />
      </div>
      <Grid columns="cards" className="mt-6">
        {vehicles.slice(0, 6).map((vehicle, index) => (
          <VehicleCard
            key={vehicle.stockId}
            vehicle={vehicle}
            imagePriority={index === 0}
            action={
              <Button
                href={getVehicleUrl(vehicle)}
                className="w-full"
                onClick={() =>
                  trackEvent(analyticsEvents.modelStockClicked, {
                    slug,
                    stockId: vehicle.stockId,
                  })
                }
              >
                View car
              </Button>
            }
          />
        ))}
      </Grid>
      <div className="mt-6">
        <Button
          href={stockHref}
          variant="secondary"
          onClick={() =>
            trackEvent(analyticsEvents.modelStockClicked, { slug, href: stockHref })
          }
        >
          {viewLabel}
        </Button>
      </div>
    </section>
  );
}
