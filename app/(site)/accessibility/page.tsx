import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { accessibilityDocument } from "@/content/legal/documents";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: accessibilityDocument.metaTitle,
  path: accessibilityDocument.canonicalPath,
  description: accessibilityDocument.metaDescription,
});

export default function Page() {
  return <LegalDocumentView document={accessibilityDocument} />;
}
