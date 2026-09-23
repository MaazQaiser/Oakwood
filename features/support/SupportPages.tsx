import type { ReactNode } from "react";
import Link from "next/link";
import { Container, Grid, Section } from "@/components/layout/Container";
import { PageBanner, PageBannerScope } from "@/components/layout/PageBanner";
import { LocationCard } from "@/components/locations/LocationCard";
import { ComplaintForm } from "@/features/support/components/ComplaintForm";
import { ContactForm } from "@/features/support/components/ContactForm";
import { ContactOptions } from "@/features/support/components/ContactOptions";
import { FAQAccordion } from "@/features/support/components/FAQAccordion";
import { SupportHub } from "@/features/support/components/SupportHub";
import { SupportStickyCta } from "@/features/support/components/SupportStickyCta";
import { SupportViewTracker } from "@/features/support/components/SupportViewTracker";
import { getShowroom, showroomProfiles } from "@/config/locations";
import {
  getEligibilityUrl,
  getFinanceCalculatorUrl,
  getFinanceIntentUrl,
  getLocationUrl,
  getUsedCarsUrl,
  routes,
} from "@/config/routes";
import { faqsForCategory, supportPathways } from "@/lib/support/content";
import {
  COMPLAINTS_HANDLE_BODY,
  COMPLAINTS_HANDLE_TITLE,
  COMPLAINTS_H1,
  COMPLAINTS_HOW_BODY,
  COMPLAINTS_HOW_TITLE,
  COMPLAINTS_INTRO,
  COMPLAINTS_NEXT_BODY,
  COMPLAINTS_NEXT_TITLE,
  COMPLAINTS_PROCEDURE_PENDING,
  CONTACT_HOURS_NOTICE,
  CONTACT_SECTION_TITLE,
  FAQ_H1,
  FAQ_INTRO,
  SUPPORT_HUB_EYEBROW,
  SUPPORT_HUB_H1,
  SUPPORT_HUB_INTRO,
} from "@/lib/support/copy";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { createBreadcrumbs } from "@/lib/seo";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { isEnquiryType } from "@/lib/support/validation";
import type { SupportEnquiryType, SupportVehicleContext } from "@/types/support";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function Related({
  heading,
  links,
}: {
  heading: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <Section className="pb-[calc(7rem+var(--oak-consent-offset,0px))] lg:pb-[var(--oak-section-y)]">
      <Container>
        <nav aria-label={heading}>
          <h2 className="text-h2">{heading}</h2>
          <ul className="mt-4 grid gap-1 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  );
}

function PageShell({
  breadcrumbs,
  children,
}: {
  breadcrumbs: ReturnType<typeof createBreadcrumbs>;
  children: ReactNode;
}) {
  return <PageBannerScope breadcrumbs={breadcrumbs}>{children}</PageBannerScope>;
}

const bury = getShowroom("bury");
const buryProfile = showroomProfiles.find((item) => item.slug === "bury");
const telephone = bury?.telephone;
const directionsHref = buryProfile
  ? getDirectionsUrl(buryProfile)
  : routes.locations;

export function SupportContactPage({
  vehicle,
  topic,
}: {
  vehicle?: SupportVehicleContext;
  topic?: string;
}) {
  const initialType: SupportEnquiryType | undefined = topic && isEnquiryType(topic)
    ? topic
    : undefined;

  return (
    <PageShell
      breadcrumbs={createBreadcrumbs([
        { label: "Home", href: routes.home },
        { label: "Contact", href: routes.contact },
      ])}
    >
      <SupportViewTracker page="contact" />
      <PageBanner
        eyebrow={SUPPORT_HUB_EYEBROW}
        title={SUPPORT_HUB_H1}
        description={SUPPORT_HUB_INTRO}
      />
      <SupportHub title="Choose a topic" pathways={supportPathways} />
      <div id="contact">
        <ContactOptions telephone={telephone} directionsHref={directionsHref} />
      </div>
      <Section>
        <Container>
          <h2 className="text-h2">Locations</h2>
          <p className="mt-3 max-w-2xl text-body-sm text-muted">{CONTACT_HOURS_NOTICE}</p>
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
        </Container>
      </Section>
      <Section>
        <Container>
          <h2 className="text-h2">{CONTACT_SECTION_TITLE}</h2>
          <div className="mt-6 max-w-xl scroll-mb-32">
            <ContactForm
              telephone={telephone}
              vehicle={vehicle}
              initialType={initialType}
            />
          </div>
        </Container>
      </Section>
      <Related
        heading="Related"
        links={[
          { href: routes.faq, label: "FAQs" },
          { href: routes.locations, label: "Locations" },
          { href: routes.aftersales, label: "Aftersales" },
          { href: routes.finance, label: "Car finance" },
          { href: getUsedCarsUrl(), label: "Used cars" },
          { href: routes.howItWorks, label: "Buying a car" },
          { href: routes.complaints, label: "Complaints" },
        ]}
      />
      <SupportStickyCta
        href="#contact-form"
        label={CONTACT_SECTION_TITLE}
        telephone={telephone}
      />
    </PageShell>
  );
}

export function SupportFaqPage() {
  const faqs = faqsForCategory();

  return (
    <PageShell
      breadcrumbs={createBreadcrumbs([
        { label: "Home", href: routes.home },
        { label: "FAQs", href: routes.faq },
      ])}
    >
      <JsonLd data={createFaqJsonLd(faqs)} />
      <SupportViewTracker page="faq" />
      <PageBanner eyebrow="Support" title={FAQ_H1} description={FAQ_INTRO} />
      <FAQAccordion items={faqs} />
      <Related
        heading="Related"
        links={[
          { href: routes.contact, label: "Contact Oakwood" },
          { href: routes.finance, label: "Car finance" },
          { href: getEligibilityUrl(), label: "Check my eligibility" },
          { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
          { href: getFinanceIntentUrl("hp"), label: "How HP works" },
          { href: getFinanceIntentUrl("pcp"), label: "How PCP works" },
          { href: getFinanceIntentUrl("bad-credit"), label: "Bad credit finance" },
          { href: getUsedCarsUrl(), label: "Used cars" },
          { href: routes.partExchange, label: "Part exchange" },
          { href: routes.aftersales, label: "Aftersales" },
        ]}
      />
      <SupportStickyCta href={routes.contact} label="Contact Oakwood" telephone={telephone} />
    </PageShell>
  );
}

export function SupportComplaintsPage({
  canonicalPath = routes.complaints,
}: {
  canonicalPath?: string;
}) {
  void canonicalPath;

  return (
    <PageShell
      breadcrumbs={createBreadcrumbs([
        { label: "Home", href: routes.home },
        { label: "Complaints", href: routes.complaints },
      ])}
    >
      <SupportViewTracker page="complaint" />
      <PageBanner eyebrow="Support" title={COMPLAINTS_H1} description={COMPLAINTS_INTRO} />
      <Section>
        <Container width="narrow">
          <h2 className="text-h2">{COMPLAINTS_HOW_TITLE}</h2>
          <p className="mt-3 text-body text-muted">{COMPLAINTS_HOW_BODY}</p>
          {telephone ? (
            <p className="mt-3 text-body text-muted">
              Call {telephone} if you would rather speak to someone.
            </p>
          ) : null}
        </Container>
      </Section>
      <Section>
        <Container width="narrow">
          <h2 className="text-h2">{COMPLAINTS_HANDLE_TITLE}</h2>
          <p className="mt-3 text-body text-muted">{COMPLAINTS_HANDLE_BODY}</p>
          <p className="mt-3 text-caption text-muted">{COMPLAINTS_PROCEDURE_PENDING}</p>
        </Container>
      </Section>
      <Section>
        <Container width="narrow">
          <h2 className="text-h2">{COMPLAINTS_NEXT_TITLE}</h2>
          <p className="mt-3 text-body text-muted">{COMPLAINTS_NEXT_BODY}</p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="max-w-xl scroll-mb-32">
            <ComplaintForm telephone={telephone} />
          </div>
        </Container>
      </Section>
      <Related
        heading="Related"
        links={[
          { href: routes.contact, label: "Contact Oakwood" },
          { href: routes.privacyPolicy, label: "Privacy policy" },
          { href: routes.statusDisclosure, label: "Status disclosure" },
          { href: routes.termsOfUse, label: "Terms of use" },
          { href: routes.distanceSelling, label: "Distance selling" },
        ]}
      />
      <SupportStickyCta
        href="#complaint-form"
        label="Submit a complaint"
        telephone={telephone}
      />
    </PageShell>
  );
}
