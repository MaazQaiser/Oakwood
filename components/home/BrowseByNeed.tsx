import Link from "next/link";
import { Container, Grid, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import { OakwoodPhotoSlot } from "@/components/media/OakwoodPhotoSlot";
import { IconArrow } from "@/components/ui/icons";
import { SectionIntro } from "@/components/home/SectionIntro";
import { needPhotography } from "@/lib/home/photography";
import { needCategories } from "@/lib/mock/home";

function CategoryTitle({ title }: { title: string }) {
  const splitAt = title.lastIndexOf(" ");
  const lead = splitAt === -1 ? "" : title.slice(0, splitAt);
  const tail = splitAt === -1 ? title : title.slice(splitAt + 1);

  return (
    <h3 className="text-h5">
      {lead ? <>{lead} </> : null}
      <span className="whitespace-nowrap">
        {tail}<IconArrow className="ml-1 inline-block align-[-0.125em] text-primary" />
      </span>
    </h3>
  );
}

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
        <div className="relative aspect-[16/10] max-h-40 overflow-hidden bg-page-tint sm:max-h-52">
          <OakwoodPhotoSlot
            slot={needPhotography(id)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <CategoryTitle title={title} />
          <p className="mt-2 text-body-sm text-muted">{description}</p>
        </div>
      </Card>
    </Link>
  );
}

export function BrowseByNeed() {
  return (
    <Section
      id="shop-by-need"
      aria-label="Shop by what you need"
      className="bg-[#ECF3F8] py-10! sm:py-12! lg:py-14!"
    >
      <Container className="px-10! sm:px-12! lg:px-16!">
        <SectionIntro align="center" heading="Shop by what you need">
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
