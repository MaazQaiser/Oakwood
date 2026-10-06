import { HomePage } from "@/components/home/HomePage";
import { routes } from "@/config/routes";
import { HOME_META_DESCRIPTION, HOME_META_TITLE } from "@/lib/home/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: HOME_META_TITLE,
  path: routes.home,
  description: HOME_META_DESCRIPTION,
});

export default function Page() {
  return <HomePage />;
}
