import { RulesContentPage } from "@/components/content/RulesContentPage";
import { routes } from "@/config/routes";
import { careersContent } from "@/lib/content/rules-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: careersContent.title,
  path: routes.careers,
  description: careersContent.description,
});

export default function Page() {
  return <RulesContentPage path={routes.careers} content={careersContent} />;
}