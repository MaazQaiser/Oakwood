import Link from "next/link";
import { AftersalesFeatureHero } from "@/components/aftersales/AftersalesFeatureHero";
import { AftersalesRelatedLinks } from "@/components/aftersales/AftersalesRelatedLinks";
import { AftersalesViewTracker } from "@/components/aftersales/AftersalesViewTracker";
import { BookingList } from "@/components/aftersales/BookingList";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconChevron } from "@/components/ui/icons";
import { showroomProfiles } from "@/config/locations";
import { getBookingUrl, getFaqUrl, routes } from "@/config/routes";
import { MOT_V2, MOT_V2_FAQS } from "@/lib/aftersales/pages-v2";
import { cn } from "@/lib/cn";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { createBreadcrumbs } from "@/lib/seo";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import type { BookingListEntry } from "@/types/booking";

export function MotPageV2({
  bookings = [],
}: {
  bookings?: BookingListEntry[];
}) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "MOT", href: routes.mot },
  ]);

  return (
    <>
      <AftersalesViewTracker page="mot" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createFaqJsonLd(MOT_V2_FAQS)),
        }}
      />

      <AftersalesFeatureHero
        breadcrumbs={breadcrumbs}
        eyebrow={MOT_V2.eyebrow}
        title={MOT_V2.title}
        description="A DVSA-approved test, with clear results and straight answers if anything needs fixing."
        bullets={MOT_V2.bullets}
        primary={{
          href: getBookingUrl({ type: "mot", source: "mot" }),
          label: "Book an MOT",
        }}
        secondary={{
          href: MOT_V2.motHistoryUrl,
          label: "Check when yours is due",
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {MOT_V2.factCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[24px] border border-[#E7EEF4] bg-white p-6 text-[#002852] shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              {card.highlight ? (
                <p className="mt-3 text-xl font-semibold text-[#002852]">
                  {card.highlight}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-[#3d4f63]">{card.body}</p>
            </article>
          ))}
        </div>
      </AftersalesFeatureHero>

      <BookingList bookings={bookings} filter="mot" />

      <Section>
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">What&apos;s checked</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            What an MOT covers
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            The test checks the parts your car needs to be safe and legal on the road.
          </p>
          <div className="mt-6 max-w-3xl rounded-[20px] bg-[#ECF3F8] px-5 py-4 text-sm leading-relaxed text-[#002852]">
            {MOT_V2.coversNote}{" "}
            <Link
              href={routes.service}
              className="font-semibold text-[#0097DB] underline-offset-2 hover:underline"
            >
              See servicing →
            </Link>
          </div>
          <ul className="mt-6 list-none space-y-3 p-0">
            {MOT_V2.checks.map((item) => (
              <li
                key={item}
                className="rounded-[18px] border border-[#E7EEF4] bg-white px-5 py-4 text-sm font-semibold text-[#002852]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Your results</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            Understanding your MOT result
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {MOT_V2.results.map((result) => (
              <article
                key={result.label}
                className={cn(
                  "rounded-[22px] border border-[#E7EEF4] bg-white p-5",
                  result.tone === "fail" && "border-t-4 border-t-[#D64545]",
                  result.tone === "pass-warn" && "border-t-4 border-t-[#E2A93B]",
                  result.tone === "pass" && "border-t-4 border-t-[#3D9B5F]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex rounded-[10px] px-2.5 py-0.5 text-[0.8rem] font-semibold text-white",
                    result.tone === "fail" && "bg-[#D64545]",
                    result.tone === "pass-warn" && "bg-[#E2A93B]",
                    result.tone === "pass" && "bg-[#3D9B5F]",
                  )}
                >
                  {result.outcome}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#002852]">
                  {result.label}
                </h3>
                <p className="mt-2 text-sm text-muted">{result.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {MOT_V2.fines.map((fine) => (
              <article
                key={fine.title}
                className="rounded-[22px] bg-[#002852] p-6 text-white"
              >
                <p className="text-lg font-semibold">{fine.title}</p>
                <p className="mt-2 text-sm text-white/75">{fine.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-caption text-muted">{MOT_V2.finesSource}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Locations</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            Where to book your MOT
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {showroomProfiles.map((profile) => (
              <article
                key={profile.slug}
                className="rounded-[24px] border border-[#E7EEF4] bg-white p-6 shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                <h3 className="text-xl font-semibold text-[#002852]">{profile.h1}</h3>
                <p className="mt-3 text-sm text-muted">
                  {[profile.postcode, profile.region].filter(Boolean).join(", ")}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#002852]">
                  {profile.telephone}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Open Monday to Saturday, 09:00 to 18:00
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    href={getBookingUrl({
                      type: "mot",
                      source: "mot",
                      location: profile.slug,
                    })}
                    className="btn-compact w-auto"
                  >
                    Book at {profile.name}
                  </Button>
                  <Button
                    href={getDirectionsUrl(profile)}
                    variant="secondary"
                    className="btn-compact w-auto"
                  >
                    Get directions
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Top questions</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            Common questions
          </h2>
          <ul className="mt-8 list-none space-y-3 p-0">
            {MOT_V2_FAQS.map((item) => (
              <li key={item.question}>
                <details className="group rounded-[20px] border border-[#E7EEF4] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(16,40,72,0.04)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#002852] [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ECF3F8] text-[#002852] transition-transform group-open:rotate-180">
                      <IconChevron width={16} height={16} />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link
              href={getFaqUrl()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0097DB] no-underline hover:underline"
            >
              Browse all MOT questions
              <IconArrow width={14} height={14} />
            </Link>
          </p>
          <div className="mt-12">
            <AftersalesRelatedLinks current={routes.mot} />
          </div>
        </Container>
      </Section>
    </>
  );
}
