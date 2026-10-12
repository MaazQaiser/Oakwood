import { PageBanner } from "@/components/layout/PageBanner";
import { FinancePersonalisationBanner } from "@/components/search/FinancePersonalisationBanner";
import { SearchHeroActions } from "@/components/search/SearchHeroActions";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import { cn } from "@/lib/cn";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";

export function SearchHeader({
  context,
}: {
  context: InventoryPageContext;
  query?: string;
}) {
  const copy = getSearchCopy(context.category);

  return (
    <PageBanner
      title={context.title}
      breadcrumbs={context.breadcrumbs}
      hideTitle
    >
      {copy.showHeroActions ? <SearchHeroActions copy={copy} /> : null}
      <FinancePersonalisationBanner
        copy={copy}
        unboxed
        className={cn(copy.showHeroActions && "mt-6")}
      />
    </PageBanner>
  );
}
