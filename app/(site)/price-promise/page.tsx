import { RulesContentPage } from "@/components/content/RulesContentPage";
import { routes } from "@/config/routes";
import { pricePromiseContent } from "@/lib/content/rules-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: pricePromiseContent.title,
  path: routes.pricePromise,
  description: pricePromiseContent.description,
});

export default function Page() {
  return (
    <RulesContentPage path={routes.pricePromise} content={pricePromiseContent} />
  );
}