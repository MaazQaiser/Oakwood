import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  HOME_FINANCE_BEAT_CTA,
  HOME_FINANCE_BEAT_DESCRIPTION,
  HOME_FINANCE_BEAT_OFFER,
  HOME_FINANCE_BEAT_TITLE,
  HOME_FINANCE_ELIGIBILITY,
  HOME_FINANCE_ELIGIBILITY_CTA,
  HOME_FINANCE_ELIGIBILITY_DESCRIPTION,
  HOME_FINANCE_ELIGIBILITY_TITLE,
  HOME_FINANCE_RATES_CTA,
  HOME_FINANCE_RATES_SUPPORT,
  HOME_RATES_FROM,
} from "@/lib/home/copy";

const shell =
  "flex flex-col gap-3 rounded-[20px] px-4 py-4 text-sm leading-snug sm:px-5 lg:px-6";

export function HomeFinanceStrip({
  variant = "reassurance",
  className,
}: {
  variant?: "reassurance" | "eligibility";
  className?: string;
}) {
  if (variant === "eligibility") {
    return (
      <nav
        aria-label="Finance routes"
        className={cn(
          shell,
          "bg-page-tint text-ink lg:flex-row lg:items-center lg:justify-between lg:gap-6",
          className,
        )}
      >
        <Link
          href={routes.eligibility}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          {HOME_FINANCE_ELIGIBILITY}
        </Link>
        <Link
          href={routes.finance}
          className="font-semibold text-primary-secondary underline-offset-2 hover:underline lg:shrink-0 lg:text-right"
        >
          {HOME_FINANCE_BEAT_OFFER}
        </Link>
      </nav>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 rounded-[28px] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)] sm:p-6 lg:grid-cols-3 lg:gap-8",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col">
        <EligibilityIcon />
        <p className="mt-4 text-base font-semibold leading-snug text-ink">
          {HOME_FINANCE_ELIGIBILITY_TITLE}
        </p>
        <p className="mt-1 text-sm leading-snug text-secondary">
          {HOME_FINANCE_ELIGIBILITY_DESCRIPTION}
        </p>
        <p className="mt-4 mt-auto w-full pt-4">
          <Button href={routes.eligibility} className="btn-compact w-full">
            {HOME_FINANCE_ELIGIBILITY_CTA}
          </Button>
        </p>
      </div>
      <div className="flex min-w-0 flex-col border-ink/10 lg:border-l lg:pl-8">
        <RatesIcon />
        {HOME_RATES_FROM ? (
          <p className="mt-4 text-base font-semibold leading-snug text-ink tabular-nums">
            {HOME_RATES_FROM}
          </p>
        ) : null}
        <p className="mt-1 text-sm leading-snug text-secondary">
          {HOME_FINANCE_RATES_SUPPORT}
        </p>
        <p className="mt-4 mt-auto w-full pt-4">
          <Button href={routes.financeCalculator} className="btn-compact w-full">
            {HOME_FINANCE_RATES_CTA}
          </Button>
        </p>
      </div>
      <div className="flex min-w-0 flex-col border-ink/10 lg:border-l lg:pl-8">
        <OfferIcon />
        <p className="mt-4 text-base font-semibold leading-snug text-ink">
          {HOME_FINANCE_BEAT_TITLE}
        </p>
        <p className="mt-1 text-sm leading-snug text-secondary">
          {HOME_FINANCE_BEAT_DESCRIPTION}
        </p>
        <p className="mt-4 mt-auto w-full pt-4">
          <Button href={routes.finance} className="btn-compact w-full">
            {HOME_FINANCE_BEAT_CTA}
          </Button>
        </p>
      </div>
    </div>
  );
}

function EligibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-primary">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.8 9.4A2.2 2.2 0 0 1 12 7.7c1.4 0 2.4.9 2.4 2.1 0 1-.5 1.5-1.3 2-.7.4-1.1.9-1.1 1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.4" r="0.95" fill="currentColor" />
    </svg>
  );
}

function RatesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-primary">
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.2 16.8 16.8 7.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function OfferIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8 text-primary">
      <rect x="3.5" y="5.5" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="5.5" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 10h2M6 13.5h2M16 10h2M16 13.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
