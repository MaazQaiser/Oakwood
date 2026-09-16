import type { ReactNode } from "react";
import { AftersalesHero } from "@/components/aftersales/AftersalesHero";
import { LocationCard } from "@/components/locations/LocationCard";
import { LocationRelatedLinks } from "@/components/locations/LocationRelatedLinks";
import { PreparationStandards } from "@/components/trust/PreparationStandards";
import { ProcessStep } from "@/components/trust/ProcessStep";
import { ReviewsGrid } from "@/components/trust/ReviewsGrid";
import { ReviewSummary } from "@/components/trust/ReviewSummary";
import { TrustSignal } from "@/components/trust/TrustSignal";
import { TrustViewTracker } from "@/components/trust/TrustViewTracker";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Container, Grid, Section, Stack } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { showroomProfiles } from "@/config/locations";
import {
  getEligibilityUrl,
  getLocationUrl,
  routes,
  trustRoutes,
} from "@/config/routes";
import { getReviewFeed } from "@/lib/reviews/provider";
import { createBreadcrumbs } from "@/lib/seo";
import {
  CMS_TRUST_NOTICE,
  aaStandardsCopy,
  aaStandardsSections,
  aboutCopy,
  aboutCustomerExperience,
  aboutStory,
  aboutWhatWeDo,
  deliveryCopy,
  deliverySections,
  howItWorksCopy,
  howItWorksSteps,
  preparationCopy,
  preparationSections,
  reviewsCopy,
  whatToExpectCopy,
  whatToExpectSections,
} from "@/lib/trust/content";
import { LegalDocumentView } from "@/features/legal/components/LegalDocument";
import { regulatoryDocument } from "@/content/legal/documents";
import type { TrustPageCopy, TrustSection } from "@/types/trust";

function PageShell({
  breadcrumbs,
  children,
}: {
  breadcrumbs: { label: string; href: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <Section className="pb-0">
        <Container>
          <Breadcrumbs items={createBreadcrumbs(breadcrumbs)} />
        </Container>
      </Section>
      {children}
    </>
  );
}

function ContentSections({ sections }: { sections: TrustSection[] }) {
  return (
    <Stack gap="8">
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={`${section.title}-heading`}>
          <h2 id={`${section.title}-heading`} className="text-h3">
            {section.title}
          </h2>
          <p className="mt-3 text-body text-muted">{section.body}</p>
        </section>
      ))}
    </Stack>
  );
}

function TrustHero({
  copy,
  primary,
  secondary,
}: {
  copy: TrustPageCopy;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <AftersalesHero
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      primary={primary}
      secondary={secondary}
    />
  );
}

export function AboutPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "About", href: routes.about },
      ]}
    >
      <TrustViewTracker page="about" />
      <TrustHero
        copy={aboutCopy}
        primary={{ href: getEligibilityUrl(), label: "Check my eligibility" }}
        secondary={{ href: routes.usedCars, label: "Browse cars" }}
      />
      <Section>
        <Container>
          <Stack gap="8">
            <section aria-labelledby="about-story-heading">
              <h2 id="about-story-heading" className="text-h3">
                {aboutStory.title}
              </h2>
              <p className="mt-3 text-body text-muted">{aboutStory.body}</p>
            </section>
            <section aria-labelledby="about-do-heading">
              <h2 id="about-do-heading" className="text-h3">
                {aboutWhatWeDo.title}
              </h2>
              <p className="mt-3 text-body text-muted">{aboutWhatWeDo.body}</p>
            </section>
            <section aria-labelledby="about-locations-heading">
              <h2 id="about-locations-heading" className="text-h3">
                Locations
              </h2>
              <Grid columns="two" className="mt-6">
                {showroomProfiles.map((profile) => (
                  <LocationCard
                    key={profile.slug}
                    profile={profile}
                    href={getLocationUrl(profile.slug)}
                    headingLevel="h3"
                  />
                ))}
              </Grid>
            </section>
            <section aria-labelledby="about-experience-heading">
              <h2 id="about-experience-heading" className="text-h3">
                {aboutCustomerExperience.title}
              </h2>
              <p className="mt-3 text-body text-muted">
                {aboutCustomerExperience.body}
              </p>
            </section>
            <section aria-labelledby="about-trust-heading">
              <h2 id="about-trust-heading" className="text-h3">
                Trust and standards
              </h2>
              <Grid columns="two" className="mt-6">
                <TrustSignal
                  title="Prepared before sale"
                  copy="Recorded preparation is listed on each vehicle page."
                  href={trustRoutes.ourGarage}
                />
                <TrustSignal
                  title="Vehicle history"
                  copy="MOT, provenance and recall notes are shown with the car."
                  href={trustRoutes.aaStandards}
                />
                <TrustSignal
                  title="Credit broker"
                  copy="Oakwood Motor Company is a credit broker, not a lender. Finance is subject to status."
                  href={routes.statusDisclosure}
                />
                <TrustSignal
                  title="Warranty"
                  copy="Available cars include a 12-month warranty."
                  href={routes.warranty}
                />
              </Grid>
            </section>
            <section aria-labelledby="about-reviews-heading">
              <h2 id="about-reviews-heading" className="text-h3">
                Reviews
              </h2>
              <div className="mt-4">
                <ReviewSummary feed={getReviewFeed()} />
              </div>
              <p className="mt-4">
                <Button href={routes.ourOnlineReviews} variant="text">
                  Our online reviews
                </Button>
              </p>
            </section>
            <p className="text-caption text-muted">{CMS_TRUST_NOTICE}</p>
            <LocationRelatedLinks current={routes.about} />
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}

