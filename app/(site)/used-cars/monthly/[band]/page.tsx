import { notFound } from "next/navigation";
import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { MONTHLY_BUDGET_BANDS } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  isMonthlyBudgetBand,
  monthlyBandMeta,
  monthlyBandToQuery,
} from "@/lib/vehicles/browse-segments";

export function generateStaticParams() {
  return MONTHLY_BUDGET_BANDS.map((band) => ({ band }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ band: string }>;
}) {
  const { band } = await params;
  if (!isMonthlyBudgetBand(band)) {
    return createPageMetadata({
      title: "Used cars",
      path: "/used-cars",
      indexable: false,
    });
  }
  const meta = monthlyBandMeta(band);
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
  params: Promise<{ band: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { band } = await params;
  if (!isMonthlyBudgetBand(band)) {
    notFound();
  }
  const query = await searchParams;
  const meta = monthlyBandMeta(band);

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{
        lockedQuery: monthlyBandToQuery(band),
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