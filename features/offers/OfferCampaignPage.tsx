import { RulesContentPage } from "@/components/content/RulesContentPage";
import { RepresentativeExampleCard } from "@/components/finance/RepresentativeExampleCard";
import { Container, Section } from "@/components/layout/Container";
import { ContentStockSection } from "@/features/content/components/ContentStockSection";
import { routes, getSearchUrl } from "@/config/routes";
import type { OfferCampaign } from "@/lib/offers/content";
import { listMatchingVehicles } from "@/lib/vehicles/search";
import { fuelSlugToType } from "@/lib/vehicles/browse-segments";

export function OfferCampaignPage({ offer }: { offer: OfferCampaign }) {
  const filter: Record<string, string> = {};
  if (offer.stockFilter?.fuel) {
    const fuel = fuelSlugToType(offer.stockFilter.fuel);
    if (fuel) {
      filter.fuel = fuel;
    }
  }
  if (offer.stockFilter?.body_style) {
    filter.body_style = offer.stockFilter.body_style;
  }
  if (offer.stockFilter?.make) {
    filter.make = offer.stockFilter.make;
  }

  const vehicles = listMatchingVehicles(filter);
  const stockHref = getSearchUrl(filter);

  return (
    <RulesContentPage
      path={routes.offers + `/${offer.slug}`}
      parent={{ label: "Offers", href: routes.offers }}
      content={{
        title: offer.title,
        description: offer.intro,
        rules: offer.terms,
      }}
    >
      <Section className="py-0">
        <Container width="narrow" className="space-y-8">
          {offer.validUntil ? (
            <p className="text-body-sm text-muted">
              Offer illustration runs until {offer.validUntil}.
            </p>
          ) : null}
          <RepresentativeExampleCard example={offer.representativeExample} />
          <ContentStockSection
            vehicles={vehicles}
            similar={vehicles.slice(0, 4)}
            stockHref={stockHref}
            similarHref={routes.usedCars}
            slug={offer.slug}
            viewLabel="View eligible cars"
          />
        </Container>
      </Section>
    </RulesContentPage>
  );
}