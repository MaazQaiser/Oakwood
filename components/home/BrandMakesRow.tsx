import { Section } from "@/components/layout/Container";
import { MakeCarousel } from "@/components/home/MakeCarousel";
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
  "nissan",
  "kia",
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
    <Section id="browse-by-make" aria-label="Browse by make" className="overflow-hidden">
      {/*
        Title/controls use oak-page-x inset so the heading never kisses the
        viewport edge. The carousel list uses the same inset + 5-up item width.
      */}
      <MakeCarousel makes={featured} />
    </Section>
  );
}
