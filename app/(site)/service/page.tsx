import { ServicePage } from "@/components/aftersales/AftersalesPages";
import { readBookingHistory } from "@/features/aftersales/session";
import { routes } from "@/config/routes";
import { servicePageCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: servicePageCopy.metaTitle,
  path: routes.service,
  description: servicePageCopy.metaDescription,
});

export default async function Page() {
  const bookings = await readBookingHistory();
  return <ServicePage variant="service" bookings={bookings} />;
}
