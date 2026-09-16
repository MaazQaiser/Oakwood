import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { termsDocument } from "@/content/legal/documents";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: termsDocument.metaTitle,
  path: termsDocument.canonicalPath,
  description: termsDocument.metaDescription,
});

export default function Page() {
  return <LegalDocumentView document={termsDocument} />;
}
