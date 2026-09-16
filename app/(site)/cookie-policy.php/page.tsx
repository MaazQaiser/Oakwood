import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { cookiesDocument } from "@/content/legal/documents";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: cookiesDocument.metaTitle,
  path: cookiesDocument.canonicalPath,
  description: cookiesDocument.metaDescription,
});

export default function Page() {
  return <LegalDocumentView document={cookiesDocument} />;
}
