import { MotPage } from "@/components/aftersales/AftersalesPages";
import { readBookingHistory } from "@/features/aftersales/session";
import { routes } from "@/config/routes";
import { motPageCopy } from "@/lib/aftersales/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: motPageCopy.metaTitle,
  path: routes.mot,
  description: motPageCopy.metaDescription,
});

export default async function Page() {
  const bookings = await readBookingHistory();
  return <MotPage bookings={bookings} />;
}
