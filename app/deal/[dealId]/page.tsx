import { DealBuilder } from "@/components/deal/DealBuilder";
import { loadDealPage } from "@/features/deal/load";
import { getDealUrl } from "@/config/routes";
import { mockDealId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

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
    title: "Build your deal",
    path: getDealUrl(dealId),
    indexable: false,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const model = await loadDealPage(dealId);
  return <DealBuilder model={model} />;
}
