import Image from "next/image";
import Link from "next/link";
import { AftersalesFeatureHero } from "@/components/aftersales/AftersalesFeatureHero";
import { AftersalesRelatedLinks } from "@/components/aftersales/AftersalesRelatedLinks";
import { AftersalesViewTracker } from "@/components/aftersales/AftersalesViewTracker";
import { BookingList } from "@/components/aftersales/BookingList";
import { Container, Section } from "@/components/layout/Container";
import { LocationMap } from "@/components/locations/LocationMap";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconChevron } from "@/components/ui/icons";
import { getBookingUrl, getFaqUrl, routes } from "@/config/routes";
import { showroomProfiles } from "@/config/locations";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { SERVICE_V2, SERVICE_V2_FAQS } from "@/lib/aftersales/pages-v2";
import { createBreadcrumbs } from "@/lib/seo";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import type { BookingListEntry } from "@/types/booking";

function BrandLogo({ src, name }: { src: string; name: string }) {
  // Original brand colours on transparent marks — no tint filter.
  const wrap = "relative block h-16 w-16 shrink-0 sm:h-20 sm:w-20";
  const imgClass = "object-contain";

  if (src.endsWith(".svg")) {
    return (
      <span className={wrap}>
        {/* SVG brand marks are static public assets; skip the image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className={`h-full w-full ${imgClass}`} />
      </span>
    );
  }

  return (
    <span className={wrap}>
      <Image src={src} alt={`${name} logo`} fill sizes="80px" className={imgClass} />
    </span>
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
            <span className="rounded-[14px] bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-[#002852] shadow-[0_6px_16px_rgba(16,40,72,0.08)]">
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
              className="flex flex-col rounded-[22px] border border-[#E7EEF4] bg-white p-5 text-[#002852] no-underline shadow-[0_10px_24px_rgba(16,40,72,0.06)] transition-transform duration-[var(--oak-motion-fast)] hover:-translate-y-0.5"
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

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Volkswagen Group</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852] sm:text-[2.15rem]">
            Volkswagen Group specialists
          </h2>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-muted">
            {SERVICE_V2.vagIntro}
          </p>
          <ul className="mt-8 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-4 lg:grid-cols-7">
            {SERVICE_V2.vagBrands.map((brand) => (
              <li
                key={brand.name}
                className="flex items-center justify-center rounded-[18px] border border-[#E7EEF4] bg-white px-3 py-6"
                aria-label={brand.name}
              >
                <BrandLogo src={brand.logo} name={brand.name} />
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 rounded-[24px] bg-[#ECF3F8] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[#002852]">Not a Volkswagen Group car?</p>
              <p className="mt-1 text-sm text-muted">
                We MOT, service and repair all makes and models.
              </p>
            </div>
            <Button
              href={getBookingUrl({ type: "service", source: "service" })}
              className="btn-compact w-auto self-start"
            >
              Book your car in
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">German brand specialists</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            German brand expertise
          </h2>
          <p className="mt-4 max-w-3xl text-body text-muted">
            {SERVICE_V2.germanIntro} We also offer{" "}
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
                className="flex flex-col items-start rounded-[22px] border border-[#E7EEF4] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                <BrandLogo src={brand.logo} name={brand.name} />
                <span className="mt-4 text-base font-semibold text-[#002852]">
                  {brand.name}
                </span>
                {brand.vag ? (
                  <span className="mt-2 rounded-[10px] bg-[#ECF3F8] px-2.5 py-0.5 text-[0.75rem] font-semibold text-[#0061A2]">
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
          <p className="text-sm font-semibold text-primary-secondary">Locations</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            Our workshops
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {showroomProfiles.map((profile) => (
              <article
                key={profile.slug}
                className="overflow-hidden rounded-[24px] border border-[#E7EEF4] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                <LocationMap profile={profile} />
                <div className="p-6">
                  {profile.slug === "bury" ? (
                    <span className="inline-flex rounded-[10px] bg-[#ECF3F8] px-3 py-1 text-[0.8rem] font-semibold text-[#0061A2]">
                      VAG specialist workshop
                    </span>
                  ) : null}
                  <h3
                    className={`text-xl font-semibold text-[#002852] ${profile.slug === "bury" ? "mt-3" : ""}`}
                  >
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
