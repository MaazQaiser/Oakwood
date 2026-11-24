import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = createPageMetadata({
  title: "Complaint procedure",
  path: routes.complaintProcedure,
  description:
    "How Oakwood handles complaints. Start online with Problem with your car?",
});

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Complaint procedure", href: routes.complaintProcedure },
  ]);

  return (
    <>
      <Container width="narrow" className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>
      <PageBanner
        title="Complaint procedure"
        description="Every complaint, warranty claim and 30 day request goes through one online form so nothing is handled off system."
      />
      <Section>
        <Container width="narrow" className="space-y-4">
          <p className="text-body text-muted">
            Use{" "}
            <Link href={routes.problemWithYourCar} className="text-primary underline">
              Problem with your car?
            </Link>{" "}
            to tell us what you need. You get a reference straight away. If you
            cannot use the form, call us and we will complete it with you.
          </p>
          <p className="text-body text-muted">
            Finance complaints follow the FCA complaint handling rules. Your
            statutory rights are unchanged.
          </p>
          <Button href={routes.problemWithYourCar}>Problem with your car?</Button>
        </Container>
      </Section>
    </>
  );
}
