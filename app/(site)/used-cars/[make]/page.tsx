import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { getMakeUrl } from "@/config/routes";
import { listMakes } from "@/lib/vehicles/query";
import { getInventoryTitle } from "@/lib/vehicles/labels";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listMakes("car").map((make) => ({ make }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string }>;
}) {
  const { make } = await params;

  return createPageMetadata({
    title: getInventoryTitle({ make }),
    path: getMakeUrl(make, "cars"),
    description: `Used ${getInventoryTitle({ make }).replace(" for Sale", "").toLowerCase()} at Oakwood, with monthly payments shown first.`,
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
      basePath={getMakeUrl(make, "cars")}
    />
  );
}
