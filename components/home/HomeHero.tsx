"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeFinanceStrip } from "@/components/home/HomeFinanceStrip";
import { HomeProofStrip } from "@/components/home/HomeProofStrip";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  HOME_HERO_DESCRIPTION,
  HOME_HERO_HEADING,
  HOME_PART_EXCHANGE,
  HOME_PART_EXCHANGE_SUPPORT,
} from "@/lib/home/copy";

export function HomeHero() {
  return (
    <>
      <CurrentHero />
      <Container className="flex flex-col gap-5 pb-8 pt-6 sm:gap-6 lg:gap-8 lg:pb-10 lg:pt-8">
        <HomeProofStrip />
        {/* One finance claims line + eligibility CTA; footer CTA is the second. */}
        <HomeFinanceStrip showEligibilityCta />
      </Container>
    </>
  );
}

function CurrentHero() {
  return (
    <section
      className={cn(
        "relative -mt-[calc(var(--oak-header-height)-0.75rem)] flex flex-col overflow-hidden bg-[#ECF3F8]",
        "px-[var(--oak-page-x)] pt-[calc(var(--oak-header-height)+1.5rem)] pb-10",
        "md:-mt-[calc(var(--oak-header-height)-1rem)] md:min-h-[calc(100dvh-6rem)] md:px-0 md:pb-12",
        "lg:min-h-[calc(100dvh-4rem)] lg:pb-14",
      )}
    >
      {/* Desktop / tablet photo plane */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[72%] md:block lg:w-[78%]">
        <Image
          src="/images/hero/open-sky.png"
          alt="A smiling customer giving a thumbs up beside a car under an open sky"
          fill
          priority
          quality={92}
          sizes="(min-width: 1024px) 78vw, 72vw"
          className="object-cover object-[34%_center] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.2)_14%,#000_34%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.2)_14%,#000_34%)]"
        />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[var(--oak-width-wide)] flex-col",
          "md:flex-1 md:justify-center md:px-[var(--oak-page-x)]",
          "md:pt-10 md:pb-10 lg:pt-14 lg:pb-14",
        )}
      >
        <div className="flex w-full max-w-xl flex-col md:max-w-[26rem] lg:max-w-[30.6rem]">
          <h1
            className={cn(
              "text-[2.55rem] font-medium leading-[1.22em] tracking-[-0.03em] text-navy",
              "sm:text-[3.15rem] sm:leading-[1.12em]",
              "md:text-[2.85rem] md:leading-[1.12em]",
              "lg:text-[3.45rem] lg:leading-[1.1em]",
            )}
          >
            {HOME_HERO_HEADING}
          </h1>

          {/* Desktop/tablet: subheading directly under title */}
          <p className="mt-5 hidden max-w-[22rem] text-[0.95rem] leading-relaxed text-muted md:block">
            {HOME_HERO_DESCRIPTION}
          </p>

          {/* Mobile: photo with search floating over it.
              Desktop/tablet: search only (side photo is absolute). */}
          <div className="relative mt-4 md:mt-5 lg:mt-6">
            <HeroCompactPhoto className="md:hidden" />
            <HomeSearchBar
              className="relative z-20 max-md:-mt-14 md:mt-0"
              compact
            />
          </div>

          {/* Mobile: subheading after the floating box */}
          <p className="mt-5 max-w-[22rem] text-[0.95rem] leading-relaxed text-muted md:hidden">
            {HOME_HERO_DESCRIPTION}
          </p>

          <div className="relative z-10 mt-6 md:mt-8">
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

function HeroCompactPhoto({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-52 shrink-0 overflow-hidden rounded-[20px] sm:h-60",
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
        className="object-cover object-[center_32%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ECF3F8_0%,rgba(236,243,248,0.42)_12%,rgba(236,243,248,0)_36%,rgba(236,243,248,0)_55%,rgba(236,243,248,0.55)_82%,#ECF3F8_100%)]"
        aria-hidden
      />
    </div>
  );
}
