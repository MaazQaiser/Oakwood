"use client";

import { Accordion } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/layout/Container";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { FinanceFaqItem } from "@/types/finance-intent";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceFAQ({
  items,
  intent,
  heading = "Frequently asked questions",
}: {
  items: FinanceFaqItem[];
  intent: FinanceIntentSlug | "hub";
  heading?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container width="narrow">
        <h2 id="finance-faq-heading" className="text-h2">
          {heading}
        </h2>
        <div className="mt-4">
          {items.map((item) => (
            <Accordion
              key={item.question}
              title={item.question}
              onOpen={() =>
                trackEvent(analyticsEvents.financeIntentFaqOpened, {
                  intent,
                })
              }
            >
              {item.answer}
            </Accordion>
          ))}
        </div>
      </Container>
    </Section>
  );
}
