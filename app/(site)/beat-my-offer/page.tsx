import { BeatLoanOfferForm } from "@/components/finance/BeatLoanOfferForm";
import { Container, Section } from "@/components/layout/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { routes } from "@/config/routes";
import { BEAT_LOAN_OFFER } from "@/lib/finance/beat-loan-offer";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: BEAT_LOAN_OFFER.metaTitle,
  path: routes.beatLoanOffer,
  description: BEAT_LOAN_OFFER.metaDescription,
});

export default function BeatMyOfferPage() {
  return (
    <>
      <PageBanner
        title={BEAT_LOAN_OFFER.title}
        description={BEAT_LOAN_OFFER.description}
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Finance", href: routes.finance },
          { label: BEAT_LOAN_OFFER.title, href: routes.beatLoanOffer },
        ]}
      />
      <Section>
        <Container width="narrow">
          <BeatLoanOfferForm />
        </Container>
      </Section>
    </>
  );
}
