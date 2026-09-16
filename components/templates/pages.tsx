import { PageTemplate } from "@/components/content/PageTemplate";
import { FinanceHubPage } from "@/components/finance/FinanceHubPage";
import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { BlogHub } from "@/features/content/components/BlogHub";
import { ContentDocument } from "@/features/content/components/ContentDocument";
import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { getContentBySlug } from "@/content/editorial";
import { getLegalDocumentByPath } from "@/content/legal";
import { routes } from "@/config/routes";

export function UsedCarsPage() {
  return (
    <VehicleSearchPage searchParams={{}} />
  );
}

export function UsedVansPage() {
  return (
    <VehicleSearchPage searchParams={{}} category="van" basePath={routes.usedVans} />
  );
}

export function MakePage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return <PageTemplate title={title} route={route} template="MakePage" />;
}

export function ModelPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return <PageTemplate title={title} route={route} template="ModelPage" />;
}

export function LocationStockPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return (
    <PageTemplate title={title} route={route} template="LocationStockPage" />
  );
}

export function SearchResultsPage({
  querySummary,
}: {
  querySummary?: string;
}) {
  void querySummary;
  return <VehicleSearchPage searchParams={{}} variant="search" />;
}

export function VehicleDetailPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return (
    <PageTemplate title={title} route={route} template="VehicleDetailPage" />
  );
}

export function FinancePage() {
  return <FinanceHubPage />;
}

export { FinanceCalculatorPage } from "@/features/finance/calculator";
export { FinanceIntentPage } from "@/features/finance/intent/FinanceIntentPage";

export function EligibilityPage({
  title,
  route,
  template = "EligibilityPage",
}: {
  title: string;
  route: string;
  template?: string;
}) {
  return <PageTemplate title={title} route={route} template={template} />;
}

export function EligibilityResultPage() {
  return (
    <PageTemplate
      title="Eligibility result"
      route={routes.eligibilityResult}
      template="EligibilityResultPage"
    />
  );
}

export function DealBuilderPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return (
    <PageTemplate title={title} route={route} template="DealBuilderPage" />
  );
}

export function PartExchangePage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return (
    <PageTemplate title={title} route={route} template="PartExchangePage" />
  );
}

export function ReservationPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return (
    <PageTemplate title={title} route={route} template="ReservationPage" />
  );
}

export function LocationPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return <PageTemplate title={title} route={route} template="LocationPage" />;
}

export function BlogIndexPage({ topic }: { topic?: string }) {
  return <BlogHub topic={topic} />;
}

export function BlogPostPage({ slug }: { slug: string }) {
  const document = getContentBySlug(slug);
  if (!document) {
    return null;
  }
  return <ContentDocument document={document} />;
}

export function LegalPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  const document = getLegalDocumentByPath(route);
  if (!document) {
    return <PageTemplate title={title} route={route} template="LegalPage" />;
  }
  return <LegalDocumentView document={document} />;
}

export function SellMyCarPage() {
  return (
    <PageTemplate
      title="Sell my car"
      route={routes.sellMyCar}
      template="SellMyCarPage"
    />
  );
}

export function ValuationPage() {
  return (
    <PageTemplate
      title="Valuation"
      route={routes.valuation}
      template="ValuationPage"
    />
  );
}

export function ValuationResultPage() {
  return (
    <PageTemplate
      title="Valuation result"
      route={routes.valuationResult}
      template="ValuationResultPage"
    />
  );
}

export function AftersalesPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return <PageTemplate title={title} route={route} template="AftersalesPage" />;
}

export function TrustPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return <PageTemplate title={title} route={route} template="TrustPage" />;
}

export function EnquiryPage({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return <PageTemplate title={title} route={route} template="EnquiryPage" />;
}
