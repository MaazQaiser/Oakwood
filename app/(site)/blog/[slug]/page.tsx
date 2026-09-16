import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/templates/pages";
import { getContentBySlug, listContentEntries } from "@/content/editorial";
import { getBlogPostUrl } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return listContentEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = getContentBySlug(slug);
  if (!document) {
    return createPageMetadata({
      title: "Blog post",
      path: getBlogPostUrl(slug),
      indexable: false,
    });
  }

  return createPageMetadata({
    title: document.seo.title,
    path: document.seo.canonicalPath,
    description: document.seo.description,
    indexable: document.seo.indexable,
    ogType: "article",
    ogImage: document.hero?.src,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = getContentBySlug(slug);

  if (!document) {
    notFound();
  }

  return <BlogPostPage slug={document.slug} />;
}
