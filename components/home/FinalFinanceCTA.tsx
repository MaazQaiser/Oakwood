"use client";

import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getFinanceCalculatorUrl, getSearchUrl, routes } from "@/config/routes";
import { getRepresentativeFinanceExample } from "@/lib/finance/representative-example";
import { formatPounds } from "@/lib/format/money";
import { findVehicleByStockId } from "@/lib/vehicles/query";

function ExampleCard() {
  const example = getRepresentativeFinanceExample();
  const monthly = example
    ? formatPounds(example.monthlyPayment)
    : undefined;
  const exampleImage = example
    ? findVehicleByStockId(example.stockId)?.image
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-[24rem] flex-col items-end gap-4">
      <div className="relative w-full max-w-[16.5rem] rounded-[22px] bg-[#E7F1F8] px-4 pb-5 pt-8">
        <span className="absolute left-4 top-3 rounded-full bg-[#8EBFDF] px-3 py-1 text-xs font-semibold text-[#002852]">
          Example
        </span>
        <div className="relative mt-4 h-[5.5rem]">
          {exampleImage ? (
            <Image
              src={exampleImage}
              alt=""
              fill
              sizes="260px"
              className="object-contain object-center"
            />
          ) : (
            <div
              className="h-full"
              role="img"
              aria-label="Example vehicle photography slot. Oakwood photography of this car will appear here when the image is connected."
            />
          )}
        </div>
        {example ? (
          <p className="mt-4 text-sm font-semibold text-[#002852]">
            {example.year} {example.make} {example.model}
          </p>
        ) : (
          <div className="mt-4 h-2 w-28 rounded-full bg-[#002852]/10" />
        )}
        <div className="mt-2 h-2 w-16 rounded-full bg-[#002852]/10" />
      </div>
      {monthly ? (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-[#002852] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#8EBFDF]">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path
                d="M12 5v12M7 12l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            <span className="tabular-number block text-[1.35rem] font-semibold leading-none">
              {monthly}
            </span>
            <span className="mt-1 block text-xs text-[#667085]">a month</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function FinalFinanceCTA() {
  const { mode } = useCustomerFinance();
  const eligible = mode === "personalised";
  const example = getRepresentativeFinanceExample();

  return (
    <Section>
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(105deg,#001c3d_0%,#002852_48%,#0a3a6b_100%)] px-6 py-8 text-white md:px-12 md:py-10 lg:px-14">
          <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="flex max-w-xl flex-col justify-between gap-8">
              <div>
                <h2 className="text-[1.7rem] font-semibold leading-[1.2em] tracking-tight md:text-[2rem]">
                  {eligible
                    ? "Your finance profile is ready. Browse cars that fit your budget."
                    : "Know your budget before you shop, then browse cars that fit."}
                </h2>
                <Link
                  href={eligible ? getSearchUrl({ affordable: 1 }) : routes.eligibility}
                  className="mt-5 inline-block text-[0.95rem] font-semibold text-white underline decoration-white/90 underline-offset-[5px]"
                >
                  {eligible ? "Browse cars within my budget" : "Check my eligibility"}
                </Link>
              </div>
              <p className="text-sm text-white/75">
                No impact on your credit score.{" "}
                <Link
                  href={getFinanceCalculatorUrl(
                    example ? { stockId: example.stockId } : undefined,
                  )}
                  className="font-semibold text-white underline decoration-white/70 underline-offset-[5px]"
                >
                  Calculate finance
                </Link>
              </p>
            </div>
            <ExampleCard />
          </div>
        </div>
      </Container>
    </Section>
  );
}
