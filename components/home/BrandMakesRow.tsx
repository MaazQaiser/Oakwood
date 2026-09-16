import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { Button } from "@/components/ui/Button";
import { getMakeUrl, routes } from "@/config/routes";
import { getMakes } from "@/lib/vehicles/labels";

const FEATURED_MAKE_SLUGS = [
  "audi",
  "bmw",
  "ford",
  "mercedes-benz",
  "volkswagen",
  "toyota",
  "hyundai",
  "vauxhall",
];

export function BrandMakesRow() {
  const makes = getMakes("car");
  const featured = FEATURED_MAKE_SLUGS.map((slug) =>
    makes.find((make) => make.slug === slug),
  ).filter((make): make is { slug: string; name: string } => Boolean(make));

  if (featured.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionIntro
          eyebrow="Browse by make"
          heading="Find the make you already know."
          action={
            <Button href={routes.usedCars} variant="text">
              View all cars
            </Button>
          }
        >
          Jump straight into current Oakwood stock.
        </SectionIntro>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {featured.map((make) => (
            <li key={make.slug}>
              <Link
                href={getMakeUrl(make.name)}
                className="flex flex-col items-center gap-3 rounded-2xl bg-surface px-3 py-6 text-center no-underline shadow-sm transition-colors hover:bg-page-tint"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-page-tint text-h6 text-ink">
                  {make.name.charAt(0)}
                </span>
                <span className="text-caption text-muted">{make.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
