import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";

export function ServiceCard({
  title,
  copy,
  href,
  cta,
  headingLevel = "h2",
}: {
  title: string;
  copy: string;
  href: string;
  cta: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Card as="article" className="flex h-full flex-col">
      <Heading className="text-h4">{title}</Heading>
      <p className="mt-2 flex-1 text-body-sm text-muted">{copy}</p>
      <p className="mt-4">
        <Button href={href} variant="secondary">
          {cta}
        </Button>
      </p>
    </Card>
  );
}

export function MotCard(props: {
  title: string;
  copy: string;
  href: string;
  cta: string;
}) {
  return <ServiceCard {...props} />;
}

export function WarrantyCard(props: {
  title: string;
  copy: string;
  href: string;
  cta: string;
}) {
  return <ServiceCard {...props} />;
}
