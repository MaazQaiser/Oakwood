import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
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
      <PageBanner
        eyebrow="Legal"
        title={LEGAL_HUB_H1}
        description={LEGAL_HUB_INTRO}
        breadcrumbs={createBreadcrumbs([
          { label: "Home", href: routes.home },
          { label: "Legal", href: routes.legal },
        ])}
        width="narrow"
      />
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
