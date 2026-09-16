import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getMakeUrl } from "@/config/routes";
import { listMakes } from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMakes("van").map((make) => ({ make }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string }>;
}) {
  const { make } = await params;
  const title = getInventoryTitle({ make }, "van");

  return createPageMetadata({
    title,
    path: getMakeUrl(make, "vans"),
    description: `${title.replace(" for Sale", "")} at Oakwood, with monthly payments shown first.`,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ make: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { make } = await params;
  const query = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{ make }}
      category="van"
      basePath={getMakeUrl(make, "vans")}
    />
  );
}
