import { Grid } from "@/components/layout/Container";
import { BlogCard } from "@/features/content/components/BlogCard";
import { CONTENT_NO_RELATED, CONTENT_RELATED_HEADING } from "@/lib/content/copy";
import type { ContentHubItem } from "@/types/content";

export function RelatedContent({ items }: { items: ContentHubItem[] }) {
  if (items.length === 0) {
    return (
      <section aria-labelledby="related-content-heading">
        <h2 id="related-content-heading" className="text-h2">
          {CONTENT_RELATED_HEADING}
        </h2>
        <p className="mt-3 text-body-sm text-muted">{CONTENT_NO_RELATED}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="related-content-heading">
      <h2 id="related-content-heading" className="text-h2">
        {CONTENT_RELATED_HEADING}
      </h2>
      <Grid columns="cards" className="mt-6">
        {items.map((item) => (
          <BlogCard key={item.slug} item={item} headingLevel="h3" />
        ))}
      </Grid>
    </section>
  );
}
