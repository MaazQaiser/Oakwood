import Link from "next/link";
import { Container, Grid, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import { SectionIntro } from "@/components/home/SectionIntro";
import { financeGuides } from "@/lib/mock/home";
import { routes } from "@/config/routes";

export function FinanceGuideCard({
  title,
  description,
  href,
  cta = "Read guide →",
}: {
  title: string;
  description: string;
  href: string;
  cta?: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card as="article" className="flex h-full flex-col border-0 shadow-sm">
        <h3 className="text-h4">{title}</h3>
        <p className="mt-2 flex-1 text-body-sm text-muted">{description}</p>
        <p className="mt-4 text-label text-primary">{cta}</p>
      </Card>
    </Link>
  );
}

export function FinanceEducation() {
  return (
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Finance made simple"
          heading="Everything you need to know about car finance."
        >
          Understand your options before you make a decision.
        </SectionIntro>
        <Grid columns="cards" className="mt-8">
          <FinanceGuideCard
            title="Finance calculator"
            description="See how price, deposit, term and finance type change an estimated monthly payment."
            href={routes.financeCalculator}
            cta="Open calculator →"
          />
          {financeGuides.map((guide) => (
            <FinanceGuideCard
              key={guide.href}
              title={guide.title}
              description={guide.description}
              href={guide.href}
            />
          ))}
        </Grid>
        <p className="mt-6 text-body-sm">
          <Link href={routes.blog} className="text-primary">
            Read more on the Oakwood blog
          </Link>
        </p>
      </Container>
    </Section>
  );
}
