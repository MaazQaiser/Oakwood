import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { SearchHeroActions } from "@/components/search/SearchHeroActions";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
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
      <p className="mb-3 max-w-3xl text-body-sm text-secondary">
        {guaranteeCopy.searchIntro}{" "}
        <Link
          href={routes.thirtyDayGuarantee}
          className="text-primary underline-offset-4 hover:underline"
        >
          {guaranteeCopy.programmeName}
        </Link>
      </p>
      {/* Rate CTA sits after the sixth result — never above the first car. */}
      {copy.showHeroActions ? <SearchHeroActions copy={copy} /> : null}
    </PageBanner>
  );
}
