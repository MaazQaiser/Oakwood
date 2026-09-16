import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getLocationModelUrl } from "@/config/routes";
import {
  listLocationSlugs,
  listMakes,
  listModels,
} from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listLocationSlugs().flatMap((location) =>
    listMakes("car").flatMap((make) =>
      listModels("car", make).map((model) => ({ location, make, model })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; make: string; model: string }>;
}) {
  const { location, make, model } = await params;

  return createPageMetadata({
    title: getInventoryTitle({ location, make, model }),
    path: getLocationModelUrl(location, make, model),
    description: `${getInventoryTitle({ location, make, model })} at Oakwood.`,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ location: string; make: string; model: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { location, make, model } = await params;
  const query = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{ location, make, model }}
      basePath={getLocationModelUrl(location, make, model)}
    />
  );
}
