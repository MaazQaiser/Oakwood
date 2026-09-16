import { DeliveryPage } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { deliveryCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: deliveryCopy.metaTitle,
  path: routes.deliveryAndCollection,
  description: deliveryCopy.metaDescription,
});

export default function Page() {
  return <DeliveryPage />;
}
