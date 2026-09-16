import { EligibilityIntro } from "@/components/eligibility/EligibilityIntro";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Finance eligibility",
  path: routes.eligibility,
  description:
    "Check your finance eligibility in around 60 seconds. Soft search, no account required, and no impact on your credit score.",
  indexable: false,
});

export default function Page() {
  return <EligibilityIntro />;
}
