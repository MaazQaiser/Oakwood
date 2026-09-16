import type { VehicleCategory } from "@/types/vehicle";

/**
 * CMS-shaped editorial content. These fields are the Sanity (or equivalent)
 * document contract until a CMS is connected. Do not hard-code article
 * bodies in React components.
 */
export type ContentType = "article" | "model-guide" | "comparison";

export type ContentStatus = "draft" | "published";

export type ContentTopic = "articles" | "guides" | "comparisons";

export type ContentCtaKind =
  | "finance"
  | "stock"
  | "px"
  | "calculator"
  | "deal"
  | "related";

export interface ContentInlineSpan {
  text: string;
  href?: string;
}

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "paragraph"; text?: string; spans?: ContentInlineSpan[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "linkList"; items: Array<{ text: string; href: string }> }
  | { type: "quote"; text: string }
  | { type: "callout"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "table";
      caption?: string;
      headers: string[];
      rows: string[][];
    }
  | { type: "missing"; items: string[] };

export interface ContentAuthor {
  name: string;
}

export interface ContentImage {
  src: string;
  alt: string;
}

export interface ContentRelatedLink {
  href: string;
  label: string;
  description?: string;
}

export interface ContentFaqItem {
  question: string;
  answer: string;
}

export interface ContentCta {
  kind: ContentCtaKind;
  title: string;
  body: string;
  href: string;
  label: string;
}

export interface ContentSeo {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
}

export interface ContentBase {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ContentStatus;
  featured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  author?: ContentAuthor;
  hero?: ContentImage;
  body: ContentBlock[];
  relatedSlugs: string[];
  relatedLinks: ContentRelatedLink[];
  ctas: ContentCta[];
  faqs?: ContentFaqItem[];
  seo: ContentSeo;
  missing: string[];
}

export interface BlogPost extends ContentBase {
  type: "article";
}

export interface ModelGuide extends ContentBase {
  type: "model-guide";
  makeSlug: string;
  modelSlug: string;
  vehicleCategory: VehicleCategory;
}

export interface ComparisonArticle extends ContentBase {
  type: "comparison";
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  declareWinner?: boolean;
}

export type ContentEntry = BlogPost | ModelGuide | ComparisonArticle;

export interface ContentHubItem {
  slug: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  href: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: ContentAuthor;
  hero?: ContentImage;
  readingMinutes?: number;
  featured?: boolean;
}
