"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select } from "@/components/forms/FormControls";
import { MONTHLY_OPTIONS, PRICE_OPTIONS } from "@/components/search/constants";
import { HomeFinanceRateLine } from "@/components/home/HomeFinanceRateLine";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { IconClose, IconSearch } from "@/components/ui/icons";
import { getSearchUrl, routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getRepresentativeFinanceExample } from "@/lib/finance/representative-example";
import { formatPounds } from "@/lib/format/money";
import {
  HOME_BUDGET_HEADING,
  HOME_FIND_HEADING,
  HOME_PART_EXCHANGE,
  HOME_SEARCH_PLACEHOLDER,
} from "@/lib/home/copy";
import { getMakes, getModels } from "@/lib/vehicles/labels";
import {
  applyNaturalLanguageSuggestion,
  interpretNaturalLanguage,
  removeNaturalLanguageTerm,
  suggestNaturalLanguage,
} from "@/lib/vehicles/natural-language";
import { listVehicles } from "@/lib/vehicles/query";
import { filterVehicles } from "@/lib/vehicles/search";
import type { SearchQuery } from "@/lib/validation/search";

type HeroTab = "find" | "budget";
type BudgetMode = "monthly" | "total";

export function HomeSearchCard({ className }: { className?: string }) {
  const [tab, setTab] = useState<HeroTab>("find");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] bg-white shadow-[0_16px_40px_rgba(16,40,72,0.1)]",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Search cars"
        className="grid grid-cols-2 gap-1 border-b border-border p-1.5 md:hidden"
      >
        <TabButton
          selected={tab === "find"}
          onSelect={() => setTab("find")}
          controls="home-hero-find"
        >
          {HOME_FIND_HEADING}
        </TabButton>
        <TabButton
          selected={tab === "budget"}
          onSelect={() => setTab("budget")}
          controls="home-hero-budget"
        >
          {HOME_BUDGET_HEADING}
        </TabButton>
      </div>

      <div className="md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div
          id="home-hero-find"
          role="tabpanel"
          aria-labelledby="home-hero-find-heading"
          className={cn(
            "p-4 sm:p-5 md:p-7 lg:p-8",
            tab !== "find" && "hidden md:block",
          )}
        >
          <FindYourCarPanel />
        </div>
        <div
          id="home-hero-budget"
          role="tabpanel"
          aria-labelledby="home-hero-budget-heading"
          className={cn(
            "border-border p-4 sm:p-5 md:border-l md:p-7 lg:p-8",
            tab !== "budget" && "hidden md:block",
          )}
        >
          <KnowYourBudgetPanel />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  selected,
  onSelect,
  controls,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  controls: string;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      className={cn(
        "min-h-11 rounded-[18px] px-3 text-sm font-semibold",
        selected
          ? "bg-primary text-white"
          : "bg-transparent text-primary-secondary",
      )}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

function FindYourCarPanel() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const catalog = useMemo(() => listVehicles("car"), []);

  const interpreted = useMemo(
    () => interpretNaturalLanguage(q, catalog),
    [catalog, q],
  );
  const suggestions = useMemo(
    () => suggestNaturalLanguage(q, catalog),
    [catalog, q],
  );
  const count = useMemo(
    () => filterVehicles(catalog, interpreted.query).length,
    [catalog, interpreted.query],
  );
  const searchLabel = `Search ${count} car${count === 1 ? "" : "s"}`;

  function submitSearch() {
    const params: SearchQuery = { ...interpreted.query };
    if (interpreted.remainder) {
      params.q = interpreted.remainder;
    }
    trackEvent(analyticsEvents.searchSubmitted, {
      q: q.trim() || undefined,
      category: "car",
      source: "home_hero",
    });
    router.push(getSearchUrl({ ...params }));
  }

  return (
    <div className="flex h-full flex-col justify-start">
      <h1
        id="home-hero-find-heading"
        className="text-[1.65rem] font-semibold tracking-[-0.03em] text-oakwood max-md:sr-only lg:text-[1.85rem]"
      >
        {HOME_FIND_HEADING}
      </h1>
      <form
        className="mt-0 flex flex-col gap-3 md:mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <label htmlFor="home-search-q" className="sr-only">
          Search for a car
        </label>
        <div className="flex min-w-0 flex-col gap-2 rounded-[14px] border border-border-input bg-white p-2 sm:p-2.5">
          <div className="flex min-h-11 min-w-0 items-center gap-2 px-1.5">
            <IconSearch className="shrink-0 text-[#8b95a3]" />
            <input
              id="home-search-q"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder={HOME_SEARCH_PLACEHOLDER}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-11 min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-[#8b95a3]"
            />
          </div>
          {interpreted.terms.length > 0 ? (
            <ul
              aria-label="Recognised search terms"
              className="flex flex-wrap gap-2 border-t border-border px-1.5 py-2"
            >
              {interpreted.terms.map((term) => (
                <li key={term.id} className="min-w-0">
                  <Chip className="max-w-full gap-0.5 border-primary/15 bg-page-tint py-0 pl-3 text-primary">
                    <span className="min-w-0 truncate text-sm font-medium">
                      {term.label}
                    </span>
                    <button
                      type="button"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary hover:bg-white/70"
                      aria-label={`Remove ${term.label}`}
                      onClick={() =>
                        setQ(removeNaturalLanguageTerm(q, term))
                      }
                    >
                      <IconClose width={14} height={14} />
                    </button>
                  </Chip>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {interpreted.terms.length > 0 ? (
          <p className="sr-only" aria-live="polite">
            {`Recognised ${interpreted.terms.map((term) => term.label).join(", ")}`}
          </p>
        ) : null}
        {suggestions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-[#8b95a3]">Suggestions</p>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                className="min-h-11 rounded-full border border-border-input px-3 text-sm font-medium text-primary-secondary hover:bg-page-tint"
                onClick={() =>
                  setQ(
                    applyNaturalLanguageSuggestion(q, suggestion.completion),
                  )
                }
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        ) : null}
        <Button type="submit" className="btn-compact w-full shrink-0 tabular-nums sm:max-w-xs">
          {searchLabel}
        </Button>
      </form>
      <p className="mt-4">
        <Link
          href={routes.partExchange}
          className="text-sm font-semibold text-primary-secondary underline underline-offset-2"
        >
          {HOME_PART_EXCHANGE}
        </Link>
      </p>
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
    <div className="flex h-full flex-col justify-start">
      <h2
        id="home-hero-budget-heading"
        className="text-[1.35rem] font-semibold tracking-[-0.03em] text-ink max-md:sr-only lg:text-[1.5rem] lg:text-oakwood"
      >
        {HOME_BUDGET_HEADING}
      </h2>
      <form
        className="mt-0 flex flex-col gap-3 md:mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <div className="grid grid-cols-2 rounded-full bg-page-tint p-1">
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

        <label htmlFor="home-budget-amount" className="sr-only">
          {mode === "monthly" ? "Monthly budget" : "Total budget"}
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

        <div className="grid grid-cols-2 gap-2">
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

        <Button type="submit" className="btn-compact w-full whitespace-normal! tabular-nums">
          {ctaLabel}
        </Button>
      </form>
      <HomeFinanceRateLine className="mt-3 text-[0.8rem] leading-relaxed text-muted" />
    </div>
  );
}
