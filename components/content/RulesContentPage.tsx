import type { ReactNode } from "react";
import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { IconCheck } from "@/components/ui/icons";
import { Alert } from "@/components/ui/Alert";
import type { RulesPageContent } from "@/lib/content/rules-pages";
import { showPreviewNotices } from "@/lib/env/preview";
import { createBreadcrumbs } from "@/lib/seo";

export function RulesContentPage({
  path,
  parent,
  content,
  children,
}: {
  path: string;
  parent?: { label: string; href: string };
  content: RulesPageContent;
  children?: ReactNode;
}) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: "/" },
    ...(parent ? [parent] : []),
    { label: content.title, href: path },
  ]);

  return (
    <>
      <PageBanner
        title={content.title}
        description={content.description}
        breadcrumbs={breadcrumbs}
        width="narrow"
      />
      <Section className="pb-[var(--oak-section-y)]">
        <Container width="narrow" className="space-y-8">
          {showPreviewNotices() && content.pendingNotice ? (
            <Alert title="Pending sign-off" tone="warning">
              {content.pendingNotice}
            </Alert>
          ) : null}
          {content.journey ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {content.journey.map((step) => (
                <article
                  key={step.title}
                  className="rounded-[20px] bg-page-tint p-5"
                >
                  <h2 className="text-h5">{step.title}</h2>
                  <p className="mt-2 text-body-sm text-muted">{step.body}</p>
                </article>
              ))}
            </div>
          ) : null}
          <section aria-labelledby="rules-heading">
            <h2 id="rules-heading" className="text-h3">
              How it works
            </h2>
            <ul className="mt-4 space-y-3">
              {content.rules.map((rule) => (
                <li key={rule} className="flex gap-3 text-body-sm text-ink">
                  <IconCheck
                    className="mt-0.5 shrink-0 text-success"
                    width={18}
                    height={18}
                    aria-hidden
                  />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>
          {children}
          <p className="text-body-sm text-muted">
            Questions?{" "}
            <Link href="/contact" className="font-semibold text-primary">
              Contact Oakwood
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}