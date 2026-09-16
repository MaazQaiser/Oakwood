import { EnquiryPage } from "@/components/templates/pages";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Get a quote",
  path: routes.getAQuote,
});

export default function Page() {
  return <EnquiryPage title="Get a quote" route={routes.getAQuote} />;
}
