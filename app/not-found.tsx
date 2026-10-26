import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getUsedCarsUrl, routes } from "@/config/routes";

export default function NotFound() {
  return (
    <Section>
      <Container width="content" className="py-10 sm:py-16">
        <div className="mx-auto max-w-lg rounded-card border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <p className="oak-eyebrow">404</p>
          <h1 className="mt-3 text-h2 text-navy">This page isn&apos;t here</h1>
          <p className="mt-3 text-body text-muted">
            The link may be wrong, or the car may have sold. Search stock or
            head back to the homepage.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
            <Button href={getUsedCarsUrl()}>Browse used cars</Button>
            <Button href={routes.search} variant="secondary">
              Search cars
            </Button>
            <Link
              href={routes.home}
              className="inline-flex min-h-11 items-center justify-center text-button text-primary underline-offset-2 hover:underline"
            >
              Home
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
