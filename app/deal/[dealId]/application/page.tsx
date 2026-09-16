import { DealApplicationHandoff } from "@/components/deal/DealApplicationHandoff";
import { loadDealPage } from "@/features/deal/load";
import { getDealUrl } from "@/config/routes";
import { mockDealId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

const step = "application" as const;

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
    title: "Finance application",
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
  const model = await loadDealPage(dealId);
  return <DealApplicationHandoff model={model} />;
}
