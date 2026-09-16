import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { getLegalDocument, nestedLegalSlugs } from "@/content/legal";
import { createPageMetadata } from "@/lib/seo/metadata";

type NestedLegalSlug = (typeof nestedLegalSlugs)[number];

function isNestedLegalSlug(value: string): value is NestedLegalSlug {
  return nestedLegalSlugs.includes(value as NestedLegalSlug);
}

export function generateStaticParams() {
  return nestedLegalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (!document) {
    return {};
  }
  return createPageMetadata({
    title: document.metaTitle,
    path: document.canonicalPath,
    description: document.metaDescription,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isNestedLegalSlug(slug)) {
    notFound();
  }
  const document = getLegalDocument(slug);
  if (!document) {
    notFound();
  }
  return <LegalDocumentView document={document} />;
}
