import { AaStandardsPageView } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { aaStandardsCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: aaStandardsCopy.metaTitle,
  path: routes.aaStandards,
  description: aaStandardsCopy.metaDescription,
});

export default function Page() {
  return <AaStandardsPageView />;
}
