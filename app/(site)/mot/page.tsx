import { MotPage } from "@/components/aftersales/AftersalesPages";
import { routes } from "@/config/routes";
import { motPageCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: motPageCopy.metaTitle,
  path: routes.mot,
  description: motPageCopy.metaDescription,
});

export default function Page() {
  return <MotPage />;
}
