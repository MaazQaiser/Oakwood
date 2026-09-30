import { Container, Section } from "@/components/layout/Container";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import {
  FINANCE_BROKER_STATUS,
  FINANCE_INTENT_DISCLAIMERS,
} from "@/lib/finance/intent/copy";

export function FinanceDisclaimer() {
  return (
    <Section className="pt-0 pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-[var(--oak-section-y)]">
      <Container>
        <aside
          aria-label="Finance illustration notes"
          className="max-w-3xl rounded-[14px] bg-[#ECF3F8] px-5 py-5 sm:px-6"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#002852]">
            Important information
          </p>
          <div className="mt-3 space-y-2 text-caption text-[#344054]">
            {FINANCE_INTENT_DISCLAIMERS.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>{FINANCE_BROKER_STATUS}</p>
            <p>
              <StatusDisclosureLink className="font-medium text-[#002852]" />
            </p>
          </div>
        </aside>
      </Container>
    </Section>
  );
}
