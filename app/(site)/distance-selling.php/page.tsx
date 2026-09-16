import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { distanceSellingDocument } from "@/content/legal/documents";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: distanceSellingDocument.metaTitle,
  path: distanceSellingDocument.canonicalPath,
  description: distanceSellingDocument.metaDescription,
});

export default function Page() {
  return <LegalDocumentView document={distanceSellingDocument} />;
}
