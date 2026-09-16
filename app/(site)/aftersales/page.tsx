import { AftersalesHubPage } from "@/components/aftersales/AftersalesPages";
import { routes } from "@/config/routes";
import { aftersalesHubCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: aftersalesHubCopy.metaTitle,
  path: routes.aftersales,
  description: aftersalesHubCopy.metaDescription,
});

export default function Page() {
  return <AftersalesHubPage />;
}
