import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { GuaranteeRequestForm } from "@/components/guarantee/GuaranteeRequestForm";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Guarantee request",
  path: routes.thirtyDayGuaranteeRequest,
  description:
    "Start a 30 Day Exchange or Money Back Guarantee request. You get a reference number straight away.",
});

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "30 Day Guarantee", href: routes.thirtyDayGuarantee },
    { label: "Request", href: routes.thirtyDayGuaranteeRequest },
  ]);

  return (
    <>
      <PageBanner
        title="Guarantee request"
        description={`Tell us online within the guarantee period. ${guaranteeCopy.badgeDetail}`}
        breadcrumbs={breadcrumbs}
        width="narrow"
      />
      <Section>
        <Container width="narrow">
          <GuaranteeRequestForm />
        </Container>
      </Section>
    </>
  );
}
