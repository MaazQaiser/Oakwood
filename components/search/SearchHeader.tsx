import { PageBanner } from "@/components/layout/PageBanner";
import { NaturalLanguageSearch } from "@/components/search/NaturalLanguageSearch";
import { SearchHeroActions } from "@/components/search/SearchHeroActions";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";

export function SearchHeader({
  context,
  query,
}: {
  context: InventoryPageContext;
  query?: string;
}) {
  const copy = getSearchCopy(context.category);

  return (
    <PageBanner
      eyebrow={context.category === "van" ? "Used vans" : "Used cars"}
      title={context.title}
      description={context.description}
      breadcrumbs={context.breadcrumbs}
    >
      {copy.showHeroActions ? <SearchHeroActions copy={copy} /> : null}
      <div className={copy.showHeroActions ? "mt-6" : undefined}>
        <NaturalLanguageSearch
          action={context.searchAction}
          defaultValue={query}
          hint={copy.searchHint}
          category={copy.category}
        />
      </div>
    </PageBanner>
  );
}
