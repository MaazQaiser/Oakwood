import { redirectLegacyDealStep } from "@/lib/deal/deal-page";

/** Legacy soft-check step — merged into Your deal (cover). */
export default async function Page({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  await redirectLegacyDealStep(dealId, "cover");
}
