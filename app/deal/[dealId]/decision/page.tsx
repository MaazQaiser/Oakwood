import { DealBuilderPage } from "@/components/templates/pages";
import { getDealUrl } from "@/config/routes";
import { mockDealId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

const step = "decision" as const;

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
    title: "Deal decision",
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

  return (
    <DealBuilderPage title="Deal decision" route={getDealUrl(dealId, step)} />
  );
}
