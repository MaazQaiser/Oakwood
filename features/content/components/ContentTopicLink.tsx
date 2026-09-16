"use client";

import Link from "next/link";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function ContentTopicLink({
  href,
  topic,
  current,
  children,
}: {
  href: string;
  topic: string;
  current?: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={
        current
          ? "inline-flex min-h-11 items-center rounded-full border border-ink bg-ink px-4 text-body-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          : "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-body-sm text-ink hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      }
      onClick={() => trackEvent(analyticsEvents.blogCategorySelected, { topic })}
    >
      {children}
    </Link>
  );
}
