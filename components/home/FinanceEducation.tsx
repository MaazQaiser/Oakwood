import Link from "next/link";
import { HomeFinanceStrip } from "@/components/home/HomeFinanceStrip";
import { HomeRepresentativeExample } from "@/components/home/HomeRepresentativeExample";
import { OakwoodPhotoSlot } from "@/components/media/OakwoodPhotoSlot";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { getFinanceIntentUrl, routes } from "@/config/routes";
import {
  HOME_WARRANTY_AA_UPGRADE,
  HOME_WARRANTY_INCLUDED,
} from "@/lib/home/copy";
import { HOME_FINANCE_IMAGES } from "@/lib/home/photography";

const financePoints = [
  { label: "Deposit", href: routes.financeCalculator },
  { label: "Monthly payments", href: routes.finance },
  { label: "Final payment", href: getFinanceIntentUrl("pcp") },
];

export function FinanceEducation() {
  return (
    <Section id="finance" aria-label="Finance">
      <Container width="wide">
        <SectionIntro
          align="center"
          heading="Everything you need to know about car finance."
        >
          Understand your options before you make a decision.
        </SectionIntro>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <article className="flex flex-col gap-8 rounded-[28px] bg-page-tint p-7 sm:p-9 lg:min-h-[28rem] lg:justify-between lg:gap-0">
            <div className="max-w-md">
              <h3 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-primary sm:text-[2.35rem]">
                Flexible finance that starts with your budget.
              </h3>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-secondary">
                Check eligibility and see a personalised finance profile. Monthly figures before a full application are illustrations.
              </p>
              <p className="mt-4 text-[0.98rem] text-ink">No impact on your credit score.</p>
              <Link
                href={routes.eligibility}
                className="mt-6 inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white no-underline hover:bg-primary-hover sm:mt-8"
              >
                Check eligibility
              </Link>
            </div>
            <div className="grid shrink-0 grid-cols-3 gap-2 border-t border-ink/10 pt-5 text-center">
              {financePoints.map((point) => (
                <Link
                  key={point.label}
                  href={point.href}
                  className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary no-underline hover:underline sm:tracking-[0.12em]"
                >
                  {point.label}
                </Link>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="grid min-h-[16.5rem] overflow-hidden rounded-[28px] bg-white sm:grid-cols-2">
              <div className="relative min-h-52 max-h-64 sm:max-h-none">
                <OakwoodPhotoSlot
                  slot={HOME_FINANCE_IMAGES.warranty}
                  fill
                  sizes="(max-width: 1024px) 100vw, 22rem"
                />
              </div>
              <div className="relative flex min-w-0 flex-col justify-center bg-[#e7f3c4] px-6 pt-24 pb-6 sm:py-8 sm:pr-6 sm:pl-16">
                <span className="absolute top-5 left-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-center text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.04em] text-white tabular-nums sm:top-1/2 sm:left-0 sm:h-[4.6rem] sm:w-[4.6rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.15rem]">
                  6
                  <br />
                  month
                  <br />
                  warranty
                </span>
                <h3 className="text-xl font-semibold leading-snug text-ink">
                  {HOME_WARRANTY_INCLUDED}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3d4d34]">
                  {HOME_WARRANTY_AA_UPGRADE}
                </p>
                <Link href={routes.warranty} className="mt-4 text-sm font-semibold text-primary-secondary no-underline hover:underline">
                  Warranty details
                </Link>
              </div>
            </article>

            <Link
              href={routes.ourGarage}
              className="flex min-h-36 flex-col justify-center rounded-[28px] bg-page-tint p-7 no-underline"
            >
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-primary">Checked, verified, and prepared</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-secondary">
                History, condition, specification and the preparation recorded for that car are listed on the vehicle page.
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
          <div className="relative min-h-56 overflow-hidden rounded-[28px] sm:min-h-72 lg:min-h-[22rem]">
            <OakwoodPhotoSlot
              slot={HOME_FINANCE_IMAGES.customer}
              fill
              sizes="(max-width: 1024px) 100vw, 40rem"
            />
          </div>

          <article className="flex flex-col rounded-[28px] bg-page-tint p-7">
            <PiggyIcon />
            <h3 className="mt-5 text-xl font-semibold text-ink">Clear pricing</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Each car shows a cash price and an example monthly payment together, so you can compare before you enquire.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Check eligibility when you want those monthly figures to follow your finance profile.
            </p>
            <Link href={routes.usedCars} className="mt-auto pt-6 text-sm font-semibold text-primary-secondary no-underline hover:underline">
              Browse used cars
            </Link>
          </article>

          <article className="flex flex-col rounded-[28px] bg-page-tint p-7">
            <ExchangeIcon />
            <h3 className="mt-5 text-xl font-semibold text-ink">Part exchange</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Get a valuation you can put towards your deposit. The online figure is an estimate.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Oakwood confirms the offer with you before it becomes part of a deal.
            </p>
            <Link href={routes.partExchange} className="mt-auto pt-6 text-sm font-semibold text-primary-secondary no-underline hover:underline">
              Value my car
            </Link>
          </article>
        </div>

        <div className="mt-4">
          <HomeRepresentativeExample />
        </div>

        <HomeFinanceStrip variant="eligibility" className="mt-4" />
      </Container>
    </Section>
  );
}

function PiggyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-primary">
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 9v6M10.3 10.3c.3-.5.9-.8 1.7-.8 1 0 1.7.5 1.7 1.3 0 .8-.7 1.1-1.7 1.4-.9.3-1.7.6-1.7 1.4 0 .8.7 1.3 1.7 1.3.8 0 1.4-.3 1.7-.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExchangeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-primary">
      <path d="M7 8h10l-2.2-2.2M17 16H7l2.2 2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.8 8a6.2 6.2 0 0 1-9.4 7.2M7.2 16A6.2 6.2 0 0 1 16.6 8.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
