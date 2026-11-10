import { ApplyFinanceFlow } from "@/components/apply-finance/ApplyFinanceFlow";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Apply for finance",
  path: routes.eligibilityQuestions,
  indexable: false,
});

export default function Page() {
  return <ApplyFinanceFlow />;
}
