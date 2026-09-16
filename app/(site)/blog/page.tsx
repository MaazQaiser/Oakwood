import { BlogIndexPage } from "@/components/templates/pages";
import { routes } from "@/config/routes";
import { CONTENT_HUB_META_DESCRIPTION, CONTENT_HUB_META_TITLE } from "@/lib/content/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: CONTENT_HUB_META_TITLE,
  path: routes.blog,
  description: CONTENT_HUB_META_DESCRIPTION,
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const topic = typeof query.topic === "string" ? query.topic : undefined;

  return <BlogIndexPage topic={topic} />;
}
