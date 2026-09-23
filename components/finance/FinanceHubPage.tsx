import Link from "next/link";
import { Card } from "@/components/cards/Card";
import { Container, Grid, Section } from "@/components/layout/Container";
import { getFinanceIntentUrl, routes } from "@/config/routes";
import { FinanceCTA } from "@/features/finance/intent/components/FinanceCTA";
import { FinanceDisclaimer } from "@/features/finance/intent/components/FinanceDisclaimer";
import { FinanceFAQ } from "@/features/finance/intent/components/FinanceFAQ";
import { FinanceIntentHero } from "@/features/finance/intent/components/FinanceIntentHero";
import { FinanceIntentViewTracker } from "@/features/finance/intent/components/FinanceIntentViewTracker";
import { FinanceRelatedLinks } from "@/features/finance/intent/components/FinanceRelatedLinks";
import { FinanceStep } from "@/features/finance/intent/components/FinanceStep";
import {
  financeHubContent,
  financeHubFaqs,
  financeHubGuides,
  financeHubRelated,
  financeJourneySteps,
} from "@/lib/finance/intent/content";
import { FINANCE_INTENT_ELIGIBILITY_SUPPORTING } from "@/lib/finance/intent/copy";
import {
  CALCULATOR_APPLICATION_EXPLAIN,
  CALCULATOR_ELIGIBILITY_EXPLAIN,
  CALCULATOR_ESTIMATE_EXPLAIN,
} from "@/lib/finance/calculator-copy";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { createBreadcrumbs } from "@/lib/seo";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FinanceHubPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Finance", href: routes.finance },
  ]);

  return (
    <>
      <JsonLd data={createFaqJsonLd(financeHubFaqs)} />
      <FinanceIntentViewTracker intent="hub" />
      <FinanceIntentHero
        eyebrow={financeHubContent.eyebrow}
        title={financeHubContent.h1}
        intro={financeHubContent.intro}
        intent="hub"
        supporting={FINANCE_INTENT_ELIGIBILITY_SUPPORTING}
        breadcrumbs={breadcrumbs}
      />
      <FinanceStep
        title={financeHubContent.journeyTitle}
        steps={financeJourneySteps}
      />
      <Section>
        <Container>
          <h2 className="text-h2">Estimate, eligibility and application</h2>
          <Grid columns="two" className="mt-6">
            <Card as="article">
              <h3 className="text-h4">Estimate</h3>
              <p className="mt-2 text-body-sm text-muted">
                {CALCULATOR_ESTIMATE_EXPLAIN}
              </p>
            </Card>
            <Card as="article">
              <h3 className="text-h4">Finance eligibility</h3>
              <p className="mt-2 text-body-sm text-muted">
                {CALCULATOR_ELIGIBILITY_EXPLAIN}
              </p>
            </Card>
            <Card as="article" className="md:col-span-2">
              <h3 className="text-h4">Regulated finance application</h3>
              <p className="mt-2 text-body-sm text-muted">
                {CALCULATOR_APPLICATION_EXPLAIN}
              </p>
            </Card>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <h2 className="text-h2">{financeHubContent.guidesTitle}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {financeHubGuides.map((guide) => (
              <li key={guide.slug}>
                <Card as="article" className="h-full">
                  <h3 className="text-h4">
                    <Link
                      href={getFinanceIntentUrl(guide.slug)}
                      className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-body-sm text-muted">{guide.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <FinanceFAQ items={financeHubFaqs} intent="hub" />
      <FinanceCTA intent="hub" />
      <FinanceCTA intent="hub" sticky />
      <FinanceRelatedLinks links={financeHubRelated} />
      <FinanceDisclaimer />
    </>
  );
}
