import Image from "next/image";
import { ContentTrackedLink } from "@/features/content/components/ContentTrackedLink";
import { ComparisonTable } from "@/features/content/components/ComparisonTable";
import type { ContentBlock, ContentInlineSpan } from "@/types/content";

function Paragraph({
  text,
  spans,
}: {
  text?: string;
  spans?: ContentInlineSpan[];
}) {
  if (!spans || spans.length === 0) {
    return text ? <p className="mt-3 text-body text-muted">{text}</p> : null;
  }

  return (
    <p className="mt-3 text-body text-muted">
      {spans.map((span, index) =>
        span.href ? (
          <ContentTrackedLink
            key={`${span.text}-${index}`}
            href={span.href}
            kind="related"
            className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {span.text}
          </ContentTrackedLink>
        ) : (
          <span key={`${span.text}-${index}`}>{span.text}</span>
        ),
      )}
    </p>
  );
}

export function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="max-w-prose">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag
              key={block.id}
              id={block.id}
              className={
                block.level === 2
                  ? "mt-10 scroll-mt-24 text-h2"
                  : "mt-6 scroll-mt-24 text-h3"
              }
            >
              {block.text}
            </Tag>
          );
        }
        if (block.type === "paragraph") {
          return (
            <Paragraph
              key={`p-${index}`}
              text={block.text}
              spans={block.spans}
            />
          );
        }
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={
                block.ordered
                  ? "mt-3 list-decimal space-y-2 pl-5 text-body text-muted"
                  : "mt-3 list-disc space-y-2 pl-5 text-body text-muted"
              }
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ListTag>
          );
        }
        if (block.type === "linkList") {
          return (
            <ul
              key={`links-${index}`}
              className="mt-3 list-disc space-y-2 pl-5 text-body text-muted"
            >
              {block.items.map((item) => (
                <li key={item.href}>
                  <ContentTrackedLink
                    href={item.href}
                    kind="related"
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {item.text}
                  </ContentTrackedLink>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={`quote-${index}`}
              className="mt-6 border-l-2 border-primary pl-4 text-body text-muted"
            >
              {block.text}
            </blockquote>
          );
        }
        if (block.type === "callout") {
          return (
            <aside
              key={`callout-${index}`}
              className="mt-6 rounded-md border border-border bg-page-tint px-4 py-3 text-body-sm text-muted"
            >
              {block.text}
            </aside>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={block.src} className="mt-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-primary-soft">
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
              {block.caption ? (
                <figcaption className="mt-2 text-caption text-muted">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        if (block.type === "table") {
          return (
            <div key={`table-${index}`} className="mt-6">
              <ComparisonTable
                caption={block.caption}
                headers={block.headers}
                rows={block.rows}
              />
            </div>
          );
        }
        return (
          <aside
            key={`missing-${index}`}
            className="mt-6 rounded-md border border-border bg-page px-4 py-3 text-body-sm text-muted"
          >
            <p className="text-label text-ink">Not in the content source</p>
            <ul className="mt-2 list-disc pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        );
      })}
    </div>
  );
}
