"use client";

import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { IconArrow } from "@/components/ui/icons";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getFinanceCalculatorUrl, getSearchUrl, getVehicleUrl, routes } from "@/config/routes";
import {
  getExampleApr,
  getRepresentativeFinanceExample,
} from "@/lib/finance/representative-example";
import { formatApr, formatPounds, formatTerm } from "@/lib/format/money";
import {
  HOME_FINANCE_ELIGIBILITY_CTA,
  HOME_FINANCE_RATES_CTA,
} from "@/lib/home/copy";
import { representativeExamplePhotography } from "@/lib/home/photography";
import { findVehicleByStockId } from "@/lib/vehicles/query";

function ExampleCard() {
  const example = getRepresentativeFinanceExample();
  if (!example) {
    return null;
  }

  const vehicle = findVehicleByStockId(example.stockId);
  const photo = representativeExamplePhotography(vehicle);
  const title = `${example.year} ${example.make} ${example.model}`;
  const apr = getExampleApr(example);
  const financeTypeLabel = example.financeType === "pcp" ? "PCP" : "HP";

  return (
    <Link
      href={getVehicleUrl(example.slug)}
      aria-label={`View ${title}`}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] bg-white text-[#002852] no-underline shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="relative h-44 w-full bg-[#ECF3F8] sm:h-48">
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.alt ?? title}
            fill
            sizes="22rem"
            className="object-contain object-center p-3"
          />
        ) : (
          <div
            className="flex h-full items-end p-4"
            role="img"
            aria-label={`${photo.label} photography slot. ${photo.intended}.`}
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
              {photo.label}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
          Representative example
        </p>
        <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">{title}</p>
        {example.derivative ? (
          <p className="mt-0.5 text-sm text-secondary">{example.derivative}</p>
        ) : null}
        <p className="mt-4 text-caption text-muted">From</p>
        <p className="mt-1 text-primary">
          <FinancialNumber
            value={formatPounds(example.monthlyPayment)}
            suffix="/month*"
            size="md"
          />
        </p>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          {formatTerm(example.term)} {financeTypeLabel}
          {" · "}
          {formatPounds(example.deposit)} deposit
        </p>
        {apr !== undefined ? (
          <p className="mt-0.5 text-sm leading-relaxed text-secondary">
            {formatApr(apr)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function FinalFinanceCTA() {
  const { mode } = useCustomerFinance();
  const eligible = mode === "personalised";
  const example = getRepresentativeFinanceExample();
  const primaryHref = eligible
    ? getSearchUrl({ affordable: 1 })
    : routes.eligibility;
  const primaryLabel = eligible
    ? "Browse cars within my budget"
    : HOME_FINANCE_ELIGIBILITY_CTA;

  return (
    <Section>
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(105deg,#001c3d_0%,#002852_48%,#0a3a6b_100%)] px-6 py-8 text-white md:px-10 md:py-10 lg:px-12">
          <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
            <div className="flex min-w-0 flex-col justify-center">
              <h2 className="max-w-xl text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] md:text-[2rem]">
                {eligible
                  ? "Your finance profile is ready. Browse cars that fit your budget."
                  : "Know your budget before you shop, then browse cars that fit."}
              </h2>
              <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-white/80">
                No impact on your credit score.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={primaryHref}
                  className="inline-flex h-11 w-full max-w-xs items-center justify-between gap-2 rounded-[14px] bg-white py-1 pl-4 pr-1 text-sm font-semibold text-[#002852] no-underline hover:bg-[#E7F1F8] sm:w-auto"
                >
                  {primaryLabel}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#002852] text-white">
                    <IconArrow width={16} height={16} />
                  </span>
                </Link>
                <Link
                  href={getFinanceCalculatorUrl(
                    example ? { stockId: example.stockId } : undefined,
                  )}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-white no-underline hover:underline"
                >
                  {HOME_FINANCE_RATES_CTA} →
                </Link>
              </div>
            </div>
            <ExampleCard />
          </div>
        </div>
      </Container>
    </Section>
  );
}
