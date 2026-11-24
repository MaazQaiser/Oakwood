import { InterestFreePage } from "@/features/finance/interest-free/InterestFreePage";
import { loadInterestFreePage } from "@/features/finance/interest-free/load";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: INTEREST_FREE_COPY.metaTitle,
  path: routes.interestFree,
  description: INTEREST_FREE_COPY.metaDescription,
});

export default async function Page() {
  const model = await loadInterestFreePage();
  return <InterestFreePage model={model} />;
}
