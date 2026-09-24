"use client";

import Image from "next/image";
import Link from "next/link";
import { FinanceEligibilityCard } from "@/components/home/FinanceEligibilityCard";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { IconArrow } from "@/components/ui/icons";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getSearchUrl, routes } from "@/config/routes";
import { formatApr } from "@/lib/format/money";

export function HomeHero() {
  const { mode, apr } = useCustomerFinance();
  const eligible = mode === "personalised";
  const ineligible = mode === "ineligible";

  const heading = eligible
    ? "Your finance profile is ready."
    : "Find a car that fits your budget.";
  const copy = eligible
    ? `Browse cars using your personalised finance profile. Current APR from ${formatApr(apr)}.`
    : ineligible
      ? "Some cars may sit outside your current finance profile. You can still browse stock, change your deposit, or speak to Oakwood."
      : "Check eligibility in under 60 seconds, then shop cars with a cash price and an example monthly payment.";
  const primaryLabel = eligible ? "Browse my budget" : "Find a car";
  const primaryHref = eligible ? getSearchUrl({ affordable: 1 }) : routes.usedCars;

  return (
    <>
    <section className="relative -mt-[calc(var(--oak-header-height)-0.75rem)] mx-3 flex min-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-[32px] bg-[#ECF3F8] px-6 pb-8 pt-[calc(var(--oak-header-height)+1.5rem)] sm:mx-4 lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-6 lg:min-h-[calc(100dvh-9rem)] lg:pb-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[78%] lg:block">
        <Image
          src="/images/hero/open-sky.png"
          alt="A smiling customer giving a thumbs up beside a car under an open sky"
          fill
          priority
          quality={92}
          sizes="78vw"
          className="object-cover object-[34%_center] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.2)_14%,#000_34%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.2)_14%,#000_34%)]"
        />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--oak-width-wide)] flex-1 flex-col justify-center">
        <div className="max-w-md">
            <h1 className="text-[2.55rem] font-medium leading-[0.98] tracking-[-0.03em] text-ink sm:text-[3.15rem] lg:text-[3.45rem]">
              {heading}
            </h1>
            <p className="mt-5 max-w-[17.5rem] text-[0.95rem] leading-relaxed text-[#8b95a3]">{copy}</p>
            <HomeSearchBar className="mt-6" />
            <Link
              href={primaryHref}
              className="group mt-8 inline-flex min-h-14 items-center gap-3 rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-white no-underline hover:bg-[#001c3d]"
            >
              <span className="text-button">{primaryLabel}</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
                <IconArrow width={20} height={20} />
              </span>
            </Link>
        </div>
      </div>
      <div className="relative -mx-6 -mb-8 mt-8 aspect-[4/3] lg:hidden">
        <Image
          src="/images/hero/open-sky-mobile.png"
          alt="A smiling customer giving a thumbs up beside a car under an open sky"
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-center [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_12%,#000_28%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_12%,#000_28%)]"
        />
      </div>
    </section>
    <div className="mx-3 pb-8 pt-6 sm:mx-4 lg:mx-6 lg:pb-10 lg:pt-8">
      <FinanceEligibilityCard />
    </div>
    </>
  );
}
