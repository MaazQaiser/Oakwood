import Image from "next/image";
import Link from "next/link";
import { Container, Grid, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import { IconArrow } from "@/components/ui/icons";
import { SectionIntro } from "@/components/home/SectionIntro";
import { needCategoryImage } from "@/lib/media/stock";
import { needCategories } from "@/lib/mock/home";

export function CategoryCard({
  id,
  title,
  description,
  href,
}: {
  id: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card as="article" className="flex h-full flex-col overflow-hidden border-0 shadow-sm" padded={false}>
        <div className="relative aspect-[16/10] bg-page-tint">
          <Image
            src={needCategoryImage(id)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 items-start justify-between gap-3 p-5">
          <div>
            <h3 className="text-h5">{title}</h3>
            <p className="mt-2 text-body-sm text-muted">{description}</p>
          </div>
          <IconArrow className="mt-1 shrink-0 text-primary" />
        </div>
      </Card>
    </Link>
  );
}

export function BrowseByNeed() {
  return (
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Find the right fit"
          heading="Shop by what you need."
        >
          Start with the type of car that suits your everyday life.
        </SectionIntro>
        <Grid columns="budget" className="mt-8">
          {needCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              href={category.href}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
