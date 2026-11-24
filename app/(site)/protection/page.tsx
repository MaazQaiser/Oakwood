import { RulesContentPage } from "@/components/content/RulesContentPage";
import { routes } from "@/config/routes";
import { protectionContent } from "@/lib/content/rules-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: protectionContent.title,
  path: routes.protection,
  description: protectionContent.description,
});

export default function Page() {
  return (
    <RulesContentPage path={routes.protection} content={protectionContent} />
  );
}