import { redirect } from "next/navigation";
import { DealStockBootstrap } from "@/components/deal/DealStockBootstrap";
import { resolveDealId } from "@/features/deal/resolve";
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
  const { dealId: param } = await params;
  const resolved = await resolveDealId(param);
  if (resolved.kind === "bootstrap") {
    return (
      <DealStockBootstrap stockId={resolved.stockId} step="part-exchange" />
    );
  }
  redirect(getDealUrl(resolved.dealId, "part-exchange"));
}
