import { Container, Section } from "@/components/layout/Container";
import { ArticleBody } from "@/features/content/components/ArticleBody";
import { ArticleHeader } from "@/features/content/components/ArticleHeader";
import { ContentBreadcrumbs } from "@/features/content/components/ContentBreadcrumbs";
import { ContentCTA } from "@/features/content/components/ContentCTA";
import { ContentJourneyLinks } from "@/features/content/components/ContentJourneyLinks";
import { ContentMissingNotice } from "@/features/content/components/ContentMissingNotice";
import { ContentViewTracker } from "@/features/content/components/ContentViewTracker";
import { ModelComparison } from "@/features/content/components/ModelComparison";
import { ModelGuide } from "@/features/content/components/ModelGuide";
import { RelatedContent } from "@/features/content/components/RelatedContent";
import { getBlogPostUrl } from "@/config/routes";
import { getRelatedContent } from "@/content/editorial";
import {
  getModelStock,
  getSimilarModelStock,
  summarizeModelStock,
} from "@/features/content/services/catalog";
import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
} from "@/lib/seo/json-ld";
import { createBreadcrumbs } from "@/lib/seo";
import { routes } from "@/config/routes";
import type { ContentEntry } from "@/types/content";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ContentDocument({ document }: { document: ContentEntry }) {
  const path = getBlogPostUrl(document.slug);
  const related = getRelatedContent(document);
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Blog", href: routes.blog },
    { label: document.title, href: path },
  ]);

  const articleSchema = createArticleJsonLd({
    headline: document.title,
    description: document.description,
    url: path,
    datePublished: document.publishedAt,
    dateModified: document.updatedAt ?? document.publishedAt,
    image: document.hero?.src,
    authorName: document.author?.name,
  });

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />
      {document.faqs && document.faqs.length > 0 ? (
        <JsonLd data={createFaqJsonLd(document.faqs)} />
      ) : null}
      <ContentViewTracker slug={document.slug} type={document.type} />
      <Section className="pb-0">
        <Container width="narrow">
          <ContentBreadcrumbs title={document.title} href={path} />
        </Container>
      </Section>
      <Section>
        <Container width="narrow">
          {document.type === "model-guide" ? (
            <ModelGuide
              document={document}
              summary={
                summarizeModelStock(
                  document.makeSlug,
                  document.modelSlug,
                  document.vehicleCategory,
                ) ?? {
                  make: document.makeSlug,
                  model: document.modelSlug,
                  makeSlug: document.makeSlug,
                  modelSlug: document.modelSlug,
                  count: 0,
                  availableCount: 0,
                  years: "",
                  bodyStyles: [],
                  fuelTypes: [],
                  transmissions: [],
                  locations: [],
                  doors: [],
                  seats: [],
                }
              }
              vehicles={getModelStock(
                document.makeSlug,
                document.modelSlug,
                document.vehicleCategory,
              )}
              similar={getSimilarModelStock(
                document.makeSlug,
                document.modelSlug,
                document.vehicleCategory,
              )}
              related={related}
            />
          ) : document.type === "comparison" ? (
            <ModelComparison document={document} related={related} />
          ) : (
            <article>
              <ArticleHeader document={document} />
              <div className="mt-8">
                <ContentMissingNotice items={document.missing} />
              </div>
              <ArticleBody blocks={document.body} />
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {document.ctas.map((cta) => (
                  <ContentCTA key={`${cta.kind}-${cta.href}`} cta={cta} slug={document.slug} />
                ))}
              </div>
              <ContentJourneyLinks links={document.relatedLinks} slug={document.slug} />
              <div className="mt-12">
                <RelatedContent items={related} />
              </div>
            </article>
          )}
        </Container>
      </Section>
    </>
  );
}
