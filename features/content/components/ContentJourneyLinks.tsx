import { ContentTrackedLink } from "@/features/content/components/ContentTrackedLink";
import { CONTENT_JOURNEY_HEADING } from "@/lib/content/copy";
import type { ContentRelatedLink } from "@/types/content";

export function ContentJourneyLinks({
  links,
  slug,
}: {
  links: ContentRelatedLink[];
  slug?: string;
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <nav className="mt-10 max-w-prose" aria-labelledby="content-journey-heading">
      <h2 id="content-journey-heading" className="text-h2">
        {CONTENT_JOURNEY_HEADING}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <ContentTrackedLink
              href={link.href}
              kind="related"
              slug={slug}
              className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {link.label}
            </ContentTrackedLink>
            {link.description ? (
              <p className="text-body-sm text-muted">{link.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
