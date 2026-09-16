import { HowItWorksPage } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { howItWorksCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: howItWorksCopy.metaTitle,
  path: routes.howItWorks,
  description: howItWorksCopy.metaDescription,
});

export default function Page() {
  return <HowItWorksPage />;
}
