import { AftersalesHubPage } from "@/components/aftersales/AftersalesPages";
import { readBookingHistory } from "@/features/aftersales/session";
import { routes } from "@/config/routes";
import { aftersalesHubCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: aftersalesHubCopy.metaTitle,
  path: routes.aftersales,
  description: aftersalesHubCopy.metaDescription,
});

export default async function Page() {
  const bookings = await readBookingHistory();
  return <AftersalesHubPage bookings={bookings} />;
}
