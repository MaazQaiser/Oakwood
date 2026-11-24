import { notFound, permanentRedirect } from "next/navigation";
import { FinanceIntentPage } from "@/features/finance/intent/FinanceIntentPage";
import {
  FINANCE_INTENTS,
  isFinanceIntentSlug,
} from "@/config/finance";
import { getFinanceIntentUrl, routes } from "@/config/routes";
import { getFinanceIntentPageContent } from "@/lib/finance/intent/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return FINANCE_INTENTS.map((intent) => ({ intent: intent.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ intent: string }>;
}) {
  const { intent } = await params;

  if (intent === "0-percent") {
    return createPageMetadata({
      title: "0% interest free car finance",
      path: routes.interestFree,
    });
  }

  if (!isFinanceIntentSlug(intent)) {
    return createPageMetadata({
      title: "Finance",
      path: getFinanceIntentUrl(intent),
      indexable: false,
    });
  }

  const content = getFinanceIntentPageContent(intent);

  return createPageMetadata({
    title: content.metaTitle,
    path: getFinanceIntentUrl(content.slug),
    description: content.metaDescription,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ intent: string }>;
}) {
  const { intent } = await params;

  if (intent === "0-percent") {
    permanentRedirect(routes.interestFree);
  }

  if (!isFinanceIntentSlug(intent)) {
    notFound();
  }

  return <FinanceIntentPage content={getFinanceIntentPageContent(intent)} />;
}
