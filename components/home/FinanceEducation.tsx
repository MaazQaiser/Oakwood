import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { getFinanceIntentUrl, routes } from "@/config/routes";
import { stockImages } from "@/lib/media/stock";

const financePoints = [
  { label: "Deposit", href: routes.financeCalculator },
  { label: "Monthly payments", href: routes.finance },
  { label: "Final payment", href: getFinanceIntentUrl("pcp") },
];

export function FinanceEducation() {
  return (
    <Section>
      <Container width="wide">
        <SectionIntro
          align="center"
          eyebrow="Finance made simple"
          heading="Everything you need to know about car finance."
        >
          Understand your options before you make a decision.
        </SectionIntro>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <article className="flex min-h-[28rem] flex-col rounded-[28px] bg-[#d4e4ff] p-7 sm:p-9">
            <div className="max-w-md">
              <h3 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-[#14325c] sm:text-[2.35rem]">
                Flexible finance that starts with your budget.
              </h3>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-[#4d5d73]">
                Check eligibility and see a personalised finance profile. Monthly figures before a full application are illustrations.
              </p>
              <p className="mt-4 text-[0.98rem] text-[#14325c]">No impact on your credit score.</p>
              <Link
                href={routes.eligibility}
                className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#002852] px-5 text-sm font-semibold text-white no-underline hover:bg-[#001c3d]"
              >
                Check eligibility
              </Link>
            </div>
            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#14325c]/10 pt-5 text-center">
              {financePoints.map((point) => (
                <Link
                  key={point.label}
                  href={point.href}
                  className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#14325c] no-underline hover:underline sm:tracking-[0.12em]"
                >
                  {point.label}
                </Link>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="grid min-h-[16.5rem] overflow-hidden rounded-[28px] bg-white sm:grid-cols-2">
              <div className="relative min-h-52">
                <Image
                  src={stockImages.suv02}
                  alt="A white SUV parked on open ground"
                  fill
                  sizes="(max-width: 1024px) 100vw, 22rem"
                  className="object-cover object-[center_60%]"
                />
              </div>
              <div className="relative flex flex-col justify-center bg-[#e7f3c4] px-6 pt-24 pb-6 sm:py-8 sm:pr-6 sm:pl-16">
                <span className="absolute top-5 left-6 grid h-16 w-16 place-items-center rounded-2xl bg-[#002852] text-center text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.04em] text-white sm:top-1/2 sm:left-0 sm:h-[4.6rem] sm:w-[4.6rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.15rem]">
                  12
                  <br />
                  month
                  <br />
                  warranty
                </span>
                <h3 className="text-xl font-semibold text-[#14325c]">12-month warranty</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3d4d34]">
                  Available cars include a 12-month warranty for listed mechanical and electrical items.
                </p>
                <Link href={routes.warranty} className="mt-4 text-sm font-semibold text-[#14325c] no-underline hover:underline">
                  Warranty details
                </Link>
              </div>
            </article>

            <Link
              href={routes.ourGarage}
              className="flex min-h-36 flex-col justify-center rounded-[28px] bg-[#f3f5f8] p-7 no-underline"
            >
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#14325c]">Checked, verified, and prepared</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5c6b7a]">
                History, condition, specification and the preparation recorded for that car are listed on the vehicle page.
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
          <div className="relative min-h-72 overflow-hidden rounded-[28px] lg:min-h-[22rem]">
            <Image
              src="/images/hero/open-sky.png"
              alt="A smiling customer beside a car under an open sky"
              fill
              sizes="(max-width: 1024px) 100vw, 40rem"
              className="object-cover object-[30%_center]"
            />
          </div>

          <article className="flex flex-col rounded-[28px] bg-[#f3f5f8] p-7">
            <PiggyIcon />
            <h3 className="mt-5 text-xl font-semibold text-[#14325c]">Clear pricing</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6b7a]">
              Each car shows a cash price and an example monthly payment together, so you can compare before you enquire.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6b7a]">
              Check eligibility when you want those monthly figures to follow your finance profile.
            </p>
            <Link href={routes.usedCars} className="mt-auto pt-6 text-sm font-semibold text-[#14325c] no-underline hover:underline">
              Browse used cars
            </Link>
          </article>

          <article className="flex flex-col rounded-[28px] bg-[#d4e4ff] p-7">
            <ExchangeIcon />
            <h3 className="mt-5 text-xl font-semibold text-[#14325c]">Part exchange</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4d5d73]">
              Get a valuation you can put towards your deposit. The online figure is an estimate.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#4d5d73]">
              Oakwood confirms the offer with you before it becomes part of a deal.
            </p>
            <Link href={routes.partExchange} className="mt-auto pt-6 text-sm font-semibold text-[#14325c] no-underline hover:underline">
              Value my car
            </Link>
          </article>
        </div>
      </Container>
    </Section>
  );
}

function PiggyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-[#002852]">
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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-[#002852]">
      <path d="M7 8h10l-2.2-2.2M17 16H7l2.2 2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.8 8a6.2 6.2 0 0 1-9.4 7.2M7.2 16A6.2 6.2 0 0 1 16.6 8.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
