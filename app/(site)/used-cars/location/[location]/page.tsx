import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getLocationStockUrl } from "@/config/routes";
import { listLocationSlugs } from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listLocationSlugs().map((location) => ({ location }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;

  return createPageMetadata({
    title: getInventoryTitle({ location }),
    path: getLocationStockUrl(location),
    description: `${getInventoryTitle({ location })} at Oakwood, with monthly payments shown first.`,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ location: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { location } = await params;
  const query = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{ location }}
      basePath={getLocationStockUrl(location)}
    />
  );
}
