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
import { IconArrow } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import {
  HOME_HERO_DESCRIPTION,
  HOME_HERO_HEADING,
  HOME_HERO_PRIMARY,
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
          <div className="-mx-[var(--oak-page-x)] bg-[#ECF3F8] px-[var(--oak-page-x)] py-6 sm:py-8 lg:py-10">
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
        <div className="max-w-md">
          <h1 className="text-[2.55rem] font-medium leading-[1.22em] tracking-[-0.03em] text-navy sm:text-[3.15rem] sm:leading-[1.12em] lg:text-[3.45rem] lg:leading-[1.1em]">
            {HOME_HERO_HEADING}
          </h1>
          <p className="mt-5 max-w-[22rem] text-[0.95rem] leading-relaxed text-muted">
            {HOME_HERO_DESCRIPTION}
          </p>
          <HomeSearchBar className="mt-6" />
          <div className="mt-8 flex flex-col items-start gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-5 lg:gap-y-3">
            <Link
              href={routes.search}
              className="group inline-flex min-h-14 items-center gap-3 rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-white no-underline hover:bg-[#001c3d]"
            >
              <span className="text-button">{HOME_HERO_PRIMARY}</span>
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
      <HeroCompactPhoto bleedClassName="-mx-6" />
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
        <HomeFilterSearchCard />
      </div>
      <HeroCompactPhoto bleedClassName="-mx-5 sm:-mx-6" />
    </section>
  );
}

function HeroCompactPhoto({ bleedClassName }: { bleedClassName: string }) {
  return (
    <div
      className={`relative mt-2 h-60 shrink-0 overflow-hidden lg:hidden [@media(max-height:560px)]:pointer-events-none [@media(max-height:560px)]:absolute [@media(max-height:560px)]:top-0 [@media(max-height:560px)]:right-0 [@media(max-height:560px)]:bottom-auto [@media(max-height:560px)]:left-auto [@media(max-height:560px)]:mx-0 [@media(max-height:560px)]:mt-0 [@media(max-height:560px)]:h-[min(100%,100dvh)] [@media(max-height:560px)]:w-[42%] ${bleedClassName}`}
    >
      <Image
        src="/images/hero/open-sky-mobile.png"
        alt="A smiling customer giving a thumbs up beside a car under an open sky"
        fill
        priority
        quality={92}
        sizes="(max-width: 1024px) 100vw, 46vw"
        className="object-cover object-[center_28%] [@media(max-height:560px)]:object-[center_45%] [mask-image:linear-gradient(to_bottom,transparent,#000_12%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_12%)] [@media(max-height:560px)]:[mask-image:linear-gradient(to_right,transparent,#000_18%)] [@media(max-height:560px)]:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_18%)]"
      />
    </div>
  );
}
