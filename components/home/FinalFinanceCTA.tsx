import { FinanceRateCta } from "@/components/finance/FinanceRateCta";
import { Container, Section } from "@/components/layout/Container";

export function FinalFinanceCTA() {
  return (
    <Section>
      <Container>
        <FinanceRateCta variant="full" source="homepage_footer" />
      </Container>
    </Section>
  );
}
