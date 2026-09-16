import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { getBookingUrl } from "@/config/routes";

export function AftersalesHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-10 md:py-16">
        <SectionIntro eyebrow={eyebrow} heading={title} headingLevel="h1">
          {description}
        </SectionIntro>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={primary.href} size="lg">
            {primary.label}
          </Button>
          {secondary ? (
            <Button href={secondary.href} variant="secondary" size="lg">
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export function AftersalesHubHero() {
  return (
    <AftersalesHero
      eyebrow="Aftersales"
      title="Keep your car running at its best"
      description="Book servicing, MOTs and support with Oakwood."
      primary={{
        href: getBookingUrl({ type: "service", source: "aftersales" }),
        label: "Book a service",
      }}
      secondary={{
        href: getBookingUrl({ type: "mot", source: "aftersales" }),
        label: "Book an MOT",
      }}
    />
  );
}
