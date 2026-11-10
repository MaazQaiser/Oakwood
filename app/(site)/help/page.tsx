import { HelpHubPage } from "@/features/support/help/HelpHubPage";
import { routes } from "@/config/routes";
import { FAQ_META_DESCRIPTION } from "@/lib/support/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Help and support",
  path: routes.help,
  description: FAQ_META_DESCRIPTION,
});

export default function Page() {
  return <HelpHubPage />;
}
