"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  FINANCE_RATE_CTA,
  getFinanceRateCtaSupportingLine,
  getFinanceRateReturnedHeading,
  type FinanceRateCtaVariant,
} from "@/lib/finance/rate-cta";
import { getGoogleReviewProof } from "@/lib/reviews/google-proof";

export function FinanceRateCta({
  variant = "full",
  source,
  className,
}: {
  variant?: FinanceRateCtaVariant;
  /** Analytics source, e.g. homepage_footer, search_inline, vdp_compact */
  source: string;
  className?: string;
}) {
  const { mode, apr, setAssumptionsOpen } = useCustomerFinance();
  const hasRate = mode === "personalised";
  const compact = variant === "compact";
  const reviewProof = getGoogleReviewProof();

  if (hasRate) {
    return (
      <section
        aria-label="Your finance rate"
        className={cn(
          "rounded-[22px] bg-[#ECF3F8] text-ink",
          compact ? "px-4 py-4 sm:px-5" : "px-5 py-6 sm:px-7 sm:py-8",
          className,
        )}
      >
        <h2
          className={cn(
            "font-semibold tracking-[-0.03em] text-navy",
            compact
              ? "text-[1.15rem] leading-snug"
              : "text-[1.55rem] leading-tight sm:text-[1.75rem]",
          )}
        >
          {getFinanceRateReturnedHeading(apr)}
        </h2>
        <p
          className={cn(
            "text-secondary",
            compact ? "mt-1.5 text-sm leading-snug" : "mt-2 text-[0.95rem] leading-relaxed",
          )}
        >
          Every price on the site now shows your payment.{" "}
          <button
            type="button"
            className="font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => {
              trackEvent(analyticsEvents.financeProfileUpdated, {
                source,
                action: "open_assumptions",
              });
              setAssumptionsOpen(true);
            }}
          >
            {FINANCE_RATE_CTA.rateReturnedChangeLabel}
          </button>
        </p>
      </section>
    );
  }

  const supporting = getFinanceRateCtaSupportingLine();

  return (
    <section
      aria-label="Check your rate"
      className={cn(
        "rounded-[22px] bg-[#ECF3F8] text-ink",
        compact ? "px-4 py-4 sm:px-5" : "px-5 py-6 sm:px-7 sm:py-8",
        className,
      )}
    >
      <h2
        className={cn(
          "font-semibold tracking-[-0.03em] text-navy",
          compact
            ? "text-[1.2rem] leading-snug"
            : "text-[1.7rem] leading-tight sm:text-[2rem]",
        )}
      >
        {FINANCE_RATE_CTA.heading}
      </h2>
      <p
        className={cn(
          "text-secondary",
          compact
            ? "mt-1.5 text-sm leading-snug"
            : "mt-3 max-w-2xl text-[0.95rem] leading-relaxed",
        )}
      >
        {supporting}
      </p>

      <div className={cn(compact ? "mt-3" : "mt-5")}>
        <Button
          href={routes.eligibility}
          className={cn(
            "w-full justify-center bg-[#0061A2]! hover:bg-[#00518a]! sm:w-full",
            !compact && "md:w-auto md:min-w-[14rem]",
          )}
          onClick={() => {
            trackEvent(analyticsEvents.financeEligibilityCtaClicked, {
              source,
              action: "check_my_rate",
              variant,
            });
          }}
        >
          {FINANCE_RATE_CTA.buttonLabel}
        </Button>
      </div>

      {reviewProof ? (
        <p
          className={cn(
            "text-muted",
            compact ? "mt-2 text-[0.75rem]" : "mt-2.5 text-[0.8rem]",
          )}
        >
          {reviewProof.label}
        </p>
      ) : null}

      {FINANCE_RATE_CTA.showSecondary ? (
        <p
          className={cn(
            compact ? "mt-3 text-sm" : "mt-4 text-[0.95rem]",
            "leading-snug",
          )}
        >
          <Link
            href={routes.beatLoanOffer}
            className="font-medium text-primary underline-offset-2 no-underline hover:underline"
            onClick={() => {
              trackEvent(analyticsEvents.financeCtaClicked, {
                source,
                action: "beat_loan_offer",
                variant,
              });
            }}
          >
            {FINANCE_RATE_CTA.secondaryLine}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
