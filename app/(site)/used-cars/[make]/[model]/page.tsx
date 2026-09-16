import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getModelUrl } from "@/config/routes";
import { listMakes, listModels } from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listMakes("car").flatMap((make) =>
    listModels("car", make).map((model) => ({ make, model })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string }>;
}) {
  const { make, model } = await params;

  return createPageMetadata({
    title: getInventoryTitle({ make, model }),
    path: getModelUrl(make, model, "cars"),
    description: `${getInventoryTitle({ make, model })} at Oakwood, with monthly payments and key specification.`,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ make: string; model: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { make, model } = await params;
  const query = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{ make, model }}
      basePath={getModelUrl(make, model, "cars")}
    />
  );
}
