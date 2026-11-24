import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { GuaranteeStaffBoard } from "@/components/guarantee/GuaranteeStaffBoard";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Guarantee requests",
  path: routes.guaranteeRequests,
  description: "Staff board for 30 Day Guarantee requests.",
  indexable: false,
});

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Help and support", href: routes.help },
    { label: "Guarantee requests", href: routes.guaranteeRequests },
  ]);

  return (
    <>
      <PageBanner
        title="Guarantee requests"
        description="Staff status board. Progress requests from Submitted through Closed. Launch blockers stay here until cleared."
        breadcrumbs={breadcrumbs}
        width="narrow"
      />
      <Section>
        <Container width="narrow">
          <GuaranteeStaffBoard />
        </Container>
      </Section>
    </>
  );
}
