import { ServicePage } from "@/components/aftersales/AftersalesPages";
import { routes } from "@/config/routes";
import { audiServiceCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: audiServiceCopy.metaTitle,
  path: routes.servicingAudi,
  description: audiServiceCopy.metaDescription,
});

export default function Page() {
  return <ServicePage variant="audi" />;
}
