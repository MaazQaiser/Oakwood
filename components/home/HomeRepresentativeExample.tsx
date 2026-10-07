import Link from "next/link";
import { FinanceDisclaimer } from "@/components/finance/FinanceDisclaimer";
import {
  FinanceSummary,
  FinancialNumber,
} from "@/components/finance/FinancePrimitives";
import { OakwoodPhotoSlot } from "@/components/media/OakwoodPhotoSlot";
import { Button } from "@/components/ui/Button";
import {
  getFinanceCalculatorUrl,
  getSearchUrl,
  getVehicleUrl,
} from "@/config/routes";
import {
  getExampleApr,
  getRepresentativeFinanceExample,
} from "@/lib/finance/representative-example";
import { formatApr, formatPounds, formatTerm } from "@/lib/format/money";
import {
  HOME_REPRESENTATIVE_BUDGET_MONTHLY,
  HOME_REPRESENTATIVE_CTA,
  HOME_REPRESENTATIVE_DESCRIPTION,
  HOME_REPRESENTATIVE_HEADING,
} from "@/lib/home/copy";
import { representativeExamplePhotography } from "@/lib/home/photography";
import { findVehicleByStockId } from "@/lib/vehicles/query";

export function HomeRepresentativeExample() {
  const example = getRepresentativeFinanceExample();
  if (!example) {
    return null;
  }

  const vehicle = findVehicleByStockId(example.stockId);
  const photo = representativeExamplePhotography(vehicle);
  const title = `${example.year} ${example.make} ${example.model}`;
  const apr = getExampleApr(example);
  const financeTypeLabel =
    example.financeType === "pcp" ? "PCP" : "HP";
  const vehicleHref = getVehicleUrl(example.slug);
  const detailsHref = getFinanceCalculatorUrl({ stockId: example.stockId });
  const budgetHref = getSearchUrl({
    monthly_max: HOME_REPRESENTATIVE_BUDGET_MONTHLY,
  });

  return (
    <div>
      <header className="max-w-2xl">
        <h3
          id="home-representative-example-heading"
          className="text-h2 text-primary"
        >
          {HOME_REPRESENTATIVE_HEADING}
        </h3>
        <p className="mt-4 text-body text-muted">
          {HOME_REPRESENTATIVE_DESCRIPTION}
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <Link
          href={vehicleHref}
          aria-label={`View ${title}`}
          className="relative min-h-64 overflow-hidden rounded-[28px] no-underline sm:min-h-80 lg:min-h-[28rem]"
        >
          <OakwoodPhotoSlot
            slot={photo}
            fill
            sizes="(max-width: 1024px) 100vw, 36rem"
          />
        </Link>

        <article
          aria-labelledby="home-representative-example-heading"
          className="flex min-w-0 flex-col rounded-[28px] bg-page-tint p-6 sm:p-8"
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
            Representative example
          </p>
          <h4 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
            {title}
          </h4>
          {example.derivative ? (
            <p className="mt-1 text-sm text-secondary">{example.derivative}</p>
          ) : null}

          <p className="mt-8 text-caption text-muted">From</p>
          <p className="mt-2 text-primary">
            <FinancialNumber
              value={formatPounds(example.monthlyPayment)}
              suffix="/month*"
              size="lg"
            />
          </p>

          <p className="mt-5 text-sm leading-relaxed text-secondary">
            {formatTerm(example.term)} {financeTypeLabel}
            {" · "}
            {formatPounds(example.deposit)} deposit
          </p>
          {apr !== undefined ? (
            <p className="mt-1 text-sm leading-relaxed text-secondary">
              {formatApr(apr)}
            </p>
          ) : null}

          <details className="mt-6 border-t border-ink/10 pt-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none text-sm font-semibold text-primary-secondary hover:underline">
              View finance details →
            </summary>
            <div className="mt-4">
              <FinanceSummary
                monthly={example.monthlyPayment}
                cash={example.cashPrice}
                apr={apr}
                deposit={example.deposit}
                term={example.term}
                totalPayable={example.totalPayable}
                financeType={example.financeType}
                state="representative"
                showDisclaimer={false}
              />
              <div className="mt-4">
                <FinanceDisclaimer personalised={false} />
              </div>
              <p className="mt-4">
                <Link
                  href={detailsHref}
                  className="text-sm font-semibold text-primary-secondary no-underline hover:underline"
                >
                  Calculate this example
                </Link>
              </p>
            </div>
          </details>
        </article>
      </div>

      <div className="mt-8 flex justify-center">
        <Button href={budgetHref} className="btn-compact w-full max-w-md sm:w-auto">
          {HOME_REPRESENTATIVE_CTA}
        </Button>
      </div>
    </div>
  );
}
