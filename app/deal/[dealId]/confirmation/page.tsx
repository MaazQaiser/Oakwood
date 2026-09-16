import { DealBuilderPage } from "@/components/templates/pages";
import { getDealUrl } from "@/config/routes";
import { mockDealId } from "@/lib/mock/data";
import { createPageMetadata } from "@/lib/seo/metadata";

const step = "confirmation" as const;

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
    title: "Deal confirmation",
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
    <DealBuilderPage
      title="Deal confirmation"
      route={getDealUrl(dealId, step)}
    />
  );
}
