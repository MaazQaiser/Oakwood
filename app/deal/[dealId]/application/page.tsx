import { DealApplicationPage } from "@/components/deal/application/DealApplicationPage";
import { DealStockBootstrap } from "@/components/deal/DealStockBootstrap";
import { loadDealPage } from "@/features/deal/load";
import { resolveDealId } from "@/features/deal/resolve";
import { getDealApplicationUrl } from "@/config/routes";
import { APP_TITLE } from "@/lib/deal/application/copy";
import { createPageMetadata } from "@/lib/seo/metadata";
import { mockDealId } from "@/lib/mock/data";

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
    title: APP_TITLE,
    path: getDealApplicationUrl(dealId),
    indexable: false,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId: dealIdParam } = await params;
  const resolved = await resolveDealId(dealIdParam);
  if (resolved.kind === "bootstrap") {
    // Bootstrap still lands on the primary wizard; application needs a deal draft.
    return (
      <DealStockBootstrap stockId={resolved.stockId} step="reserve" />
    );
  }

  const model = await loadDealPage(resolved.dealId);
  return <DealApplicationPage model={model} />;
}
