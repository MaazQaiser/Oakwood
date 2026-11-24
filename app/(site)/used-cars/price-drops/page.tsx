import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { priceDropsSegmentMeta } from "@/lib/vehicles/browse-segments";

const meta = priceDropsSegmentMeta;

export const metadata = createPageMetadata({
  title: meta.title,
  path: routes.priceDrops,
  description: meta.description,
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const merged = {
    ...query,
    sort: typeof query.sort === "string" ? query.sort : "price_drop",
  };

  return (
    <VehicleSearchPage
      searchParams={merged}
      locked={{
        lockedQuery: { price_drops: "1" },
        browse: {
          title: meta.title,
          description: meta.description,
          breadcrumbLabel: meta.breadcrumbLabel,
        },
      }}
      basePath={routes.priceDrops}
    />
  );
}