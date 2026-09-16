import { EligibilityResult } from "@/components/eligibility/EligibilityResult";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Eligibility result",
  path: routes.eligibilityResult,
  indexable: false,
});

export default function Page() {
  return <EligibilityResult />;
}
