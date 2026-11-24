import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Warranty claims",
  path: routes.warrantyClaims,
  description:
    "Short guide to Oakwood warranty cover and how to report a fault on a car you bought from us.",
});

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Service", href: routes.service },
    { label: "Warranty claims", href: routes.warrantyClaims },
  ]);

  return (
    <>
      <PageBanner
        title="Warranty claims"
        description="Every Oakwood car includes warranty cover. If something fails, tell us through the problem form so we can help quickly."
        breadcrumbs={breadcrumbs}
        width="narrow"
      >
        <Button
          href={`${routes.problemWithYourCar}?need=warranty`}
          className="scroll-mt-24"
        >
          Start a warranty report
        </Button>
      </PageBanner>
      <Section className="pb-[var(--oak-section-y)]">
        <Container width="narrow" className="space-y-4 text-body text-muted">
          <p>
            Warranty covers listed mechanical and electrical faults for the
            period shown in your purchase documents. Cosmetic wear, tyres and
            routine servicing are not warranty items unless your paperwork says
            otherwise.
          </p>
          <p>
            Photographs help us understand the issue. After you submit the form,
            we may ask for more detail or book the car into Bury or Chorley.
          </p>
          <p>
            Need the full warranty guide?{" "}
            <Link href={routes.warranty} className="font-semibold text-primary">
              About our warranty
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}