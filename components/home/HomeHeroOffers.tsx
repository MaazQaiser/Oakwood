"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  HOME_HERO_PX_CARD_HEADING,
  HOME_HERO_PX_CARD_SUPPORT,
  HOME_HERO_PX_CTA,
  HOME_HERO_PX_REG_LABEL,
  HOME_HERO_PX_REG_PLACEHOLDER,
  HOME_HERO_RATES_BODY,
  HOME_HERO_RATES_CTA,
  HOME_RATES_FROM,
} from "@/lib/home/copy";
import {
  formatRegistration,
  normaliseRegistration,
  registrationError,
} from "@/lib/part-exchange/validation";

export function HomeHeroOffers({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-3 text-left md:grid-cols-2",
        className,
      )}
    >
      {HOME_RATES_FROM ? <RatesCard /> : null}
      <PartExchangeCard />
    </div>
  );
}

function RatesCard() {
  return (
    <article className="rounded-[28px] bg-[#B7DFF6] px-5 py-5 text-navy shadow-[0_12px_28px_rgba(0,16,40,0.08)]">
      <h2 className="text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]">
        {HOME_RATES_FROM}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#12385C]">
        {HOME_HERO_RATES_BODY}
      </p>
      <Link
        href={routes.eligibility}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#002852] px-4 text-sm font-semibold text-white no-underline hover:bg-[#001c3d]"
      >
        {HOME_HERO_RATES_CTA}
      </Link>
    </article>
  );
}

function PartExchangeCard() {
  const router = useRouter();
  const [registration, setRegistration] = useState("");
  const [error, setError] = useState<string>();

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextError = registrationError(registration);
    setError(nextError);
    if (nextError) {
      return;
    }
    const params = new URLSearchParams({
      registration: normaliseRegistration(registration),
    });
    router.push(`${routes.partExchange}?${params.toString()}`);
  }

  return (
    <article className="relative overflow-hidden rounded-[28px] bg-[#E7F4FB] px-5 py-5 text-navy shadow-[0_12px_28px_rgba(0,16,40,0.06)]">
      <div className="md:flex md:items-center md:gap-4">
        <div className="min-w-0 md:flex-1">
          <h2 className="pr-[5.25rem] text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] md:pr-0">
            {HOME_HERO_PX_CARD_HEADING}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#12385C]">
            {HOME_HERO_PX_CARD_SUPPORT}
          </p>
        </div>
        <div className="pointer-events-none absolute top-4 right-4 h-11 w-[4.5rem] md:pointer-events-auto md:relative md:top-auto md:right-auto md:h-[5.5rem] md:w-40 md:shrink-0">
          <Image
            src="/images/promo/budget-car.png"
            alt=""
            fill
            sizes="(min-width: 768px) 160px, 72px"
            style={{ transform: "scaleX(-1)" }}
            className="object-contain object-right mix-blend-multiply"
          />
        </div>
      </div>
      <form className="relative mt-4" onSubmit={submit} noValidate>
        <label
          htmlFor="home-px-registration"
          className="text-sm font-semibold text-navy"
        >
          {HOME_HERO_PX_REG_LABEL}
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            id="home-px-registration"
            value={registration}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={10}
            placeholder={HOME_HERO_PX_REG_PLACEHOLDER}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "home-px-registration-error" : undefined}
            onChange={(event) => {
              setRegistration(formatRegistration(event.target.value));
              if (error) setError(undefined);
            }}
            className={cn(
              "min-h-11 w-full min-w-0 flex-1 rounded-full border bg-white px-4 text-sm font-semibold uppercase tracking-[0.04em] text-navy placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-[#8b95a3] focus:outline-none focus:ring-[3px]",
              error
                ? "border-danger focus:border-danger focus:ring-danger/25"
                : "border-[#D7E0E8] focus:border-primary focus:ring-primary/25",
            )}
          />
          <button
            type="submit"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#002852] px-4 text-sm font-semibold text-white hover:bg-[#001c3d]"
          >
            {HOME_HERO_PX_CTA}
          </button>
        </div>
        {error ? (
          <p
            id="home-px-registration-error"
            className="mt-2 text-caption text-danger"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </form>
    </article>
  );
}
