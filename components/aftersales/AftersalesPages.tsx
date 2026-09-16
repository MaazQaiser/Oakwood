import type { ReactNode } from "react";
import { Container, Grid, Section, Stack } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AftersalesFaq } from "@/components/aftersales/AftersalesFaq";
import { AftersalesHero } from "@/components/aftersales/AftersalesHero";
import { AftersalesHubHero } from "@/components/aftersales/AftersalesHero";
import { AftersalesLocations } from "@/components/aftersales/AftersalesLocations";
import { AftersalesRelatedLinks } from "@/components/aftersales/AftersalesRelatedLinks";
import { AftersalesViewTracker } from "@/components/aftersales/AftersalesViewTracker";
import { CallbackEnquiryForm } from "@/components/aftersales/CallbackEnquiryForm";
import { ServiceCard } from "@/components/aftersales/ServiceCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { getBookingUrl, routes } from "@/config/routes";
import {
  aftersalesServices,
  audiManufacturerCopy,
  audiServiceCopy,
  audiServiceFaqs,
  manufacturerServicing,
  motChecks,
  motFailCopy,
  motFaqs,
  motPageCopy,
  motWhenRequired,
  serviceFaqs,
  serviceIncludedStatus,
  serviceIntervalsStatus,
  serviceOverview,
  servicePageCopy,
  servicePricingStatus,
  warrantyCoverage,
  warrantyFaqs,
  warrantyPageCopy,
} from "@/lib/aftersales/content";
import { CMS_NOTICE, WARRANTY_ENGINE_NOTICE } from "@/lib/aftersales/copy";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { createBreadcrumbs, type BreadcrumbItem } from "@/lib/seo";
import type { AftersalesFaqItem, AftersalesPageCopy } from "@/types/aftersales";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function PageShell({
  breadcrumbs,
  children,
}: {
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
}) {
  return (
    <>
      <Section className="pb-0">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </Section>
      {children}
    </>
  );
}

export function AftersalesHubPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <AftersalesViewTracker page="aftersales" />
      <AftersalesHubHero />
      <Section>
        <Container>
          <Grid columns="cards">
            {aftersalesServices.map((item) => (
              <ServiceCard
                key={item.key}
                title={item.title}
                copy={item.copy}
                href={item.href}
                cta={item.cta}
              />
            ))}
          </Grid>
          <div className="mt-12">
            <AftersalesLocations />
          </div>
          <div className="mt-12">
            <AftersalesRelatedLinks current={routes.aftersales} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function ServicePage({
  variant = "service",
}: {
  variant?: "service" | "audi";
}) {
  const copy: AftersalesPageCopy =
    variant === "audi" ? audiServiceCopy : servicePageCopy;
  const faqs: AftersalesFaqItem[] =
    variant === "audi" ? audiServiceFaqs : serviceFaqs;
  const path = variant === "audi" ? routes.servicingAudi : routes.service;
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: copy.metaTitle, href: path },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <AftersalesViewTracker page="service" />
      <JsonLd data={createFaqJsonLd(faqs)} />
      <AftersalesHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primary={{
          href: getBookingUrl({
            type: "service",
            source: "service",
          }),
          label: "Book a service",
        }}
        secondary={{
          href: routes.bookingEnquiry,
          label: "Request a callback",
        }}
      />
      <Section>
        <Container>
          <Stack gap="8">
            {serviceOverview.map((item) => (
              <section key={item.title} aria-labelledby={`${item.title}-heading`}>
                <h2 id={`${item.title}-heading`} className="text-h3">
                  {item.title}
                </h2>
                <p className="mt-3 text-body text-muted">{item.body}</p>
              </section>
            ))}

            {variant === "audi" ? (
              <section aria-labelledby="audi-servicing-heading">
                <h2 id="audi-servicing-heading" className="text-h3">
                  {audiManufacturerCopy.title}
                </h2>
                <p className="mt-3 text-body text-muted">{audiManufacturerCopy.body}</p>
              </section>
            ) : (
              <section aria-labelledby="manufacturer-servicing-heading">
                <h2 id="manufacturer-servicing-heading" className="text-h3">
                  {manufacturerServicing.title}
                </h2>
                <p className="mt-3 text-body text-muted">{manufacturerServicing.body}</p>
                <p className="mt-4">
                  <Button href={manufacturerServicing.href} variant="secondary">
                    {manufacturerServicing.cta}
                  </Button>
                </p>
              </section>
            )}

            <Grid columns="two">
              <Card>
                <h2 className="text-h4">{serviceIncludedStatus.title}</h2>
                <p className="mt-2 text-body-sm text-muted">{serviceIncludedStatus.body}</p>
              </Card>
              <Card>
                <h2 className="text-h4">{serviceIntervalsStatus.title}</h2>
                <p className="mt-2 text-body-sm text-muted">{serviceIntervalsStatus.body}</p>
              </Card>
            </Grid>
            <Alert title={servicePricingStatus.title} tone="info">
              {servicePricingStatus.body}
            </Alert>
            <p className="text-caption text-muted">{CMS_NOTICE}</p>
            <AftersalesLocations bookingType="service" />
            <AftersalesFaq items={faqs} />
            <AftersalesRelatedLinks current={path} />
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}

