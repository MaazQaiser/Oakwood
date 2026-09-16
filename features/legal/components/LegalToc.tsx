"use client";

import Link from "next/link";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { LEGAL_TOC_LABEL } from "@/lib/legal/copy";
import type { LegalSection } from "@/types/legal";

export function LegalToc({ sections }: { sections: LegalSection[] }) {
  if (sections.length < 2) {
    return null;
  }

  return (
    <nav aria-label={LEGAL_TOC_LABEL} className="mb-8">
      <details className="rounded-md border border-border bg-surface md:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center px-4 text-label outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
          {LEGAL_TOC_LABEL}
        </summary>
        <TocList sections={sections} className="border-t border-border px-4 py-3" />
      </details>
      <div className="hidden md:block">
        <p className="text-label">{LEGAL_TOC_LABEL}</p>
        <TocList sections={sections} className="mt-3" />
      </div>
    </nav>
  );
}

function TocList({
  sections,
  className,
}: {
  sections: LegalSection[];
  className?: string;
}) {
  return (
    <ol className={className}>
      {sections.map((section) => (
        <li key={section.id}>
          <Link
            href={`#${section.id}`}
            className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() =>
              trackEvent(analyticsEvents.legalDocumentSectionClicked, {
                section: section.id,
              })
            }
          >
            {section.title}
          </Link>
        </li>
      ))}
    </ol>
  );
}
