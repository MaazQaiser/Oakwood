import { redirect } from "next/navigation";
import { JourneyStart } from "@/components/journeys/JourneyStart";
import { getBoundDeal } from "@/features/deal/session";
import { DEAL_ENTRY_BODY, DEAL_ENTRY_HEADING } from "@/lib/deal/copy";
import { getDealUrl, getEligibilityUrl, getUsedCarsUrl, routes } from "@/config/routes";
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
    redirect(getDealUrl(deal.id));
  }

  return (
    <JourneyStart
      title={DEAL_ENTRY_HEADING}
      body={DEAL_ENTRY_BODY}
      primary={{ href: getUsedCarsUrl(), label: "Browse cars" }}
      secondary={{ href: getEligibilityUrl(), label: "Check my eligibility" }}
    />
  );
}
