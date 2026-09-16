import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { privacyDocument } from "@/content/legal/documents";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: privacyDocument.metaTitle,
  path: privacyDocument.canonicalPath,
  description: privacyDocument.metaDescription,
});

export default function Page() {
  return <LegalDocumentView document={privacyDocument} />;
}
