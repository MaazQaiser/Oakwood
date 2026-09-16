import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getLocationMakeUrl } from "@/config/routes";
import { listLocationSlugs, listMakes } from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listLocationSlugs().flatMap((location) =>
    listMakes("car").map((make) => ({ location, make })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; make: string }>;
}) {
  const { location, make } = await params;

  return createPageMetadata({
    title: getInventoryTitle({ location, make }),
    path: getLocationMakeUrl(location, make),
    description: `${getInventoryTitle({ location, make })} at Oakwood.`,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ location: string; make: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { location, make } = await params;
  const query = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{ location, make }}
      basePath={getLocationMakeUrl(location, make)}
    />
  );
}
