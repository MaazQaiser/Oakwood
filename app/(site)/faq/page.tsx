import { SupportFaqPage } from "@/features/support/SupportPages";
import { routes } from "@/config/routes";
import { FAQ_META_DESCRIPTION, FAQ_META_TITLE } from "@/lib/support/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: FAQ_META_TITLE,
  path: routes.faq,
  description: FAQ_META_DESCRIPTION,
});

export default function Page() {
  return <SupportFaqPage />;
}
