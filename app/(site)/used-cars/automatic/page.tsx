import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { automaticSegmentMeta } from "@/lib/vehicles/browse-segments";

const meta = automaticSegmentMeta;

export const metadata = createPageMetadata({
  title: meta.title,
  path: routes.usedCarsAutomatic,
  description: meta.description,
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{
        transmission: "Automatic",
        browse: {
          title: meta.title,
          description: meta.description,
          breadcrumbLabel: meta.breadcrumbLabel,
        },
      }}
      basePath={routes.usedCarsAutomatic}
    />
  );
}