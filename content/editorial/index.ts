import { getBlogPostUrl } from "@/config/routes";
import { readingMinutesFromBlocks } from "@/lib/content/reading";
import { contentEntries } from "./documents";
import type {
  ContentEntry,
  ContentHubItem,
  ContentStatus,
  ContentTopic,
  ContentType,
} from "@/types/content";

export { contentEntries, hatchbackArticle, hatchbackSuvComparison, HATCHBACK_ARTICLE_SLUG } from "./documents";

export function listContentEntries(status: ContentStatus = "published"): ContentEntry[] {
  return contentEntries.filter((entry) => entry.status === status);
}

export function getContentBySlug(slug: string): ContentEntry | undefined {
  return listContentEntries().find((entry) => entry.slug === slug);
}

export function listContentByType(type: ContentType): ContentEntry[] {
  return listContentEntries().filter((entry) => entry.type === type);
}

export function topicForType(type: ContentType): ContentTopic {
  if (type === "model-guide") {
    return "guides";
  }
  if (type === "comparison") {
    return "comparisons";
  }
  return "articles";
}

export function listContentByTopic(topic?: string): ContentEntry[] {
  const entries = listContentEntries();
  if (!topic || topic === "all") {
    return entries;
  }
  return entries.filter((entry) => topicForType(entry.type) === topic);
}

export function getFeaturedArticle(): ContentEntry | undefined {
  return listContentEntries().find(
    (entry) => entry.type === "article" && entry.featured,
  );
}

export function toHubItem(entry: ContentEntry): ContentHubItem {
  return {
    slug: entry.slug,
    type: entry.type,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    href: getBlogPostUrl(entry.slug),
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    author: entry.author,
    hero: entry.hero,
    readingMinutes: readingMinutesFromBlocks(entry.body),
    featured: entry.featured,
  };
}

export function getRelatedContent(entry: ContentEntry): ContentHubItem[] {
  return entry.relatedSlugs
    .map((slug) => getContentBySlug(slug))
    .filter((item): item is ContentEntry => item !== undefined && item.slug !== entry.slug)
    .map(toHubItem);
}

export const contentTopics: Array<{ id: string; label: string }> = [
  { id: "all", label: "All" },
  { id: "articles", label: "Articles" },
  { id: "guides", label: "Model guides" },
  { id: "comparisons", label: "Comparisons" },
];
