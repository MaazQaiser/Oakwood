import { RulesContentPage } from "@/components/content/RulesContentPage";
import { routes } from "@/config/routes";
import { servicingPlansContent } from "@/lib/content/rules-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: servicingPlansContent.title,
  path: routes.servicingPlans,
  description: servicingPlansContent.description,
});

export default function Page() {
  return (
    <RulesContentPage
      path={routes.servicingPlans}
      parent={{ label: "Servicing", href: routes.service }}
      content={servicingPlansContent}
    />
  );
}