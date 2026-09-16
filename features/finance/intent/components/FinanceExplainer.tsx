import { Container, Section } from "@/components/layout/Container";
import type { FinanceExplainerBlock } from "@/types/finance-intent";

export function FinanceExplainer({
  block,
  headingId,
}: {
  block: FinanceExplainerBlock;
  headingId: string;
}) {
  return (
    <Section>
      <Container width="narrow">
        <h2 id={headingId} className="text-h2">
          {block.title}
        </h2>
        <div className="mt-4 space-y-3">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
