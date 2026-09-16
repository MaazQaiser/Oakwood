"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { ContentCtaKind } from "@/types/content";

export function ContentTrackedLink({
  href,
  kind,
  slug,
  children,
  className,
}: {
  href: string;
  kind: ContentCtaKind;
  slug?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent(analyticsEvents.contentCtaClicked, { kind, slug, href });
        if (kind === "finance" || kind === "calculator" || kind === "deal") {
          trackEvent(analyticsEvents.contentFinanceClicked, { kind, slug });
        }
        if (kind === "px") {
          trackEvent(analyticsEvents.contentPxClicked, { slug });
        }
        if (kind === "stock") {
          trackEvent(analyticsEvents.modelStockClicked, { slug, href });
        }
        if (kind === "related") {
          trackEvent(analyticsEvents.blogArticleClicked, { href, slug });
        }
      }}
    >
      {children}
    </Link>
  );
}
