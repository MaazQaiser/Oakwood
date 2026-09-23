import { Button } from "@/components/ui/Button";
import { ArticleBody } from "@/features/content/components/ArticleBody";
import { ArticleHeader } from "@/features/content/components/ArticleHeader";
import { ComparisonTable } from "@/features/content/components/ComparisonTable";
import { ContentCTA } from "@/features/content/components/ContentCTA";
import { ContentJourneyLinks } from "@/features/content/components/ContentJourneyLinks";
import { ContentMissingNotice } from "@/features/content/components/ContentMissingNotice";
import { ContentStockSection } from "@/features/content/components/ContentStockSection";
import { RelatedContent } from "@/features/content/components/RelatedContent";
import { getModelUrl, getSearchUrl, getUsedCarsUrl, routes } from "@/config/routes";
import {
  CONTENT_FAQ_HEADING,
  CONTENT_FINANCE_HEADING,
  CONTENT_SIMILAR_MODELS_HEADING,
  CONTENT_SPECS_HEADING,
  CONTENT_SPECS_INTRO,
} from "@/lib/content/copy";
import { INDICATIVE_DISCLAIMER } from "@/lib/eligibility/copy";
import { statusDisclosureCopy, whatToExpectSections } from "@/lib/trust/content";
import type { ModelStockSummary } from "@/features/content/services/catalog";
import type { ContentHubItem, ModelGuide as ModelGuideDocument } from "@/types/content";
import type { Vehicle } from "@/types/vehicle";

export function ModelGuide({
  document,
  summary,
  vehicles,
  similar,
  related,
}: {
  document: ModelGuideDocument;
  summary: ModelStockSummary;
  vehicles: Vehicle[];
  similar: Vehicle[];
  related: ContentHubItem[];
}) {
  const stockHref = getModelUrl(
    document.makeSlug,
    document.modelSlug,
    document.vehicleCategory === "van" ? "vans" : "cars",
  );
  const similarHref =
    summary.bodyStyles[0]
      ? getSearchUrl({ body_style: summary.bodyStyles[0].toLowerCase() })
      : getUsedCarsUrl();
  const specRows = [
    ["Body type", summary.bodyStyles.join(", ")],
    ["Fuel", summary.fuelTypes.join(", ")],
    ["Transmission", summary.transmissions.join(", ")],
    ["Years listed", summary.years],
    ["Doors", summary.doors.join(", ")],
    ["Seats", summary.seats.join(", ")],
    ["Locations", summary.locations.join(", ")],
    ["Listed cash price", summary.listedPriceRange ?? ""],
    ["Listed mileage", summary.listedMileageRange ?? ""],
    ["Current listings", summary.count ? String(summary.count) : "None"],
  ].filter((row) => row[1]);

  return (
    <article>
      <ArticleHeader document={document} />
      <div className="mt-8">
        <ContentMissingNotice items={document.missing} />
      </div>
      <ArticleBody blocks={document.body} />

      <section className="mt-10 max-w-prose" aria-labelledby="model-specs-heading">
        <h2 id="model-specs-heading" className="text-h2">
          {CONTENT_SPECS_HEADING}
        </h2>
        <p className="mt-3 text-body text-muted">{CONTENT_SPECS_INTRO}</p>
        {specRows.length > 0 ? (
          <div className="mt-4">
            <ComparisonTable
              headers={["Attribute", "From current listings"]}
              rows={specRows}
            />
          </div>
        ) : (
          <p className="mt-3 text-body-sm text-muted">
            No current listings are available to summarise.
          </p>
        )}
      </section>

      <section className="mt-10 max-w-prose" aria-labelledby="model-finance-heading">
        <h2 id="model-finance-heading" className="text-h2">
          {CONTENT_FINANCE_HEADING}
        </h2>
        <p className="mt-3 text-body text-muted">{INDICATIVE_DISCLAIMER}</p>
        <p className="mt-3 text-body text-muted">
          {statusDisclosureCopy.description}{" "}
          <Button href={routes.statusDisclosure} variant="text" className="px-0">
            Status disclosure
          </Button>
        </p>
        <p className="mt-3 text-body text-muted">
          {whatToExpectSections[2]?.body}
        </p>
      </section>

      <div className="mt-10">
        <ContentStockSection
          vehicles={vehicles}
          similar={similar}
          stockHref={stockHref}
          similarHref={similarHref}
          slug={document.slug}
          viewLabel={`View ${summary.model} cars`}
        />
      </div>

      {vehicles.length > 0 && similar.length > 0 ? (
        <section className="mt-10" aria-labelledby="similar-models-heading">
          <h2 id="similar-models-heading" className="text-h2">
            {CONTENT_SIMILAR_MODELS_HEADING}
          </h2>
          <ul className="mt-4">
            {similar.map((vehicle) => (
              <li key={`${vehicle.makeSlug}-${vehicle.modelSlug}`}>
                <Button
                  href={getModelUrl(
                    vehicle.makeSlug,
                    vehicle.modelSlug,
                    document.vehicleCategory === "van" ? "vans" : "cars",
                  )}
                  variant="text"
                  className="px-0"
                >
                  {vehicle.make} {vehicle.model}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {document.faqs && document.faqs.length > 0 ? (
        <section className="mt-10 max-w-prose" aria-labelledby="model-faq-heading">
          <h2 id="model-faq-heading" className="text-h2">
            {CONTENT_FAQ_HEADING}
          </h2>
          <dl className="mt-6 space-y-6">
            {document.faqs.map((item) => (
              <div key={item.question}>
                <dt className="text-h3">{item.question}</dt>
                <dd className="mt-2 text-body text-muted">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {document.ctas.map((cta) => (
          <ContentCTA key={cta.href} cta={cta} slug={document.slug} />
        ))}
      </div>
      <ContentJourneyLinks links={document.relatedLinks} slug={document.slug} />
      <div className="mt-12">
        <RelatedContent items={related} />
      </div>
    </article>
  );
}
