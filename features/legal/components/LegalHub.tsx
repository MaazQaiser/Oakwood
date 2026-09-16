import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { Card } from "@/components/cards/Card";
import { LegalViewTracker } from "@/features/legal/components/LegalViewTracker";
import { legalHubItems } from "@/content/legal";
import { routes } from "@/config/routes";
import { LEGAL_HUB_H1, LEGAL_HUB_INTRO } from "@/lib/legal/copy";
import { createBreadcrumbs } from "@/lib/seo";

export function LegalHub() {
  return (
    <>
      <LegalViewTracker slug="hub" />
      <Section className="pb-0">
        <Container width="narrow">
          <Breadcrumbs
            items={createBreadcrumbs([
              { label: "Home", href: routes.home },
              { label: "Legal", href: routes.legal },
            ])}
          />
        </Container>
      </Section>
      <section className="border-b border-border bg-surface">
        <Container width="narrow" className="py-10 md:py-16">
          <SectionIntro eyebrow="Legal" heading={LEGAL_HUB_H1} headingLevel="h1">
            <p>{LEGAL_HUB_INTRO}</p>
          </SectionIntro>
        </Container>
      </section>
      <Section>
        <Container width="narrow">
          <ul className="flex flex-col gap-3">
            {legalHubItems.map((item) => (
              <li key={item.href}>
                <Card>
                  <h2 className="text-h3">
                    <Link
                      href={item.href}
                      className="text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {item.label}
                    </Link>
                  </h2>
                  <p className="mt-2 text-body-sm text-muted">{item.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
