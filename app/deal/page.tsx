import { redirect } from "next/navigation";
import { DealEntryClient } from "@/components/deal/DealEntryClient";
import { getBoundDeal } from "@/features/deal/session";
import { getDealUrl, routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Build your deal",
  path: routes.deal,
  description:
    "Choose a used car, then build your finance deal with deposit, term and part exchange.",
  indexable: false,
});

export default async function Page() {
  const deal = await getBoundDeal();
  if (deal) {
    redirect(getDealUrl(deal.id, "part-exchange"));
  }

  return <DealEntryClient />;
}
