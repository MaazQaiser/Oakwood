import {
  dealStepMetadata,
  dealStepStaticParams,
  renderDealStepPage,
} from "@/lib/deal/deal-page";

const step = "reserve" as const;

export function generateStaticParams() {
  return dealStepStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  return dealStepMetadata(dealId, step);
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  return renderDealStepPage(dealId, step);
}
