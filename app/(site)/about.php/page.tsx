import { AboutPage } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { aboutCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: aboutCopy.metaTitle,
  path: routes.about,
  description: aboutCopy.metaDescription,
});

export default function Page() {
  return <AboutPage />;
}
