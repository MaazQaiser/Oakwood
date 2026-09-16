import { WarrantyPage } from "@/components/aftersales/AftersalesPages";
import { routes } from "@/config/routes";
import { warrantyPageCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: warrantyPageCopy.metaTitle,
  path: routes.warranty,
  description: warrantyPageCopy.metaDescription,
});

export default function Page() {
  return <WarrantyPage />;
}
