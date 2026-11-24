import { notFound } from "next/navigation";
import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  bodySegmentMeta,
  bodySlugToStyle,
  listBodyBrowseSlugs,
} from "@/lib/vehicles/browse-segments";

export function generateStaticParams() {
  return listBodyBrowseSlugs().map((type) => ({ type }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const style = bodySlugToStyle(type);
  if (!style) {
    return createPageMetadata({
      title: "Used cars",
      path: "/used-cars",
      indexable: false,
    });
  }
  const meta = bodySegmentMeta(style);
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
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type } = await params;
  const style = bodySlugToStyle(type);
  if (!style) {
    notFound();
  }
  const query = await searchParams;
  const meta = bodySegmentMeta(style);

  return (
    <VehicleSearchPage
      searchParams={query}
      locked={{
        body_style: style,
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