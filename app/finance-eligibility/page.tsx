import { EligibilityIntro } from "@/components/eligibility/EligibilityIntro";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Finance eligibility",
  path: routes.eligibility,
  description:
    "Check a preview finance profile in around 60 seconds. Simulated soft search only — no live credit check until the provider is connected.",
  indexable: false,
});

export default function Page() {
  return <EligibilityIntro />;
}
