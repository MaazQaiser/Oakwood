import Image from "next/image";
import Link from "next/link";
import { AftersalesFeatureHero } from "@/components/aftersales/AftersalesFeatureHero";
import { AftersalesRelatedLinks } from "@/components/aftersales/AftersalesRelatedLinks";
import { AftersalesViewTracker } from "@/components/aftersales/AftersalesViewTracker";
import { BookingList } from "@/components/aftersales/BookingList";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconChevron } from "@/components/ui/icons";
import { getBookingUrl, getFaqUrl, routes } from "@/config/routes";
import { showroomProfiles } from "@/config/locations";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { SERVICE_V2, SERVICE_V2_FAQS } from "@/lib/aftersales/pages-v2";
import { createBreadcrumbs } from "@/lib/seo";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import type { BookingListEntry } from "@/types/booking";

function BrandLogo({ src }: { src: string }) {
  if (src.endsWith(".svg")) {
    return (
      // SVG brand marks are static public assets; skip the image optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" width={80} height={40} className="object-contain" />
    );
  }
  return (
    <Image src={src} alt="" width={80} height={40} className="object-contain" />
  );
}

export function ServicePageV2({
  bookings = [],
}: {
  bookings?: BookingListEntry[];
}) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "Car servicing", href: routes.service },
  ]);

  return (
    <>
      <AftersalesViewTracker page="service" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createFaqJsonLd(SERVICE_V2_FAQS)),
        }}
      />

      <AftersalesFeatureHero
        breadcrumbs={breadcrumbs}
        eyebrow={
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#0097DB] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white">
              {SERVICE_V2.usp}
            </span>
            <span>{SERVICE_V2.eyebrow}</span>
          </span>
        }
        title={SERVICE_V2.title}
        description={SERVICE_V2.description}
        bullets={SERVICE_V2.bullets}
        primary={{
          href: getBookingUrl({ type: "service", source: "service" }),
          label: "Book a service",
        }}
        secondary={{ href: routes.mot, label: "Need an MOT?" }}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_V2.serviceCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex flex-col rounded-[22px] bg-white p-5 text-[#002852] no-underline shadow-[0_14px_34px_rgba(0,16,40,0.16)] transition-transform duration-[var(--oak-motion-fast)] hover:-translate-y-0.5"
            >
              <h2 className="text-lg font-semibold tracking-[-0.02em]">{card.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3d4f63]">
                {card.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0097DB]">
                Book
                <IconArrow width={14} height={14} />
              </span>
            </Link>
          ))}
        </div>
      </AftersalesFeatureHero>

      <BookingList bookings={bookings} filter="service" />

      <Section className="bg-[#002852]! text-white">
        <Container>
          <p className="oak-eyebrow text-white/65">Volkswagen Group</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] sm:text-[2.15rem]">
            Volkswagen Group specialists
          </h2>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-white/80">
            {SERVICE_V2.vagIntro}
          </p>
          <p className="mt-4 max-w-2xl rounded-[18px] bg-white/10 px-5 py-4 text-sm leading-relaxed text-white/90 ring-1 ring-white/15">
            {SERVICE_V2.vagCallout}
          </p>
          <ul className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_V2.vagBrands.map((brand) => (
              <li
                key={brand.name}
                className="flex items-center gap-4 rounded-[18px] bg-white/8 px-4 py-4 ring-1 ring-white/12"
              >
                <span className="relative grid h-12 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-white px-1">
                  <BrandLogo src={brand.logo} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{brand.name}</span>
                  {brand.tag ? (
                    <span className="mt-1 inline-flex rounded-full bg-[#0097DB]/30 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.06em]">
                      {brand.tag}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 rounded-[24px] bg-white/10 p-6 ring-1 ring-white/15 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">Not a Volkswagen Group car?</p>
              <p className="mt-1 text-sm text-white/75">
                We MOT, service and repair all makes and models.
              </p>
            </div>
            <Button
              href={getBookingUrl({ type: "service", source: "service" })}
              className="btn-compact w-auto self-start bg-white text-[#002852] hover:bg-[#E7F1F8]"
            >
              Book your car in
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="oak-eyebrow">German brand specialists</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            German brand expertise
          </h2>
          <p className="mt-4 max-w-3xl text-body text-muted">
            {SERVICE_V2.germanIntro}{" "}
            <Link
              href={routes.servicingAudi}
              className="font-semibold text-[#0097DB] underline-offset-2 hover:underline"
            >
              Audi manufacturer servicing
            </Link>
            .
          </p>
          <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_V2.germanBrands.map((brand) => (
              <li
                key={brand.name}
                className="flex flex-col items-start rounded-[22px] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                <span className="relative grid h-14 w-24 place-items-center overflow-hidden rounded-xl bg-[#F7FAFC] px-1">
                  <BrandLogo src={brand.logo} />
                </span>
                <span className="mt-4 text-base font-semibold text-[#002852]">
                  {brand.name}
                </span>
                {brand.vag ? (
                  <span className="mt-2 rounded-full bg-[#ECF3F8] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[#0061A2]">
                    VAG
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="oak-eyebrow">Locations</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            Our workshops
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {showroomProfiles.map((profile) => (
              <article
                key={profile.slug}
                className="rounded-[24px] border border-[#E7EEF4] bg-white p-6 shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                {profile.slug === "bury" ? (
                  <span className="inline-flex rounded-full bg-[#ECF3F8] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#0061A2]">
                    VAG specialist workshop
                  </span>
                ) : null}
                <h3 className="mt-3 text-xl font-semibold text-[#002852]">
                  {profile.h1}
                </h3>
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
                      type: "service",
                      source: "service",
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
          <p className="oak-eyebrow">Top questions</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            Common questions
          </h2>
          <ul className="mt-8 list-none space-y-3 p-0">
            {SERVICE_V2_FAQS.map((item) => (
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
              Browse all servicing questions
              <IconArrow width={14} height={14} />
            </Link>
          </p>
          <div className="mt-12">
            <AftersalesRelatedLinks current={routes.service} />
          </div>
        </Container>
      </Section>
    </>
  );
}
