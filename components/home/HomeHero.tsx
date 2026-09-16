"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { IconCheck } from "@/components/ui/icons";
import { FinanceEligibilityCard } from "@/components/home/FinanceEligibilityCard";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getSearchUrl, routes } from "@/config/routes";
import { formatApr } from "@/lib/format/money";
import { stockImages } from "@/lib/media/stock";
import { BODY_TYPES } from "@/lib/vehicles/search";

const trustPoints = [
  "No impact on your credit score",
  "Takes around 60 seconds",
  "See cars based on your budget",
];

export function HomeHero() {
  const { mode, apr } = useCustomerFinance();
  const eligible = mode === "personalised";
  const ineligible = mode === "ineligible";

  const heading = eligible
    ? "Your finance profile is ready."
    : "Find a car that fits your budget.";
  const copy = eligible
    ? `Browse cars using your personalised finance profile. Current APR from ${formatApr(apr)}.`
    : ineligible
      ? "Some cars may be outside your current finance profile. You can still browse stock, change your deposit, or speak to Oakwood."
      : "Check your finance eligibility in under 60 seconds. No impact on your credit score.";
  const primaryLabel = eligible ? "Browse cars within my budget" : "Check my eligibility";
  const primaryHref = eligible ? getSearchUrl({ affordable: 1 }) : routes.eligibility;

  return (
    <section className="bg-page">
      <Container className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-primary">Finance made personal</p>
          <h1 className="text-display mt-2">{heading}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-body text-muted">{copy}</p>
        </div>

        <div className="mt-6">
          <HomeSearchBar />
        </div>

        <div className="relative mx-auto mt-6 max-w-5xl">
          <div className="relative aspect-[16/9] md:aspect-[2.1/1]">
            <Image
              src={stockImages.coupe01}
              alt="Used car available at Oakwood Motor Company"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain object-center"
            />
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {BODY_TYPES.map((body) => (
            <li key={body}>
              <Link
                href={getSearchUrl({ body_style: body })}
                className="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-body-sm text-muted no-underline shadow-sm hover:text-ink"
              >
                {body}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={primaryHref} size="lg">
            {primaryLabel}
          </Button>
          <Button href={routes.usedCars} variant="secondary" size="lg">
            Browse all cars
          </Button>
        </div>

        <ul className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2 text-caption text-muted">
              <IconCheck className="text-primary" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-4xl">
          <FinanceEligibilityCard />
        </div>
      </Container>
    </section>
  );
}
