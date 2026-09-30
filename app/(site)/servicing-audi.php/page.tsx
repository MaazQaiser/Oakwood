import { ServicePage } from "@/components/aftersales/AftersalesPages";
import { readBookingHistory } from "@/features/aftersales/session";
import { routes } from "@/config/routes";
import { audiServiceCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: audiServiceCopy.metaTitle,
  path: routes.servicingAudi,
  description: audiServiceCopy.metaDescription,
});

export default async function Page() {
  const bookings = await readBookingHistory();
  return <ServicePage variant="audi" bookings={bookings} />;
}
