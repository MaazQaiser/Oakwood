import { Container, Grid, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import type { FinanceEducationCard } from "@/types/finance-intent";

export function FinanceEducationCards({
  title,
  paragraphs,
  cards,
}: {
  title: string;
  paragraphs?: string[];
  cards: FinanceEducationCard[];
}) {
  return (
    <Section>
      <Container>
        <h2 className="text-h2">{title}</h2>
        {paragraphs?.map((paragraph) => (
          <p key={paragraph} className="mt-3 max-w-2xl text-body text-muted">
            {paragraph}
          </p>
        ))}
        <Grid columns="cards" className="mt-6">
          {cards.map((card) => (
            <Card as="article" key={card.title} className="h-full">
              <h3 className="text-h4">{card.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{card.body}</p>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
