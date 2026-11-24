import { notFound } from "next/navigation";
import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  fuelSegmentMeta,
  fuelSlugToType,
  listFuelBrowseSlugs,
} from "@/lib/vehicles/browse-segments";

export function generateStaticParams() {
  return listFuelBrowseSlugs().map((fuel) => ({ fuel }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fuel: string }>;
}) {
  const { fuel } = await params;
  const fuelType = fuelSlugToType(fuel);
  if (!fuelType) {
    return createPageMetadata({
      title: "Used cars",
      path: "/used-cars",
      indexable: false,
    });
  }
  const meta = fuelSegmentMeta(fuelType);
  return createPageMetadata({
    title: meta.title,
    path: meta.canonicalPath,
    description: meta.description,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ fuel: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { fuel } = await params;
  const fuelType = fuelSlugToType(fuel);
  if (!fuelType) {
    notFound();
  }
  const query = await searchParams;
  const meta = fuelSegmentMeta(fuelType);

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{
        fuel: fuelType,
        browse: {
          title: meta.title,
          description: meta.description,
          breadcrumbLabel: meta.breadcrumbLabel,
        },
      }}
      basePath={meta.canonicalPath}
    />
  );
}