"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeFilterSearchCard } from "@/components/home/HomeFilterSearchCard";
import { HomeFinanceStrip } from "@/components/home/HomeFinanceStrip";
import { HomeProofStrip } from "@/components/home/HomeProofStrip";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { HomeSearchCard } from "@/components/home/HomeSearchCard";
import { HeroVariantToggle } from "@/components/home/HeroVariantToggle";
import { useHomeHeroVariant } from "@/components/home/useHomeHeroVariant";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  HOME_HERO_DESCRIPTION,
  HOME_HERO_HEADING,
  HOME_PART_EXCHANGE,
  HOME_PART_EXCHANGE_SUPPORT,
} from "@/lib/home/copy";

export function HomeHero() {
  const { variant, changeVariant } = useHomeHeroVariant();

  return (
    <>
      {variant === "filters" ? <FilterHero /> : <CurrentHero />}
      <div className="mx-[var(--oak-page-x)] flex flex-col gap-5 pb-8 pt-6 sm:gap-6 lg:gap-8 lg:pb-10 lg:pt-8">
        <HeroVariantToggle variant={variant} onChange={changeVariant} />
        <HomeProofStrip />
        {variant === "current" ? (
          <div className="-mx-[var(--oak-page-x)] bg-[#ECF3F8] px-10 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
            <HomeSearchCard />
          </div>
        ) : null}
        <HomeFinanceStrip />
      </div>
    </>
  );
}

function CurrentHero() {
  return (
    <section className="relative -mt-[calc(var(--oak-header-height)-0.75rem)] flex flex-col overflow-hidden bg-[#ECF3F8] px-6 pt-[calc(var(--oak-header-height)+1.5rem)] lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-[var(--oak-page-x)] lg:min-h-[calc(100dvh-9rem)] lg:rounded-[32px] lg:pb-10">
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
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--oak-width-wide)] flex-col pb-8 lg:flex-1 lg:justify-center lg:pb-0 [@media(max-height:560px)]:max-lg:ml-0 [@media(max-height:560px)]:max-lg:mr-auto [@media(max-height:560px)]:max-lg:w-[54%] [@media(max-height:560px)]:max-lg:max-w-[54%] [@media(max-height:560px)]:max-lg:pb-6">
        <div className="flex w-full max-w-xl flex-col">
          <div className="max-w-md">
            <h1 className="text-[2.55rem] font-medium leading-[1.22em] tracking-[-0.03em] text-navy sm:text-[3.15rem] sm:leading-[1.12em] lg:text-[3.45rem] lg:leading-[1.1em]">
              {HOME_HERO_HEADING}
            </h1>
            <p className="mt-5 max-w-[22rem] text-[0.95rem] leading-relaxed text-muted">
              {HOME_HERO_DESCRIPTION}
            </p>
          </div>
          <HeroCompactPhoto className="-mx-6 mt-3 lg:hidden" />
          <HomeSearchBar className="relative z-20 w-full max-lg:-mt-14 lg:mt-5" />
          <div className="relative z-10 mt-8">
            <Link
              href={routes.partExchange}
              className="text-base font-semibold text-navy underline-offset-2 no-underline hover:underline"
            >
              {HOME_PART_EXCHANGE}
            </Link>
            <p className="mt-1.5 text-[0.95rem] font-medium leading-snug text-primary">
              {HOME_PART_EXCHANGE_SUPPORT}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterHero() {
  return (
    <section className="relative -mt-[calc(var(--oak-header-height)-0.75rem)] flex flex-col overflow-hidden bg-[#ECF3F8] px-5 pt-[calc(var(--oak-header-height)+1.5rem)] sm:px-6 lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-[var(--oak-page-x)] lg:min-h-[calc(100dvh-9rem)] lg:rounded-[32px] lg:px-8 lg:pb-10">
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
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--oak-width-wide)] flex-col py-4 lg:flex-1 lg:justify-center [@media(max-height:560px)]:max-lg:ml-0 [@media(max-height:560px)]:max-lg:mr-auto [@media(max-height:560px)]:max-lg:w-[54%] [@media(max-height:560px)]:max-lg:max-w-[54%] [@media(max-height:560px)]:max-lg:pb-6">
        <HeroCompactPhoto className="-mx-5 mt-2 lg:hidden" />
        <HomeFilterSearchCard className="mt-4 lg:mt-0" />
      </div>
    </section>
  );
}

function HeroCompactPhoto({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-48 shrink-0 overflow-hidden sm:h-56",
        className,
      )}
    >
      <Image
        src="/images/hero/open-sky-mobile.png"
        alt="A smiling customer giving a thumbs up beside a car under an open sky"
        fill
        priority
        quality={92}
        sizes="100vw"
        className="object-cover object-[center_22%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ECF3F8_0%,rgba(236,243,248,0.85)_12%,rgba(236,243,248,0)_38%,rgba(236,243,248,0)_55%,rgba(236,243,248,0.35)_78%,rgba(236,243,248,0)_100%)]"
        aria-hidden
      />
    </div>
  );
}
