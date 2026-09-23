import { FINANCE_INTENTS } from "@/config/finance";
import { getEligibilityUrl, getFinanceCalculatorUrl, getFinanceIntentUrl, getUsedCarsUrl, getUsedVansUrl, routes } from "@/config/routes";
import { FinanceComparison } from "@/features/finance/intent/components/FinanceComparison";
import { FinanceCTA } from "@/features/finance/intent/components/FinanceCTA";
import { FinanceDisclaimer } from "@/features/finance/intent/components/FinanceDisclaimer";
import { FinanceEducationCards } from "@/features/finance/intent/components/FinanceEducationCards";
import { FinanceExplainer } from "@/features/finance/intent/components/FinanceExplainer";
import { FinanceFAQ } from "@/features/finance/intent/components/FinanceFAQ";
import { FinanceIntentHero } from "@/features/finance/intent/components/FinanceIntentHero";
import { FinanceIntentViewTracker } from "@/features/finance/intent/components/FinanceIntentViewTracker";
import { FinanceRelatedLinks } from "@/features/finance/intent/components/FinanceRelatedLinks";
import { FinanceStep } from "@/features/finance/intent/components/FinanceStep";
import { hpPcpComparison } from "@/lib/finance/intent/content";
import { FINANCE_INTENT_ELIGIBILITY_SUPPORTING } from "@/lib/finance/intent/copy";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { createBreadcrumbs } from "@/lib/seo";
import type { FinanceIntentPageContent } from "@/types/finance-intent";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FinanceIntentPage({
  content,
}: {
  content: FinanceIntentPageContent;
}) {
  const navTitle =
    FINANCE_INTENTS.find((intent) => intent.slug === content.slug)?.title ??
    content.eyebrow;
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Finance", href: routes.finance },
    { label: navTitle, href: getFinanceIntentUrl(content.slug) },
  ]);

  return (
    <>
      <JsonLd data={createFaqJsonLd(content.faqs)} />
      <FinanceIntentViewTracker intent={content.slug} />
      <FinanceIntentHero
        eyebrow={content.eyebrow}
        title={content.h1}
        intro={content.intro}
        intent={content.slug}
        supporting={FINANCE_INTENT_ELIGIBILITY_SUPPORTING}
        secondary={content.secondaryCta}
        breadcrumbs={breadcrumbs}
      />
      <FinanceExplainer block={content.whatThisMeans} headingId="what-this-means" />
      <FinanceExplainer block={content.howOakwoodHelps} headingId="how-oakwood-helps" />
      <FinanceExplainer block={content.eligibility} headingId="eligibility" />
      {content.education.steps ? (
        <FinanceStep title={content.education.title} steps={content.education.steps} />
      ) : null}
      {content.education.cards ? (
        <FinanceEducationCards
          title={content.education.steps ? "The details" : content.education.title}
          paragraphs={
            content.education.steps ? undefined : content.education.paragraphs
          }
          cards={content.education.cards}
        />
      ) : null}
      {content.education.comparison ? (
        <FinanceComparison rows={hpPcpComparison} />
      ) : null}
      <FinanceFAQ items={content.faqs} intent={content.slug} />
      <FinanceCTA intent={content.slug} secondary={content.secondaryCta} />
      <FinanceCTA intent={content.slug} sticky />
      <FinanceRelatedLinks
        links={[
          ...content.related,
          { href: routes.finance, label: "Car finance" },
          { href: getEligibilityUrl(), label: "Check my eligibility" },
          { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
          { href: getUsedCarsUrl(), label: "Used cars" },
          { href: getUsedVansUrl(), label: "Used vans" },
          { href: routes.partExchange, label: "Part exchange" },
        ]}
      />
      <FinanceDisclaimer />
    </>
  );
}
