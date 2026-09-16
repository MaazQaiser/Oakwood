import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";

const copy = getSearchCopy("van");

export const metadata = createPageMetadata({
  title: copy.landingTitle,
  path: routes.usedVans,
  description: copy.landingDescription,
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
      category="van"
      basePath={routes.usedVans}
    />
  );
}
