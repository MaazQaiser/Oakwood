import { ArticleBody } from "@/features/content/components/ArticleBody";
import { ArticleHeader } from "@/features/content/components/ArticleHeader";
import { ComparisonTable } from "@/features/content/components/ComparisonTable";
import { ContentCTA } from "@/features/content/components/ContentCTA";
import { ContentJourneyLinks } from "@/features/content/components/ContentJourneyLinks";
import { ContentMissingNotice } from "@/features/content/components/ContentMissingNotice";
import { RelatedContent } from "@/features/content/components/RelatedContent";
import { CONTENT_COMPARISON_NOTE } from "@/lib/content/copy";
import { bodyStyleValues } from "@/features/content/services/catalog";
import type { ComparisonArticle, ContentHubItem } from "@/types/content";

export function ModelComparison({
  document,
  related,
}: {
  document: ComparisonArticle;
  related: ContentHubItem[];
}) {
  const hatchbacks = bodyStyleValues("Hatchback");
  const suvs = bodyStyleValues("SUV");
  const listingRows = [
    ["Current listings", String(hatchbacks.count), String(suvs.count)],
    ["Fuel in current listings", hatchbacks.fuelTypes.join(", "), suvs.fuelTypes.join(", ")],
    [
      "Transmission in current listings",
      hatchbacks.transmissions.join(", "),
      suvs.transmissions.join(", "),
    ],
  ];

  return (
    <article>
      <ArticleHeader document={document} />
      <div className="mt-8">
        <ContentMissingNotice items={document.missing} />
      </div>
      <ArticleBody blocks={document.body} />
      {document.table ? (
        <section className="mt-10" aria-labelledby="comparison-table-heading">
          <h2 id="comparison-table-heading" className="text-h2">
            Comparison
          </h2>
          <p className="mt-3 max-w-prose text-body text-muted">
            {CONTENT_COMPARISON_NOTE}
          </p>
          <div className="mt-4">
            <ComparisonTable
              caption={document.table.caption}
              headers={document.table.headers}
              rows={document.table.rows}
            />
          </div>
        </section>
      ) : null}
      {document.slug === "hatchbacks-and-suvs" ? (
      <section className="mt-10" aria-labelledby="listing-table-heading">
        <h2 id="listing-table-heading" className="text-h2">
          Current Oakwood listings
        </h2>
        <p className="mt-3 max-w-prose text-body text-muted">
          These figures change when stock changes. They are not typical-market values.
        </p>
        <div className="mt-4">
          <ComparisonTable
            headers={["", "Hatchback", "SUV"]}
            rows={listingRows}
          />
        </div>
      </section>
      ) : null}
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
  );
}
