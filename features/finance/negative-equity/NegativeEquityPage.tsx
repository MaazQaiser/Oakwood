import { Container, Section } from "@/components/layout/Container";
import { NegativeEquityBuilder } from "@/features/finance/negative-equity/components/NegativeEquityBuilder";
import { NegativeEquityHero } from "@/features/finance/negative-equity/components/NegativeEquityHero";
import type { NegEquityPageModel } from "@/features/finance/negative-equity/types";
import { NEG_EQUITY_COPY } from "@/lib/finance/negative-equity/content";
import { createBreadcrumbs } from "@/lib/seo";
import {
  createBreadcrumbJsonLd,
  createFaqJsonLd,
} from "@/lib/seo/json-ld";
import { routes } from "@/config/routes";

const headingClass =
  "mt-3 text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#002852]";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function NegativeEquityPage({ model }: { model: NegEquityPageModel }) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Finance", href: routes.finance },
    { label: "Negative equity", href: routes.negativeEquity },
  ]);
  const faq = createFaqJsonLd([...NEG_EQUITY_COPY.faq]);

  return (
    <>
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faq} />
      <NegativeEquityHero breadcrumbs={breadcrumbs} />
      {/*
        Server-rendered intro so AI crawlers see the answer without JS.
        The interactive quote engine hydrates below.
      */}
      <Section>
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Finance</p>
          <h2 className={headingClass}>Negative equity car finance</h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            If your car is worth less than you owe, Oakwood can settle the
            shortfall on a separate agreement at 9.9% APR and put you into a car
            that works with that figure. Two agreements, one monthly total. Check
            your rate with a soft search first.
          </p>
          <ul className="mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
            {NEG_EQUITY_COPY.faq.map((item) => (
              <li
                key={item.question}
                className="rounded-[24px] border border-[#E7EEF4] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                <span className="block text-base font-semibold text-[#002852]">
                  {item.question}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  {item.answer}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <NegativeEquityBuilder
        cars={model.cars}
        initialStockId={model.initialStockId}
      />
    </>
  );
}
