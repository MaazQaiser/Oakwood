import type { ReactNode } from "react";
import { Container, Grid, Section, Stack } from "@/components/layout/Container";
import { PageBanner, PageBannerScope } from "@/components/layout/PageBanner";
import { AftersalesFaq } from "@/components/aftersales/AftersalesFaq";
import { AftersalesHero } from "@/components/aftersales/AftersalesHero";
import { AftersalesHubHero } from "@/components/aftersales/AftersalesHero";
import { AftersalesLocations } from "@/components/aftersales/AftersalesLocations";
import { AftersalesRelatedLinks } from "@/components/aftersales/AftersalesRelatedLinks";
import { AftersalesViewTracker } from "@/components/aftersales/AftersalesViewTracker";
import { BookingList } from "@/components/aftersales/BookingList";
import { CallbackEnquiryForm } from "@/components/aftersales/CallbackEnquiryForm";
import { MotPageV2 } from "@/components/aftersales/MotPageV2";
import { ServiceCard } from "@/components/aftersales/ServiceCard";
import { ServicePageV2 } from "@/components/aftersales/ServicePageV2";
import { WarrantyPageV2 } from "@/components/aftersales/WarrantyPageV2";
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
  serviceIncludedStatus,
  serviceIntervalsStatus,
  serviceOverview,
  servicePricingStatus,
} from "@/lib/aftersales/content";
import { CMS_NOTICE } from "@/lib/aftersales/copy";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { createBreadcrumbs, type BreadcrumbItem } from "@/lib/seo";
import type { AftersalesFaqItem, AftersalesPageCopy } from "@/types/aftersales";
import type { BookingListEntry } from "@/types/booking";

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
  return <PageBannerScope breadcrumbs={breadcrumbs}>{children}</PageBannerScope>;
}

export function AftersalesHubPage({
  bookings = [],
}: {
  bookings?: BookingListEntry[];
}) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <AftersalesViewTracker page="aftersales" />
      <AftersalesHubHero />
      <BookingList bookings={bookings} />
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
  bookings = [],
}: {
  variant?: "service" | "audi";
  bookings?: BookingListEntry[];
}) {
  if (variant !== "audi") {
    return <ServicePageV2 bookings={bookings} />;
  }

  const copy: AftersalesPageCopy = audiServiceCopy;
  const faqs: AftersalesFaqItem[] = audiServiceFaqs;
  const path = routes.servicingAudi;
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
      <BookingList bookings={bookings} filter="service" />
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

            <section aria-labelledby="audi-servicing-heading">
              <h2 id="audi-servicing-heading" className="text-h3">
                {audiManufacturerCopy.title}
              </h2>
              <p className="mt-3 text-body text-muted">{audiManufacturerCopy.body}</p>
            </section>

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

export function MotPage({
  bookings = [],
}: {
  bookings?: BookingListEntry[];
}) {
  return <MotPageV2 bookings={bookings} />;
}

export function WarrantyPage() {
  return <WarrantyPageV2 />;
}

export function BookingEnquiryPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "Booking enquiry", href: routes.bookingEnquiry },
  ]);

  return (
    <PageShell breadcrumbs={breadcrumbs}>
      <PageBanner
        title="Request a callback"
        description="If we can't show appointments online, leave your details and Oakwood will call you back."
      />
      <Section>
        <Container width="narrow">
          <CallbackEnquiryForm />
          <div className="mt-12">
            <AftersalesRelatedLinks current={routes.bookingEnquiry} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
