import Link from "next/link";
import { ArrowUpRight, Percent, Scale } from "lucide-react";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import { showPreviewNotices } from "@/lib/env/preview";
import {
  HOME_FINANCE_BEAT_TITLE,
  HOME_FINANCE_ELIGIBILITY_CTA,
  HOME_FINANCE_ELIGIBILITY_PREVIEW,
  HOME_RATES_FROM,
} from "@/lib/home/copy";

/**
 * Finance claims strip — three linked routes with a light visual treatment.
 * The full rate CTA lives at the homepage foot, not here.
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
        "overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#ECF3F8_0%,#ffffff_48%,#E6F4FB_100%)] shadow-[0_12px_28px_rgba(16,40,72,0.07)] ring-1 ring-[#002852]/8",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-stretch sm:gap-3 sm:p-6">
        <Link
          href={routes.eligibility}
          className="group flex min-w-0 flex-1 items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 no-underline shadow-[inset_0_0_0_1px_rgba(0,40,82,0.06)] transition hover:bg-white"
        >
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy text-white">
            <Percent className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-navy group-hover:underline">
              Know your rate
            </span>
            <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted">
              Soft search first — no credit footprint
            </span>
          </span>
        </Link>

        {HOME_RATES_FROM ? (
          <Link
            href={routes.financeCalculator}
            className="group flex min-w-0 flex-1 items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 no-underline shadow-[inset_0_0_0_1px_rgba(0,40,82,0.06)] transition hover:bg-white"
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-navy">
              <Scale className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold tabular-nums text-navy group-hover:underline">
                {HOME_RATES_FROM}
              </span>
              <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted">
                Illustrative rates on the calculator
              </span>
            </span>
          </Link>
        ) : null}

        <Link
          href={routes.beatLoanOffer}
          className="group flex min-w-0 flex-1 items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 no-underline shadow-[inset_0_0_0_1px_rgba(0,40,82,0.06)] transition hover:bg-white"
        >
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E7F3C4] text-navy">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-navy group-hover:underline">
              {HOME_FINANCE_BEAT_TITLE}
            </span>
            <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted">
              Send us the offer you already have
            </span>
          </span>
        </Link>

        {showEligibilityCta ? (
          <Link
            href={routes.eligibility}
            className="inline-flex h-11 shrink-0 items-center justify-center self-stretch rounded-[14px] bg-navy px-4 text-sm font-semibold text-white no-underline hover:bg-[#001c3d] sm:self-center"
          >
            {HOME_FINANCE_ELIGIBILITY_CTA}
          </Link>
        ) : null}
      </div>

      {preview && variant === "reassurance" ? (
        <p className="border-t border-navy/8 px-5 py-2.5 text-[0.75rem] text-muted sm:px-6">
          {HOME_FINANCE_ELIGIBILITY_PREVIEW}
        </p>
      ) : null}
    </nav>
  );
}
