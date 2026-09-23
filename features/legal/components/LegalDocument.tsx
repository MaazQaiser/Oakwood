import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { LegalMissingNotice } from "@/features/legal/components/LegalMissingNotice";
import { LegalToc } from "@/features/legal/components/LegalToc";
import { LegalViewTracker } from "@/features/legal/components/LegalViewTracker";
import { CookiePreferencesLink } from "@/features/legal/components/CookiePreferencesLink";
import { routes } from "@/config/routes";
import { getShowroom } from "@/config/locations";
import { toTelHref } from "@/lib/format/phone";
import {
  LEGAL_CONTACT_BODY,
  LEGAL_CONTACT_HEADING,
  LEGAL_LAST_UPDATED_UNAVAILABLE,
  LEGAL_RELATED_HEADING,
} from "@/lib/legal/copy";
import { createBreadcrumbs } from "@/lib/seo";
import type { LegalDocument } from "@/types/legal";

const bury = getShowroom("bury");

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  const breadcrumbs = createBreadcrumbs(
    document.path === routes.legal
      ? [
          { label: "Home", href: routes.home },
          { label: "Legal", href: routes.legal },
        ]
      : [
          { label: "Home", href: routes.home },
          { label: "Legal", href: routes.legal },
          { label: document.title, href: document.path },
        ],
  );

  return (
    <>
      <LegalViewTracker slug={document.slug} />
      <PageBanner
        eyebrow="Legal"
        title={document.title}
        description={document.intro || undefined}
        breadcrumbs={breadcrumbs}
        width="narrow"
      >
        <p className="text-caption text-[#002852]">
          {document.lastUpdated
            ? `Last updated: ${document.lastUpdated}`
            : LEGAL_LAST_UPDATED_UNAVAILABLE}
        </p>
      </PageBanner>
      <article>
        <Section>
          <Container width="narrow">
            <LegalMissingNotice items={document.missing} />
            {document.slug === "cookies" ? (
              <p className="mt-4">
                <CookiePreferencesLink />
              </p>
            ) : null}
            <div className="mt-8">
              <LegalToc sections={document.sections} />
            </div>
            <div className="max-w-prose space-y-10">
              {document.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-h2">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-3 text-body text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {section.subsections?.map((subsection) => (
                    <div key={subsection.id} id={subsection.id} className="mt-6 scroll-mt-24">
                      <h3 className="text-h3">{subsection.title}</h3>
                      {subsection.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="mt-3 text-body text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </section>
              ))}
            </div>
            <section className="mt-12 max-w-prose">
              <h2 className="text-h2">{LEGAL_CONTACT_HEADING}</h2>
              <p className="mt-3 text-body text-muted">{LEGAL_CONTACT_BODY}</p>
              <p className="mt-3">
                <Link
                  href={routes.contact}
                  className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Contact Oakwood
                </Link>
                {bury?.telephone ? (
                  <>
                    {" · "}
                    <a
                      href={toTelHref(bury.telephone)}
                      className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {bury.telephone}
                    </a>
                  </>
                ) : null}
              </p>
            </section>
            {document.related.length > 0 ? (
              <nav aria-label={LEGAL_RELATED_HEADING} className="mt-12">
                <h2 className="text-h2">{LEGAL_RELATED_HEADING}</h2>
                <ul className="mt-4">
                  {document.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </Container>
        </Section>
      </article>
    </>
  );
}
