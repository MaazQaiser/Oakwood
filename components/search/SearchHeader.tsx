import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
    <header>
      <Breadcrumbs items={context.breadcrumbs} />
      <h1 className="text-display mt-4">{context.title}</h1>
      <p className="mt-3 max-w-2xl text-body text-muted">{context.description}</p>
      {copy.showHeroActions ? <SearchHeroActions copy={copy} /> : null}
      <NaturalLanguageSearch
        action={context.searchAction}
        defaultValue={query}
        hint={copy.searchHint}
        category={copy.category}
      />
    </header>
  );
}
