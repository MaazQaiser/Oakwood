import type { ContentBlock } from "@/types/content";

export function readingMinutesFromBlocks(blocks: ContentBlock[]): number | undefined {
  const text = blocks
    .flatMap((block) => {
      if (block.type === "paragraph") {
        return [block.text, ...(block.spans?.map((span) => span.text) ?? [])];
      }
      if (block.type === "heading" || block.type === "quote" || block.type === "callout") {
        return [block.text];
      }
      if (block.type === "list") {
        return block.items;
      }
      return [];
    })
    .join(" ");

  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 80) {
    return undefined;
  }

  return Math.max(1, Math.round(words / 200));
}

export function formatContentDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
