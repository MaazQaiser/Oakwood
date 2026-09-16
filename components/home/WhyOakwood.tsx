import { Container, Grid, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { whyOakwood } from "@/lib/mock/home";

export function WhyOakwood() {
  return (
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Why Oakwood"
          heading="A simpler way to buy your next car."
        >
          We give you the information you need to make a confident decision,
          from finance to the car itself.
        </SectionIntro>
        <Grid columns="two" className="mt-10">
          {whyOakwood.map((item) => (
            <article key={item.number}>
              <p className="financial-number financial-number--sm text-primary">
                {item.number}
              </p>
              <h3 className="text-h4 mt-3">{item.title}</h3>
              <p className="mt-2 text-body text-muted">{item.copy}</p>
            </article>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
