import { EnquiryPage } from "@/components/templates/pages";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Compare",
  path: routes.compare,
});

export default function Page() {
  return <EnquiryPage title="Compare" route={routes.compare} />;
}
