import { FinanceHubPage } from "@/components/finance/FinanceHubPage";
import { routes } from "@/config/routes";
import { financeHubContent } from "@/lib/finance/intent/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: financeHubContent.metaTitle,
  path: routes.finance,
  description: financeHubContent.metaDescription,
});

export default function Page() {
  return <FinanceHubPage />;
}