export function HowItWorksPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "How it works", href: routes.howItWorks },
      ]}
    >
      <TrustViewTracker page="how-it-works" />
      <TrustHero
        copy={howItWorksCopy}
        primary={{ href: getEligibilityUrl(), label: "Check my eligibility" }}
        secondary={{ href: routes.usedCars, label: "Browse cars" }}
      />
      <Section>
        <Container>
          <Stack gap="6">
            {howItWorksSteps.map((step) => (
              <ProcessStep key={step.number} step={step} />
            ))}
            <LocationRelatedLinks current={routes.howItWorks} />
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}

export function WhatToExpectPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "What to expect", href: routes.whatToExpect },
      ]}
    >
      <TrustViewTracker page="what-to-expect" />
      <TrustHero
        copy={whatToExpectCopy}
        primary={{ href: getEligibilityUrl(), label: "Check my eligibility" }}
        secondary={{ href: routes.usedCars, label: "Browse cars" }}
      />
      <Section>
        <Container>
          <ContentSections sections={whatToExpectSections} />
          <div className="mt-12">
            <LocationRelatedLinks current={routes.whatToExpect} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function ReviewsPageView() {
  const feed = getReviewFeed();

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "Reviews", href: routes.ourOnlineReviews },
      ]}
    >
      <TrustViewTracker page="reviews" />
      <TrustHero
        copy={reviewsCopy}
        primary={{ href: routes.locations, label: "Our locations" }}
        secondary={{ href: getEligibilityUrl(), label: "Check my eligibility" }}
      />
      <Section>
        <Container>
          <ReviewSummary feed={feed} />
          <ReviewsGrid reviews={feed.items} />
          <p className="mt-8 text-body-sm text-muted">
            When reviews are connected, this page will show mixed ratings, location,
            date and named colleagues where the provider supplies them. It will not
            use an auto-advancing carousel.
          </p>
          <div className="mt-12">
            <LocationRelatedLinks current={routes.ourOnlineReviews} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function GaragePage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "Our garage", href: routes.ourGarage },
      ]}
    >
      <TrustHero
        copy={preparationCopy}
        primary={{ href: routes.usedCars, label: "Browse cars" }}
        secondary={{ href: routes.about, label: "About Oakwood" }}
      />
      <Section>
        <Container>
          <PreparationStandards sections={preparationSections} />
          <p className="mt-8 text-caption text-muted">{CMS_TRUST_NOTICE}</p>
          <div className="mt-12">
            <LocationRelatedLinks current={routes.ourGarage} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function AaStandardsPageView() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "AA standards", href: routes.aaStandards },
      ]}
    >
      <TrustHero
        copy={aaStandardsCopy}
        primary={{ href: routes.usedCars, label: "Browse cars" }}
        secondary={{ href: routes.about, label: "About Oakwood" }}
      />
      <Section>
        <Container>
          <ContentSections sections={aaStandardsSections} />
          <p className="mt-8 text-caption text-muted">{CMS_TRUST_NOTICE}</p>
          <div className="mt-12">
            <LocationRelatedLinks current={routes.aaStandards} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function DeliveryPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: routes.home },
        { label: "Delivery and collection", href: routes.deliveryAndCollection },
      ]}
    >
      <TrustHero
        copy={deliveryCopy}
        primary={{ href: routes.locations, label: "View locations" }}
        secondary={{ href: routes.distanceSelling, label: "Distance selling" }}
      />
      <Section>
        <Container>
          <ContentSections sections={deliverySections} />
          <div className="mt-8">
            <Alert title="Delivery charges" tone="info">
              Delivery pricing and coverage areas are not published here until the
              content source provides them.
            </Alert>
            <p className="mt-4">
              <a
                href={routes.deliveryTerms}
                className="text-body-sm text-primary underline-offset-4 hover:underline"
              >
                Delivery terms
              </a>
              {" · "}
              <a
                href={routes.vehiclePurchaseTerms}
                className="text-body-sm text-primary underline-offset-4 hover:underline"
              >
                Vehicle purchase terms
              </a>
            </p>
          </div>
          <div className="mt-12">
            <LocationRelatedLinks current={routes.deliveryAndCollection} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export { SupportContactPage as ContactPageView } from "@/features/support/SupportPages";

export function StatusDisclosurePageView() {
  return <LegalDocumentView document={regulatoryDocument} />;
}
