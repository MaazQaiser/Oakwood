import { redirectLegacyDealStep } from "@/lib/deal/deal-page";
import { mockDealId } from "@/lib/mock/data";

export function generateStaticParams() {
  return [{ dealId: mockDealId }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  await redirectLegacyDealStep(dealId, "reserve");
}
