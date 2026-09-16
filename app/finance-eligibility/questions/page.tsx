import { EligibilityQuestionsFlow } from "@/components/eligibility/EligibilityQuestionsFlow";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Eligibility questions",
  path: routes.eligibilityQuestions,
  indexable: false,
});

export default function Page() {
  return <EligibilityQuestionsFlow />;
}
