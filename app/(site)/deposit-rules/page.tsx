import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { reservationConfig } from "@/config/reservation";
import { routes } from "@/config/routes";
import { reservationCopy } from "@/lib/reservation/copy";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";

const amount = reservationAmountLabel(reservationConfig.amount);
const hold = formatHoldPeriod(reservationConfig.holdDurationDays);

export const metadata = createPageMetadata({
  title: "Deposit rules",
  path: routes.depositRules,
  description: `How the ${amount} Oakwood reservation works, including the hold period and refund rules.`,
});

const JOURNEY = [
  {
    title: `Pay ${amount}`,
    body: "Hold the car while you finish your purchase.",
  },
  {
    title: `Held for ${hold}`,
    body: "Nobody else can take it during that window.",
  },
  {
    title: "Buy or refund",
    body: "Applied to the price — or fully refundable if you change your mind.",
  },
] as const;

const RULES = [
  `Pay ${amount} to hold a car while you complete your purchase.`,
  `${reservationCopy.fullyRefundable}.`,
  reservationCopy.appliedToPurchase,
  `The vehicle is held for ${hold}.`,
] as const;

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Help and support", href: routes.help },
    { label: "Deposit rules", href: routes.depositRules },
  ]);

  return (
    <>
      <PageBanner
        title="Deposit rules"
        description={`How the ${amount} reservation works when you hold a car at Oakwood.`}
        breadcrumbs={breadcrumbs}
        width="narrow"
      >
        <div className="overflow-hidden rounded-[24px] bg-[#002852] text-white">
          <div className="relative px-6 py-7 sm:px-8 sm:py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#8EBFDF]/25 blur-2xl"
            />
            <p className="oak-eyebrow !text-[#8EBFDF]">Reservation deposit</p>
            <p className="mt-3 text-[3.25rem] font-medium leading-none tracking-[-0.05em] sm:text-[4rem]">
              {amount}
            </p>
            <p className="mt-3 max-w-sm text-body text-white/75">
              Fully refundable. Holds the car for {hold}. Applied to your purchase
              when you buy.
            </p>
          </div>
          <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              { label: "Hold period", value: hold },
              { label: "Refundable", value: "Yes" },
              { label: "Applied to purchase", value: "Yes" },
            ].map((item) => (
              <div key={item.label} className="bg-[#001c3d] px-5 py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-[#8EBFDF] uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-medium tracking-[-0.02em]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </PageBanner>

      <Section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_20%_0%,_rgba(142,191,223,0.22),_transparent_55%)]"
        />
        <Container width="narrow" className="relative">
          <div className="max-w-prose space-y-12">
            <section>
              <p className="oak-eyebrow">How it plays out</p>
              <h2 className="mt-3 text-h2">From hold to handover</h2>
              <ol className="mt-6 space-y-0">
                {JOURNEY.map((step, index) => (
                  <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < JOURNEY.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute top-10 bottom-0 left-[1.15rem] w-px bg-[#D7E6F2]"
                      />
                    ) : null}
                    <span className="relative z-[1] grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ECF3F8] text-sm font-semibold text-[#002852] ring-4 ring-page">
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-h3">{step.title}</h3>
                      <p className="mt-1.5 text-body text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-[24px] bg-[#F4F8FC] p-6 sm:p-7">
              <h2 className="text-h2">The {amount} reservation</h2>
              <ul className="mt-5 space-y-3">
                {RULES.map((rule) => (
                  <li key={rule} className="flex items-start gap-3 text-body text-ink">
                    <span className="mt-0.5 text-[#002852]">
                      <IconCheck width={18} height={18} />
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-h2">If you change your mind</h2>
              <p className="mt-3 text-body text-muted">{reservationCopy.requestRefund}</p>
              <p className="mt-3 text-body text-muted">{reservationCopy.refundSupporting}</p>
              <Link
                href={routes.requestRefund}
                className="mt-6 inline-flex min-h-14 items-center gap-3 rounded-[14px] bg-[#002852] py-1.5 pr-1.5 pl-5 text-white no-underline transition-[transform,background-color] duration-[var(--oak-motion-base)] hover:bg-[#001c3d] hover:translate-y-[-1px]"
              >
                <span className="text-button">Request a refund</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-white text-[#002852]">
                  <IconArrow width={20} height={20} />
                </span>
              </Link>
            </section>

            <nav aria-label="Related" className="border-t border-[#D7E6F2] pt-8">
              <h2 className="text-h2">Related</h2>
              <ul className="mt-4 divide-y divide-[#E7EEF4]">
                {[
                  { href: routes.reservationTerms, label: "Reservation terms" },
                  { href: `${routes.help}#reservations`, label: "Reservations help" },
                  { href: routes.usedCars, label: "Browse used cars" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-12 items-center justify-between gap-3 text-body-sm text-primary no-underline"
                    >
                      <span className="underline-offset-4 group-hover:underline">{link.label}</span>
                      <IconArrow
                        width={16}
                        height={16}
                        className="opacity-50 transition-transform duration-[var(--oak-motion-fast)] group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </Section>
    </>
  );
}
