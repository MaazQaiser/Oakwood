import Image from "next/image";
import {
  CONTENT_NO_AUTHOR,
  CONTENT_NO_DATE,
  CONTENT_PUBLISHED_PREFIX,
  CONTENT_READ_TIME_SUFFIX,
  CONTENT_UPDATED_PREFIX,
} from "@/lib/content/copy";
import { formatContentDate, readingMinutesFromBlocks } from "@/lib/content/reading";
import { contentFallbackHero } from "@/lib/media/stock";
import type { ContentEntry } from "@/types/content";

export function ArticleHeader({
  document,
  showHeading = true,
}: {
  document: ContentEntry;
  showHeading?: boolean;
}) {
  const published = formatContentDate(document.publishedAt);
  const updated = formatContentDate(document.updatedAt);
  const reading = readingMinutesFromBlocks(document.body);
  const hero = document.hero ?? contentFallbackHero(document);

  return (
    <header className="max-w-prose">
      {showHeading ? (
        <>
          <p className="text-caption text-primary">{document.category}</p>
          <h1 className="mt-2 text-h1 md:text-display">{document.title}</h1>
          {document.description ? (
            <p className="mt-3 text-body text-muted">{document.description}</p>
          ) : null}
        </>
      ) : null}
      <p className="mt-4 text-caption text-muted">
        {published
          ? `${CONTENT_PUBLISHED_PREFIX} ${published}`
          : CONTENT_NO_DATE}
        {updated ? ` · ${CONTENT_UPDATED_PREFIX} ${updated}` : null}
        {reading ? ` · ${reading} ${CONTENT_READ_TIME_SUFFIX}` : null}
        {document.author ? ` · ${document.author.name}` : ` · ${CONTENT_NO_AUTHOR}`}
      </p>
      <figure className="mt-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-page-tint">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>
      </figure>
    </header>
  );
}
