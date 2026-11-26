"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { HomeFinanceStrip } from "@/components/home/HomeFinanceStrip";
import { HomeHeroOffers } from "@/components/home/HomeHeroOffers";
import { HomeProofStrip } from "@/components/home/HomeProofStrip";
import {
  HomeQuickSearch,
  HomeSearchBar,
  type QuickFilters,
} from "@/components/home/HomeSearchBar";
import { cn } from "@/lib/cn";
import { HOME_HERO_DESCRIPTION, HOME_HERO_HEADING } from "@/lib/home/copy";

export function HomeHero() {
  const [quick, setQuick] = useState<QuickFilters>({
    bodyStyle: "",
    fuel: "",
    transmission: "",
  });

  return (
    <>
      <CurrentHero quick={quick} />
      <Container className="flex flex-col gap-5 pb-8 pt-6 sm:gap-6 lg:gap-8 lg:pb-10 lg:pt-8">
        <HomeQuickSearch value={quick} onChange={setQuick} />
        <HomeHeroOffers />
        <HomeProofStrip />
        {/* One finance claims line + eligibility CTA; footer CTA is the second. */}
        {/* Rate CTA lives at the foot of the homepage only — not in the hero. */}
        <HomeFinanceStrip showEligibilityCta={false} />
      </Container>
    </>
  );
}

function CurrentHero({ quick }: { quick: QuickFilters }) {
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
          "items-center text-center",
          "md:items-start md:text-left md:flex-1 md:justify-center md:px-[var(--oak-page-x)]",
          "md:pt-10 md:pb-10 lg:pt-14 lg:pb-14",
        )}
      >
        <div
          className={cn(
            "flex w-full max-w-xl flex-col items-center",
            "md:items-start md:max-w-[26rem] lg:max-w-[30.6rem]",
          )}
        >
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

          {/* Desktop/tablet: subheading under the title, beside the photo. */}
          <p className="mt-5 hidden max-w-[22rem] text-[0.95rem] leading-relaxed text-muted md:block">
            {HOME_HERO_DESCRIPTION}
          </p>

          {/* Mobile Spacing mock: title → search → copy. Desktop photo is absolute. */}
          <div className="relative mt-6 w-full md:mt-5 lg:mt-6">
            <HomeSearchBar className="relative z-20" compact quick={quick} />
          </div>

          <p className="mt-5 max-w-[22rem] text-[0.95rem] leading-relaxed text-muted md:hidden">
            {HOME_HERO_DESCRIPTION}
          </p>
        </div>
      </div>
    </section>
  );
}
