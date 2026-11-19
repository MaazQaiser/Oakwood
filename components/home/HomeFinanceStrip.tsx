import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import { showPreviewNotices } from "@/lib/env/preview";
import {
  HOME_FINANCE_BEAT_TITLE,
  HOME_FINANCE_ELIGIBILITY_CTA,
  HOME_FINANCE_ELIGIBILITY_PREVIEW,
  HOME_FINANCE_ELIGIBILITY_TITLE,
  HOME_RATES_FROM,
} from "@/lib/home/copy";

/**
 * Single finance claims line — links only, not three full-width cards.
 * Homepage should have at most one eligibility CTA here (plus FinalFinanceCTA).
 */
export function HomeFinanceStrip({
  variant = "reassurance",
  className,
  showEligibilityCta = true,
}: {
  variant?: "reassurance" | "eligibility";
  className?: string;
  /** When false, claims still link but the explicit eligibility button is omitted. */
  showEligibilityCta?: boolean;
}) {
  const preview = showPreviewNotices();

  return (
    <nav
      aria-label="Finance routes"
      className={cn(
        "flex flex-col gap-3 rounded-[22px] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(16,40,72,0.06)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2",
        className,
      )}
    >
      <p className="m-0 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-relaxed text-secondary">
        <Link
          href={routes.eligibility}
          className="font-semibold text-[#002852] no-underline hover:underline"
        >
          {HOME_FINANCE_ELIGIBILITY_TITLE}
        </Link>
        <span aria-hidden className="text-ink/25">
          ·
        </span>
        {HOME_RATES_FROM ? (
          <>
            <Link
              href={routes.financeCalculator}
              className="font-semibold text-[#002852] no-underline hover:underline tabular-nums"
            >
              {HOME_RATES_FROM}
            </Link>
            <span aria-hidden className="text-ink/25">
              ·
            </span>
          </>
        ) : null}
        <Link
          href={routes.finance}
          className="font-semibold text-[#002852] no-underline hover:underline"
        >
          {HOME_FINANCE_BEAT_TITLE}
        </Link>
        {preview && variant === "reassurance" ? (
          <span className="w-full basis-full text-[0.75rem] text-muted sm:w-auto sm:basis-auto">
            {HOME_FINANCE_ELIGIBILITY_PREVIEW}
          </span>
        ) : null}
      </p>
      {showEligibilityCta ? (
        <Link
          href={routes.eligibility}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-[12px] bg-[#002852] px-4 text-sm font-semibold text-white no-underline hover:bg-[#001c3d]"
        >
          {HOME_FINANCE_ELIGIBILITY_CTA}
        </Link>
      ) : null}
    </nav>
  );
}
