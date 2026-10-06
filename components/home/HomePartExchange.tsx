import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { routes } from "@/config/routes";
import { HOME_PART_EXCHANGE } from "@/lib/home/copy";
import { PX_INTRO_CTA, PX_INTRO_SUPPORT } from "@/lib/part-exchange/copy";

export function HomePartExchange() {
  return (
    <Section id="part-exchange" aria-label="Part exchange">
      <Container>
        <SectionIntro heading={`${HOME_PART_EXCHANGE}.`}>
          {PX_INTRO_SUPPORT}
        </SectionIntro>
        <p className="mt-6">
          <Button href={routes.partExchange}>{PX_INTRO_CTA}</Button>
        </p>
      </Container>
    </Section>
  );
}
