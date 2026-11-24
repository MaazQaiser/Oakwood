import { NegativeEquityPage } from "@/features/finance/negative-equity/NegativeEquityPage";
import { loadNegativeEquityPage } from "@/features/finance/negative-equity/load";
import { NEG_EQUITY_COPY } from "@/lib/finance/negative-equity/content";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: NEG_EQUITY_COPY.metaTitle,
  path: routes.negativeEquity,
  description: NEG_EQUITY_COPY.metaDescription,
});

export default async function Page() {
  const model = await loadNegativeEquityPage();
  return <NegativeEquityPage model={model} />;
}
