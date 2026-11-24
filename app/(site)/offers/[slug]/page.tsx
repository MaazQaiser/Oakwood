import { notFound } from "next/navigation";
import { OfferCampaignPage } from "@/features/offers/OfferCampaignPage";
import { getOfferCampaign, listOfferSlugs } from "@/lib/offers/content";
import { getOfferUrl } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listOfferSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = getOfferCampaign(slug);
  if (!offer) {
    return createPageMetadata({
      title: "Offers",
      path: "/offers",
      indexable: false,
    });
  }
  return createPageMetadata({
    title: offer.title,
    path: getOfferUrl(slug),
    description: offer.metaDescription,
    indexable: false,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = getOfferCampaign(slug);
  if (!offer) {
    notFound();
  }
  return <OfferCampaignPage offer={offer} />;
}