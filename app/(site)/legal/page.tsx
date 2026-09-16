import { LegalHub } from "@/features/legal/components/LegalHub";
import { routes } from "@/config/routes";
import { LEGAL_HUB_META_DESCRIPTION, LEGAL_HUB_META_TITLE } from "@/lib/legal/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: LEGAL_HUB_META_TITLE,
  path: routes.legal,
  description: LEGAL_HUB_META_DESCRIPTION,
});

export default function Page() {
  return <LegalHub />;
}
