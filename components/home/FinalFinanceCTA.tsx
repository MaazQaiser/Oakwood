"use client";

import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { RepresentativeExampleCard } from "@/components/finance/RepresentativeExampleCard";
import { IconArrow } from "@/components/ui/icons";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getFinanceCalculatorUrl, getSearchUrl, getVehicleUrl, routes } from "@/config/routes";
import { getRepresentativeFinanceExample } from "@/lib/finance/representative-example";
import { HOME_FINANCE_ELIGIBILITY_CTA } from "@/lib/home/copy";

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
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[1fr_auto] lg:gap-x-12 lg:gap-y-8">
            <div className="flex min-w-0 flex-col justify-center lg:col-start-1 lg:row-start-1">
              <h2 className="max-w-xl text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] md:text-[2rem]">
                {eligible
                  ? "Your finance profile is ready — browse cars that fit your budget"
                  : "Check what you could afford, then browse cars that fit"}
              </h2>
              <div className="mt-7">
                <Link
                  href={primaryHref}
                  className="inline-flex h-11 w-full max-w-xs items-center justify-between gap-2 rounded-[14px] bg-white py-1 pl-4 pr-1 text-sm font-semibold text-[#002852] no-underline hover:bg-[#E7F1F8] sm:w-auto"
                >
                  {primaryLabel}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#002852] text-white">
                    <IconArrow width={16} height={16} />
                  </span>
                </Link>
              </div>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              {example ? (
                <RepresentativeExampleCard
                  example={example}
                  href={getVehicleUrl(example.slug)}
                  tone="dark-panel"
                  showDisclaimer={false}
                />
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-white/80 lg:col-start-1 lg:row-start-2 lg:self-end">
              No impact on your credit score.{" "}
              <Link
                href={getFinanceCalculatorUrl(
                  example ? { stockId: example.stockId } : undefined,
                )}
                className="font-semibold text-white underline underline-offset-2 hover:text-white"
              >
                Finance calculator
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
