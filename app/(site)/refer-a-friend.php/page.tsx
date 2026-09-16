import { EnquiryPage } from "@/components/templates/pages";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Refer a friend",
  path: routes.referAFriend,
});

export default function Page() {
  return <EnquiryPage title="Refer a friend" route={routes.referAFriend} />;
}
