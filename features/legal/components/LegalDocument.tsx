import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { IconArrow } from "@/components/ui/icons";
import { LegalMissingNotice } from "@/features/legal/components/LegalMissingNotice";
import { LegalViewTracker } from "@/features/legal/components/LegalViewTracker";
import { CookiePreferencesLink } from "@/features/legal/components/CookiePreferencesLink";
import { reservationConfig } from "@/config/reservation";
import { routes } from "@/config/routes";
import { getShowroom } from "@/config/locations";
import { toTelHref } from "@/lib/format/phone";
import {
  LEGAL_CONTACT_BODY,
  LEGAL_CONTACT_HEADING,
  LEGAL_LAST_UPDATED_UNAVAILABLE,
  LEGAL_RELATED_HEADING,
} from "@/lib/legal/copy";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { createBreadcrumbs } from "@/lib/seo";
import type { LegalDocument } from "@/types/legal";

const bury = getShowroom("bury");

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  const breadcrumbs = createBreadcrumbs(
    document.path === routes.legal
      ? [
          { label: "Home", href: routes.home },
          { label: "Legal", href: routes.legal },
        ]
      : [
          { label: "Home", href: routes.home },
          { label: "Legal", href: routes.legal },
          { label: document.title, href: document.path },
        ],
  );

  const isReservation = document.slug === "reservation";
  const amount = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod(reservationConfig.holdDurationDays);

  return (
    <>
      <LegalViewTracker slug={document.slug} />
      <PageBanner
        title={document.title}
        description={document.intro || undefined}
        breadcrumbs={breadcrumbs}
        width="narrow"
      >
        <p className="text-caption text-[#002852]">
          {document.lastUpdated
            ? `Last updated: ${document.lastUpdated}`
            : LEGAL_LAST_UPDATED_UNAVAILABLE}
        </p>
        {isReservation ? (
          <div className="mt-6 overflow-hidden rounded-[22px] bg-[#002852] text-white">
            <div className="grid gap-px bg-white/10 sm:grid-cols-4">
              {[
                { label: "Reservation", value: amount },
                { label: "Hold", value: hold },
                { label: "Refundable", value: "Fully" },
                { label: "Payments clear", value: "3–5 days" },
              ].map((item) => (
                <div key={item.label} className="bg-[#001c3d] px-4 py-4 sm:px-5">
                  <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-[#8EBFDF] uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-medium tracking-[-0.02em]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </PageBanner>
      <article>
        <Section className={isReservation ? "relative overflow-hidden" : undefined}>
          {isReservation ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_80%_0%,_rgba(142,191,223,0.22),_transparent_55%)]"
            />
          ) : null}
          <Container width="narrow" className="relative">
            <LegalMissingNotice items={document.missing} />
            {document.slug === "cookies" ? (
              <p className="mt-4">
                <CookiePreferencesLink />
              </p>
            ) : null}
            <div className="mt-8 max-w-prose space-y-10">
              {document.sections.map((section) => {
                const isHowItWorks = isReservation && section.id === "how-it-works";
                return (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-h2">{section.title}</h2>
                    {isHowItWorks ? (
                      <ol className="mt-5 space-y-0">
                        {section.paragraphs.map((paragraph, stepIndex) => (
                          <li
                            key={paragraph}
                            className="relative flex gap-4 pb-6 last:pb-0"
                          >
                            {stepIndex < section.paragraphs.length - 1 ? (
                              <span
                                aria-hidden
                                className="absolute top-10 bottom-0 left-[1.15rem] w-px bg-[#D7E6F2]"
                              />
                            ) : null}
                            <span className="relative z-[1] grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ECF3F8] text-sm font-semibold text-[#002852] ring-4 ring-page">
                              {stepIndex + 1}
                            </span>
                            <p className="pt-1.5 text-body text-muted">{paragraph}</p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="mt-3 text-body text-muted">
                          {paragraph}
                        </p>
                      ))
                    )}
                    {section.subsections?.map((subsection) => (
                      <div key={subsection.id} id={subsection.id} className="mt-6 scroll-mt-24">
                        <h3 className="text-h3">{subsection.title}</h3>
                        {subsection.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="mt-3 text-body text-muted">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ))}
                    {isReservation && section.id === "refund-request" ? (
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={routes.requestRefund}
                          className="inline-flex min-h-12 items-center gap-3 self-start rounded-[14px] bg-[#002852] py-1.5 pr-1.5 pl-5 text-white no-underline hover:bg-[#001c3d]"
                        >
                          <span className="text-button">Request a refund</span>
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white text-[#002852]">
                            <IconArrow width={16} height={16} />
                          </span>
                        </Link>
                        <Link
                          href={routes.depositRules}
                          className="inline-flex min-h-12 items-center self-start rounded-[14px] bg-[#ECF3F8] px-5 text-button text-[#002852] no-underline hover:bg-[#E7F1F8]"
                        >
                          Deposit rules
                        </Link>
                      </div>
                    ) : null}
                  </section>
                );
              })}
            </div>
            <section className="mt-12 max-w-prose">
              <h2 className="text-h2">{LEGAL_CONTACT_HEADING}</h2>
              <p className="mt-3 text-body text-muted">{LEGAL_CONTACT_BODY}</p>
              <p className="mt-3">
                <Link
                  href={routes.contact}
                  className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Contact Oakwood
                </Link>
                {bury?.telephone ? (
                  <>
                    {" · "}
                    <a
                      href={toTelHref(bury.telephone)}
                      className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {bury.telephone}
                    </a>
                  </>
                ) : null}
              </p>
            </section>
            {document.related.length > 0 ? (
              <nav
                aria-label={LEGAL_RELATED_HEADING}
                className={
                  isReservation
                    ? "mt-12 border-t border-[#D7E6F2] pt-8"
                    : "mt-12"
                }
              >
                <h2 className="text-h2">{LEGAL_RELATED_HEADING}</h2>
                <ul className={isReservation ? "mt-4 divide-y divide-[#E7EEF4]" : "mt-4"}>
                  {document.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={
                          isReservation
                            ? "group flex min-h-12 items-center justify-between gap-3 text-body-sm text-primary no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            : "inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        }
                      >
                        <span className={isReservation ? "underline-offset-4 group-hover:underline" : undefined}>
                          {link.label}
                        </span>
                        {isReservation ? (
                          <IconArrow
                            width={16}
                            height={16}
                            className="opacity-50 transition-transform duration-[var(--oak-motion-fast)] group-hover:translate-x-0.5"
                          />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </Container>
        </Section>
      </article>
    </>
  );
}
