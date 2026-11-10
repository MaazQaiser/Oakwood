import { Container, Section } from "@/components/layout/Container";
import { HelpTopQuestions } from "@/components/support/HelpTopQuestions";
import type { FinanceFaqItem } from "@/types/finance-intent";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceFAQ({
  items,
  intent,
  heading = "Top questions",
}: {
  items: FinanceFaqItem[];
  intent: FinanceIntentSlug | "hub";
  heading?: string;
}) {
  void items;
  void intent;

  return (
    <Section>
      <Container width="narrow">
        <HelpTopQuestions topicId="finance" heading={heading} />
      </Container>
    </Section>
  );
}
