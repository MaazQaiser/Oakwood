"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/forms/FormControls";
import { MONTHLY_OPTIONS, PRICE_OPTIONS } from "@/components/search/constants";
import { HomeFinanceRateLine } from "@/components/home/HomeFinanceRateLine";
import { Button } from "@/components/ui/Button";
import { getSearchUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getRepresentativeFinanceExample } from "@/lib/finance/representative-example";
import { formatPounds } from "@/lib/format/money";
import {
  HOME_BUDGET_DESCRIPTION,
  HOME_BUDGET_FIELD,
  HOME_BUDGET_HEADING,
} from "@/lib/home/copy";
import { getMakes, getModels } from "@/lib/vehicles/labels";
import type { SearchQuery } from "@/lib/validation/search";

type BudgetMode = "monthly" | "total";

export function HomeSearchCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] bg-white shadow-[0_16px_40px_rgba(16,40,72,0.1)]",
        className,
      )}
    >
      <div className="p-4 sm:p-5 md:p-7 lg:p-8">
        <KnowYourBudgetPanel />
      </div>
    </div>
  );
}

function withExampleAmount(options: readonly number[], example?: number) {
  if (example === undefined) {
    return [...options];
  }
  return Array.from(new Set([...options, example])).sort((a, b) => a - b);
}

function KnowYourBudgetPanel() {
  const router = useRouter();
  const example = getRepresentativeFinanceExample();
  const monthlyOptions = withExampleAmount(
    MONTHLY_OPTIONS,
    example?.monthlyPayment,
  );
  const priceOptions = withExampleAmount(PRICE_OPTIONS, example?.cashPrice);
  const [mode, setMode] = useState<BudgetMode>("monthly");
  const [maxPrice, setMaxPrice] = useState(() =>
    String(example?.cashPrice ?? PRICE_OPTIONS[4] ?? 15000),
  );
  const [monthlyMax, setMonthlyMax] = useState(() =>
    String(example?.monthlyPayment ?? MONTHLY_OPTIONS[0]),
  );
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makes = getMakes("car");
  const models = make ? getModels(make, "car") : [];
  const budgetValue = mode === "monthly" ? monthlyMax : maxPrice;
  const budgetAmount = Number(budgetValue);

  const query = useMemo((): SearchQuery => {
    const next: SearchQuery = {};
    if (make) {
      next.make = make;
    }
    if (model) {
      next.model = model;
    }
    if (mode === "total" && maxPrice) {
      next.max_price = maxPrice;
    }
    if (mode === "monthly" && monthlyMax) {
      next.monthly_max = monthlyMax;
    }
    return next;
  }, [make, model, mode, maxPrice, monthlyMax]);

  const ctaLabel = Number.isFinite(budgetAmount)
    ? mode === "monthly"
      ? `Show cars from ${formatPounds(budgetAmount)} a month`
      : `Show cars up to ${formatPounds(budgetAmount)}`
    : "Show cars";

  function submitSearch() {
    trackEvent(analyticsEvents.searchSubmitted, {
      category: "car",
      mode,
      source: "home_budget",
    });
    router.push(getSearchUrl({ ...query }));
  }

  return (
    <div className="flex flex-col justify-start">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div>
            <h2
              id="home-hero-budget-heading"
              className="text-[1.35rem] font-semibold tracking-[-0.03em] text-ink lg:text-[1.5rem] lg:text-oakwood"
            >
              {HOME_BUDGET_HEADING}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-secondary">
              {HOME_BUDGET_DESCRIPTION}
            </p>
          </div>
          <div className="grid w-full max-w-xs shrink-0 grid-cols-2 rounded-full bg-page-tint p-1 md:ml-auto">
            <button
              type="button"
              className={cn(
                "min-h-11 rounded-full text-sm font-semibold",
                mode === "monthly"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary-secondary",
              )}
              aria-pressed={mode === "monthly"}
              onClick={() => setMode("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={cn(
                "min-h-11 rounded-full text-sm font-semibold",
                mode === "total"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary-secondary",
              )}
              aria-pressed={mode === "total"}
              onClick={() => setMode("total")}
            >
              Total
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.3fr)_minmax(8rem,1fr)_minmax(8rem,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <label htmlFor="home-budget-amount" className="sr-only">
              {HOME_BUDGET_FIELD}
            </label>
            <Select
              id="home-budget-amount"
              className="tabular-nums"
              value={budgetValue}
              onChange={(event) => {
                const value = event.target.value;
                if (mode === "monthly") {
                  setMonthlyMax(value);
                } else {
                  setMaxPrice(value);
                }
              }}
            >
              {(mode === "monthly" ? monthlyOptions : priceOptions).map(
                (amount) => (
                  <option key={amount} value={amount}>
                    {mode === "monthly"
                      ? `${formatPounds(amount)} a month`
                      : formatPounds(amount)}
                  </option>
                ),
              )}
            </Select>
          </div>

          <div className="min-w-0">
            <label htmlFor="home-budget-make" className="sr-only">
              Make
            </label>
            <Select
              id="home-budget-make"
              value={make}
              onChange={(event) => {
                setMake(event.target.value);
                setModel("");
              }}
            >
              <option value="">Any make</option>
              {makes.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="min-w-0">
            <label htmlFor="home-budget-model" className="sr-only">
              Model
            </label>
            <Select
              id="home-budget-model"
              value={model}
              disabled={!make}
              className="tabular-nums disabled:bg-page-tint disabled:text-muted"
              onChange={(event) => setModel(event.target.value)}
            >
              <option value="">Any model</option>
              {models.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="submit"
            className="btn-compact w-full whitespace-nowrap tabular-nums lg:w-auto"
          >
            {ctaLabel}
          </Button>
        </div>
      </form>
      <HomeFinanceRateLine className="mt-3 text-[0.8rem] leading-relaxed text-muted" />
    </div>
  );
}
