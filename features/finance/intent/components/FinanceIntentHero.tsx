import { Container } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { FinanceHeroActions } from "@/features/finance/intent/components/FinanceHeroActions";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceIntentHero({
  eyebrow,
  title,
  intro,
  intent,
  supporting,
  secondary,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  intent: FinanceIntentSlug | "hub";
  supporting?: string;
  secondary?: { href: string; label: string; event: "calculator" | "browse" | "px" };
}) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-10 md:py-16">
        <SectionIntro eyebrow={eyebrow} heading={title} headingLevel="h1">
          <p>{intro}</p>
        </SectionIntro>
        <FinanceHeroActions intent={intent} secondary={secondary} />
        {supporting ? (
          <p className="mt-4 max-w-2xl text-body-sm text-muted">{supporting}</p>
        ) : null}
      </Container>
    </section>
  );
}
