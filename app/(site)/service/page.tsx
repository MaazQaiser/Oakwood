import { ServicePage } from "@/components/aftersales/AftersalesPages";
import { routes } from "@/config/routes";
import { servicePageCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: servicePageCopy.metaTitle,
  path: routes.service,
  description: servicePageCopy.metaDescription,
});

export default function Page() {
  return <ServicePage variant="service" />;
}