export function MotPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "MOT", href: routes.mot },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <AftersalesViewTracker page="mot" />
      <JsonLd data={createFaqJsonLd(motFaqs)} />
      <AftersalesHero
        eyebrow={motPageCopy.eyebrow}
        title={motPageCopy.title}
        description={motPageCopy.description}
        primary={{
          href: getBookingUrl({ type: "mot", source: "mot" }),
          label: "Book an MOT",
        }}
        secondary={{
          href: routes.bookingEnquiry,
          label: "Request a callback",
        }}
      />
      <Section>
        <Container>
          <Stack gap="8">
            <section aria-labelledby="mot-overview-heading">
              <h2 id="mot-overview-heading" className="text-h3">
                MOT service
              </h2>
              <p className="mt-3 text-body text-muted">
                An MOT is a UK roadworthiness test. Oakwood takes MOT booking
                requests for Bury and Chorley and will confirm the appointment
                with you.
              </p>
            </section>
            <section aria-labelledby="mot-checks-heading">
              <h2 id="mot-checks-heading" className="text-h3">
                What an MOT checks
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-muted">
                {motChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="mot-when-heading">
              <h2 id="mot-when-heading" className="text-h3">
                When an MOT is required
              </h2>
              <p className="mt-3 text-body text-muted">{motWhenRequired}</p>
            </section>
            <section aria-labelledby="mot-fail-heading">
              <h2 id="mot-fail-heading" className="text-h3">
                If the vehicle fails
              </h2>
              <p className="mt-3 text-body text-muted">{motFailCopy}</p>
            </section>
            <Alert title="MOT prices" tone="info">
              MOT prices are not published here. Oakwood will confirm any cost
              when we take your booking request.
            </Alert>
            <AftersalesLocations bookingType="mot" />
            <AftersalesFaq items={motFaqs} />
            <AftersalesRelatedLinks current={routes.mot} />
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}

export function WarrantyPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "Warranty", href: routes.warranty },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <AftersalesViewTracker page="warranty" />
      <JsonLd data={createFaqJsonLd(warrantyFaqs)} />
      <AftersalesHero
        eyebrow={warrantyPageCopy.eyebrow}
        title={warrantyPageCopy.title}
        description={warrantyPageCopy.description}
        primary={{
          href: routes.warrantyClaims,
          label: "Make a warranty claim",
        }}
        secondary={{
          href: routes.bookingEnquiry,
          label: "Contact Oakwood",
        }}
      />
      <Section>
        <Container>
          <Stack gap="8">
            <section aria-labelledby="warranty-cover-heading">
              <h2 id="warranty-cover-heading" className="text-h3">
                Oakwood warranty coverage
              </h2>
              <p className="mt-3 text-body text-muted">{warrantyCoverage.summary}</p>
              <p className="mt-3 text-body text-muted">{warrantyCoverage.expect}</p>
            </section>
            <section aria-labelledby="warranty-use-heading">
              <h2 id="warranty-use-heading" className="text-h3">
                How to use the warranty
              </h2>
              <p className="mt-3 text-body text-muted">{warrantyCoverage.howToUse}</p>
            </section>
            <section aria-labelledby="warranty-covered-heading">
              <h2 id="warranty-covered-heading" className="text-h3">
                What is covered
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-muted">
                {warrantyCoverage.covered.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="warranty-not-heading">
              <h2 id="warranty-not-heading" className="text-h3">
                What isn&apos;t covered
              </h2>
              <p className="mt-3 text-body text-muted">{warrantyCoverage.notPublished}</p>
            </section>
            <Alert title="Warranty terms" tone="info">
              {WARRANTY_ENGINE_NOTICE}
            </Alert>
            <AftersalesLocations />
            <AftersalesFaq items={warrantyFaqs} />
            <AftersalesRelatedLinks current={routes.warranty} />
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}

export function BookingEnquiryPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "Booking enquiry", href: routes.bookingEnquiry },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <Section>
        <Container width="narrow">
          <h1 className="text-h1">Request a callback</h1>
          <p className="mt-3 text-body text-muted">
            If we can&apos;t show appointments online, leave your details and Oakwood
            will call you back.
          </p>
          <div className="mt-8">
            <CallbackEnquiryForm />
          </div>
          <div className="mt-12">
            <AftersalesRelatedLinks current={routes.bookingEnquiry} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
