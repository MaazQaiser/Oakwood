import type { Metadata } from "next";

export interface PageSeoInput {
  title: string;
  path: string;
  description?: string;
  indexable?: boolean;
  ogType?: "website" | "article";
  ogImage?: string;
}

export function getCanonicalUrl(path: string, origin = ""): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;

  if (!origin) {
    return normalised;
  }

  return `${origin.replace(/\/$/, "")}${normalised}`;
}

export function createPageMetadata({
  title,
  path,
  description,
  indexable = true,
  ogType = "website",
  ogImage,
}: PageSeoInput): Metadata {
  const canonical = getCanonicalUrl(path);

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical,
      type: ogType,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export function createDynamicTitle(
  parts: Array<string | undefined>,
): string {
  return parts.filter(Boolean).join(" ");
}
