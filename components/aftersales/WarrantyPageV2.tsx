import Link from "next/link";
import { AftersalesFeatureHero } from "@/components/aftersales/AftersalesFeatureHero";
import { AftersalesRelatedLinks } from "@/components/aftersales/AftersalesRelatedLinks";
import { AftersalesViewTracker } from "@/components/aftersales/AftersalesViewTracker";
import { Container, Section } from "@/components/layout/Container";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { showroomProfiles } from "@/config/locations";
import { routes } from "@/config/routes";
import { WARRANTY_V2 } from "@/lib/aftersales/pages-v2";
import { cn } from "@/lib/cn";
import { createBreadcrumbs } from "@/lib/seo";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { warrantyFaqs } from "@/lib/aftersales/content";

const TIER_NAMES = ["Lite Plus", "Essential", "Plus"] as const;

export function WarrantyPageV2() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Aftersales", href: routes.aftersales },
    { label: "Warranty", href: routes.warranty },
  ]);

  return (
    <>
      <AftersalesViewTracker page="warranty" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createFaqJsonLd(warrantyFaqs)) }}
      />

      <AftersalesFeatureHero
        breadcrumbs={breadcrumbs}
        eyebrow={
          <span className="inline-flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-[0.65rem] font-bold tracking-wide">
              AA
            </span>
            {WARRANTY_V2.eyebrow}
          </span>
        }
        title={WARRANTY_V2.title}
        description={WARRANTY_V2.description}
        bullets={WARRANTY_V2.bullets}
        primary={{ href: routes.warrantyClaims, label: "Make a claim" }}
        secondary={{ href: "#compare-cover", label: "Compare cover" }}
        pill={WARRANTY_V2.includedPill}
        upgradeLine={WARRANTY_V2.upgradeLine}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {WARRANTY_V2.tiers.map((tier) => (
            <article
              key={tier.id}
              className="relative flex flex-col rounded-[24px] bg-white p-6 text-[#002852] shadow-[0_18px_40px_rgba(0,16,40,0.18)]"
            >
              {tier.badge ? (
                <span className="absolute -top-3 right-5 rounded-full bg-[#0097DB] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white">
                  {tier.badge}
                </span>
              ) : null}
              <CoverBars count={tier.bars} />
              <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em]">{tier.name}</h2>
              <ul className="mt-4 flex flex-1 list-none flex-col gap-2.5 p-0">
                {tier.bullets.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-snug text-[#3d4f63]">
                    <IconCheck className="mt-0.5 shrink-0 text-[#0097DB]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold text-[#002852]">{tier.bestFor}</p>
              <Link
                href="#compare-cover"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0097DB] no-underline hover:underline"
              >
                See what&apos;s covered
                <IconArrow width={16} height={16} />
              </Link>
            </article>
          ))}
        </div>
      </AftersalesFeatureHero>

      <Section id="compare-cover" className="scroll-mt-[calc(var(--oak-header-height)+1.5rem)]">
        <Container>
          <p className="oak-eyebrow">What&apos;s included</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852] sm:text-[2.15rem]">
            Compare cover
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            Side-by-side detail across Protect Lite Plus, Protect Essential and Protect Plus.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[24px] border border-[#E7EEF4] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
            <table className="min-w-[44rem] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#ECF3F8]">
                  <th className="sticky left-0 z-10 bg-[#ECF3F8] px-4 py-4 font-semibold text-[#002852] sm:px-5">
                    Cover
                  </th>
                  {TIER_NAMES.map((name) => (
                    <th
                      key={name}
                      className="px-4 py-4 text-center font-semibold text-[#002852] sm:px-5"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WARRANTY_V2.compareRows.map((row) => (
                  <tr key={row.label} className="border-t border-[#E7EEF4]">
                    <th className="sticky left-0 z-10 bg-white px-4 py-3.5 font-medium text-[#002852] sm:px-5">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${index}`}
                        className={cn(
                          "px-4 py-3.5 text-center text-[#3d4f63] sm:px-5",
                          row.highlight[index] &&
                            "bg-[#FFF6D6] font-semibold text-[#002852]",
                        )}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-caption text-muted">{WARRANTY_V2.compareFootnote}</p>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="oak-eyebrow">Making a claim</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            How a claim works
          </h2>
          <ol className="mt-8 grid list-none gap-4 p-0 md:grid-cols-3">
            {WARRANTY_V2.claimSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[24px] bg-white p-6 shadow-[0_10px_24px_rgba(16,40,72,0.06)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ECF3F8] text-sm font-bold text-[#002852]">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#002852]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="oak-eyebrow">Exclusions</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#002852]">
            What no warranty covers
          </h2>
          <ul className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2">
            {WARRANTY_V2.exclusions.map((item) => (
              <li
                key={item}
                className="rounded-[18px] border border-[#E7EEF4] bg-white px-5 py-4 text-sm font-medium text-[#002852]"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">{WARRANTY_V2.exclusionsNote}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="overflow-hidden rounded-[28px] bg-[#002852] px-6 py-10 text-white sm:px-10">
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] sm:text-[2rem]">
              {WARRANTY_V2.ctaTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-white/80">{WARRANTY_V2.ctaBody}</p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold">
              {showroomProfiles.map((profile) =>
                profile.telephone ? (
                  <a
                    key={profile.slug}
                    href={`tel:${profile.telephone.replace(/\s/g, "")}`}
                    className="text-white no-underline hover:underline"
                  >
                    {profile.name}: {profile.telephone}
                  </a>
                ) : null,
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={routes.usedCars}
                className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#002852] no-underline hover:bg-[#E7F1F8]"
              >
                Browse covered cars
              </Link>
              <Link
                href={routes.warrantyClaims}
                className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-white/35 px-5 text-sm font-semibold text-white no-underline hover:bg-white/10"
              >
                Make a claim
              </Link>
            </div>
          </div>
          <div className="mt-12">
            <AftersalesRelatedLinks current={routes.warranty} />
          </div>
        </Container>
      </Section>
    </>
  );
}

function CoverBars({ count }: { count: number }) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn(
            "h-2 w-8 rounded-full",
            n <= count ? "bg-[#0097DB]" : "bg-[#D7E6F2]",
          )}
        />
      ))}
    </div>
  );
}
