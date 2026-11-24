import { PageBanner } from "@/components/layout/PageBanner";
import { NEG_EQUITY_COPY } from "@/lib/finance/negative-equity/content";
import type { BreadcrumbItem } from "@/lib/seo";

export function NegativeEquityHero({
  breadcrumbs,
}: {
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <PageBanner
      title={`${NEG_EQUITY_COPY.h1Before} ${NEG_EQUITY_COPY.h1Em} ${NEG_EQUITY_COPY.h1After}`}
      breadcrumbs={breadcrumbs}
      description={
        <>
          <p>{NEG_EQUITY_COPY.lede}</p>
          <p className="mt-5 inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-[16px] border border-[#E7EEF4] bg-white px-4 py-3 text-sm text-muted shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
            <span className="text-xl font-semibold tabular-nums tracking-[-0.02em] text-[#002852]">
              {NEG_EQUITY_COPY.badgeAmount}
            </span>
            <span>{NEG_EQUITY_COPY.badgePrefix}</span>
          </p>
        </>
      }
    />
  );
}
