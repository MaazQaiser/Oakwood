import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Search used cars",
  path: routes.search,
  description:
    "Search Oakwood used cars by monthly payment, make, model, location and finance budget.",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={params}
      variant="search"
      basePath={routes.search}
    />
  );
}
