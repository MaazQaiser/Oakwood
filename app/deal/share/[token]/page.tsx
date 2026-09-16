import { DealShareView } from "@/components/deal/DealShareView";
import { loadDealShare } from "@/features/deal/load";
import { getDealShareUrl } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return createPageMetadata({
    title: "Shared deal summary",
    path: getDealShareUrl(token),
    indexable: false,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const snapshot = await loadDealShare(token);
  return <DealShareView snapshot={snapshot} />;
}
