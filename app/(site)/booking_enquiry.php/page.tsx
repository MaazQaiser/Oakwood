import { BookingEnquiryPage } from "@/components/aftersales/AftersalesPages";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Booking enquiry",
  path: routes.bookingEnquiry,
  description:
    "Request a callback from Oakwood Motor Company for servicing, MOT or aftersales support.",
});

export default function Page() {
  return <BookingEnquiryPage />;
}
