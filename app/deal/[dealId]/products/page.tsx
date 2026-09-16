import { redirect } from "next/navigation";
import { getDealUrl } from "@/config/routes";
import { mockDealId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

const step = "products" as const;

export function generateStaticParams() {
  return [{ dealId: mockDealId }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;

  return createPageMetadata({
    title: "Optional products",
    path: getDealUrl(dealId, step),
    indexable: false,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  redirect(getDealUrl(dealId));
}
