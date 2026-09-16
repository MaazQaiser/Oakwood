import { WhatToExpectPage } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { whatToExpectCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: whatToExpectCopy.metaTitle,
  path: routes.whatToExpect,
  description: whatToExpectCopy.metaDescription,
});

export default function Page() {
  return <WhatToExpectPage />;
}
