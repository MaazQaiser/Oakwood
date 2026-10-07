"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeFinanceStrip } from "@/components/home/HomeFinanceStrip";
import { HomeProofStrip } from "@/components/home/HomeProofStrip";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { HomeSearchCard } from "@/components/home/HomeSearchCard";
import { IconArrow } from "@/components/ui/icons";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getSearchUrl, routes } from "@/config/routes";
import { formatApr } from "@/lib/format/money";
import {
  HOME_HERO_DESCRIPTION,
  HOME_HERO_HEADING,
  HOME_HERO_PRIMARY,
  HOME_PART_EXCHANGE,
  HOME_PART_EXCHANGE_SUPPORT,
} from "@/lib/home/copy";

export function HomeHero() {
  const { mode, apr } = useCustomerFinance();
  const eligible = mode === "personalised";
  const ineligible = mode === "ineligible";

  const heading = eligible
    ? "Your finance profile is ready."
    : HOME_HERO_HEADING;
  const copy = eligible
    ? `Browse cars using your personalised finance profile. Current APR from ${formatApr(apr)}.`
    : ineligible
      ? "Some cars may sit outside your current finance profile. You can still browse stock, change your deposit, or speak to Oakwood."
      : HOME_HERO_DESCRIPTION;
  const primaryLabel = eligible ? "Browse my budget" : HOME_HERO_PRIMARY;
  const primaryHref = eligible ? getSearchUrl({ affordable: 1 }) : routes.search;

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
            <h1 className="text-[2.55rem] font-medium leading-[1.22em] tracking-[-0.03em] text-ink sm:text-[3.15rem] sm:leading-[1.12em] lg:text-[3.45rem] lg:leading-[1.1em]">
              {heading}
            </h1>
            <p className="mt-5 max-w-[22rem] text-[0.95rem] leading-relaxed text-[#8b95a3]">
              {copy}
            </p>
            <HomeSearchBar className="mt-6" />
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={primaryHref}
                className="group inline-flex min-h-14 items-center gap-3 rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-white no-underline hover:bg-[#001c3d]"
              >
                <span className="text-button">{primaryLabel}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
                  <IconArrow width={20} height={20} />
                </span>
              </Link>
              <div>
                <Link
                  href={routes.partExchange}
                  className="text-sm font-semibold text-primary-secondary underline-offset-2 no-underline hover:underline"
                >
                  {HOME_PART_EXCHANGE}
                </Link>
                <p className="mt-1 text-sm leading-snug text-secondary">
                  {HOME_PART_EXCHANGE_SUPPORT}
                </p>
              </div>
            </div>
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
      <div className="mx-3 flex flex-col gap-5 pb-8 pt-6 sm:mx-4 sm:gap-6 lg:mx-6 lg:gap-8 lg:pb-10 lg:pt-8">
        <HomeProofStrip />
        <HomeSearchCard />
        <HomeFinanceStrip />
      </div>
    </>
  );
}
