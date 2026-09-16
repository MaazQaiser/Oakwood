import { Container, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import type { FinanceEducationStep } from "@/types/finance-intent";

export function FinanceStep({
  title,
  steps,
}: {
  title: string;
  steps: readonly FinanceEducationStep[];
}) {
  return (
    <Section>
      <Container>
        <h2 className="text-h2">{title}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card as="article" className="h-full">
                <p className="text-caption text-primary">{index + 1}</p>
                <h3 className="mt-2 text-h4">{step.title}</h3>
                <p className="mt-2 text-body-sm text-muted">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
