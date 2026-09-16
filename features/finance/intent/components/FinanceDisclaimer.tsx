import { Container, Section } from "@/components/layout/Container";
import {
  FINANCE_BROKER_STATUS,
  FINANCE_INTENT_DISCLAIMERS,
} from "@/lib/finance/intent/copy";
import { routes } from "@/config/routes";

export function FinanceDisclaimer() {
  return (
    <Section className="pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-[var(--oak-section-y)]">
      <Container width="narrow">
        <div className="space-y-2 text-caption text-muted">
          {FINANCE_INTENT_DISCLAIMERS.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>{FINANCE_BROKER_STATUS}</p>
          <p>
            <a
              href={routes.statusDisclosure}
              className="text-primary underline-offset-4 hover:underline"
            >
              Status disclosure
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
