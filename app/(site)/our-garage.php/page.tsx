import { GaragePage } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { preparationCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: preparationCopy.metaTitle,
  path: routes.ourGarage,
  description: preparationCopy.metaDescription,
});

export default function Page() {
  return <GaragePage />;
}
