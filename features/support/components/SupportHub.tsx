import Link from "next/link";
import { Card } from "@/components/cards/Card";
import { Container, Grid, Section } from "@/components/layout/Container";
import type { SupportPathway } from "@/types/support";

export function SupportHub({
  title,
  pathways,
}: {
  title: string;
  pathways: SupportPathway[];
}) {
  return (
    <Section>
      <Container>
        <h2 className="text-h2">{title}</h2>
        <Grid columns="cards" className="mt-6">
          {pathways.map((pathway) => (
            <Card as="article" key={pathway.href} className="h-full">
              <h3 className="text-h4">
                <Link
                  href={pathway.href}
                  className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {pathway.title}
                </Link>
              </h3>
              <p className="mt-2 text-body-sm text-muted">{pathway.body}</p>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
