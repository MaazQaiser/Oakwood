import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getModelUrl } from "@/config/routes";
import { listMakes, listModels } from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMakes("van").flatMap((make) =>
    listModels("van", make).map((model) => ({ make, model })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string }>;
}) {
  const { make, model } = await params;
  const title = getInventoryTitle({ make, model }, "van");

  return createPageMetadata({
    title,
    path: getModelUrl(make, model, "vans"),
    description: `${title} at Oakwood, with monthly payments and key specification.`,
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
      category="van"
      basePath={getModelUrl(make, model, "vans")}
    />
  );
}
