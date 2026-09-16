import { Container, Grid, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import { IconArrow } from "@/components/ui/icons";
import { SectionIntro } from "@/components/home/SectionIntro";
import { budgetBands } from "@/lib/mock/home";
import Link from "next/link";

export function BudgetCard({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card className="flex h-full items-center justify-between gap-3 border-0 shadow-sm md:items-start md:gap-4">
        <div className="min-w-0">
          <p className="text-h5 tabular-number">{label}</p>
          <p className="mt-1 text-body-sm text-muted md:mt-2">
            <span className="financial-number financial-number--sm">{count}</span>{" "}
            cars
          </p>
          <p className="mt-2 hidden text-label text-primary md:mt-4 md:block">View cars →</p>
        </div>
        <IconArrow className="mt-1 shrink-0 text-primary" />
      </Card>
    </Link>
  );
}

export function MonthlyBudgetSection() {
  return (
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Shop by budget"
          heading="Find cars that fit your monthly budget."
        >
          Browse vehicles by the monthly payment that works for you.
        </SectionIntro>
        <Grid columns="budget" className="mt-8">
          {budgetBands.map((band) => (
            <BudgetCard
              key={band.id}
              label={band.label}
              count={band.count}
              href={band.href}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
