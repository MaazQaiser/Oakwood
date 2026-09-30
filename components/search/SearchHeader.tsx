import { PageBanner } from "@/components/layout/PageBanner";
import { NaturalLanguageSearch } from "@/components/search/NaturalLanguageSearch";
import { SearchHeroActions } from "@/components/search/SearchHeroActions";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";
import type { BreadcrumbItem } from "@/lib/seo";

function headerBreadcrumbs(context: InventoryPageContext): BreadcrumbItem[] {
  const isInventoryHub =
    context.variant === "inventory" &&
    context.breadcrumbs.length === 2 &&
    !context.locked.make &&
    !context.locked.model &&
    !context.locked.location;

  if (isInventoryHub) {
    return context.breadcrumbs.slice(0, 1);
  }

  return context.breadcrumbs;
}

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
      title={context.title}
      description={context.description}
      breadcrumbs={headerBreadcrumbs(context)}
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
