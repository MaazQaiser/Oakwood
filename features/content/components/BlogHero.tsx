import { BlogCard } from "@/features/content/components/BlogCard";
import { CONTENT_FEATURED_LABEL, CONTENT_NO_FEATURED } from "@/lib/content/copy";
import type { ContentHubItem } from "@/types/content";

export function BlogHero({ featured }: { featured?: ContentHubItem }) {
  if (!featured) {
    return <p className="text-body-sm text-muted">{CONTENT_NO_FEATURED}</p>;
  }

  return (
    <section aria-labelledby="featured-article-heading">
      <h2 id="featured-article-heading" className="sr-only">
        {CONTENT_FEATURED_LABEL}
      </h2>
      <BlogCard item={featured} featured headingLevel="h2" />
    </section>
  );
}
