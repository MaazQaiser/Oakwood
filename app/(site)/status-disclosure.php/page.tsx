import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { regulatoryDocument } from "@/content/legal/documents";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: regulatoryDocument.metaTitle,
  path: regulatoryDocument.canonicalPath,
  description: regulatoryDocument.metaDescription,
});

export default function Page() {
  return <LegalDocumentView document={regulatoryDocument} />;
}
