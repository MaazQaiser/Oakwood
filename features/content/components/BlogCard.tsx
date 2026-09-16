import Image from "next/image";
import { Card } from "@/components/cards/Card";
import { ContentTrackedLink } from "@/features/content/components/ContentTrackedLink";
import {
  CONTENT_READ_TIME_SUFFIX,
} from "@/lib/content/copy";
import { formatContentDate } from "@/lib/content/reading";
import { contentFallbackHero } from "@/lib/media/stock";
import type { ContentHubItem } from "@/types/content";

export function BlogCard({
  item,
  featured = false,
  headingLevel = "h2",
}: {
  item: ContentHubItem;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const published = formatContentDate(item.publishedAt);
  const hero = item.hero ?? contentFallbackHero(item);

  return (
    <Card as="article" padded={false} className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] bg-page-tint">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority={featured}
          sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-caption text-primary">{item.category}</p>
        <Heading className="mt-2 text-h5">
          <ContentTrackedLink
            href={item.href}
            kind="related"
            slug={item.slug}
            className="text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {item.title}
          </ContentTrackedLink>
        </Heading>
        <p className="mt-2 flex-1 text-body-sm text-muted">{item.description}</p>
        {published || item.readingMinutes || item.author ? (
          <p className="mt-4 text-caption text-muted">
            {[
              published,
              item.readingMinutes
                ? `${item.readingMinutes} ${CONTENT_READ_TIME_SUFFIX}`
                : undefined,
              item.author?.name,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
