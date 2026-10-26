"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/forms/FormControls";
import { MONTHLY_OPTIONS, PRICE_OPTIONS } from "@/components/search/constants";
import { IconArrow, IconFilters, IconSearch } from "@/components/ui/icons";
import { getSearchUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPounds } from "@/lib/format/money";
import {
  HOME_HERO_FILTERS,
  HOME_HERO_FILTER_MAX_MONTHLY,
  HOME_HERO_FILTER_MAX_PRICE,
  HOME_HERO_FILTER_MONTHLY,
  HOME_HERO_FILTER_PRICE,
  HOME_HERO_FILTER_SEARCH,
  HOME_HERO_FILTER_SELECT_MAKE,
  HOME_HERO_FILTER_SELECT_MODEL,
  HOME_HERO_OR_TYPE,
  HOME_HERO_OR_TYPE_HINT,
  HOME_HERO_PRIMARY,
} from "@/lib/home/copy";
import type { SearchQuery } from "@/lib/validation/search";
import { getMakes, getModels } from "@/lib/vehicles/labels";

const fieldClass =
  "min-h-12! w-full rounded-2xl! border-[#D7E0E8]! bg-white! pl-3.5! pr-9! text-[0.8125rem]! font-medium text-ink!";

type PriceMode = "monthly" | "total";

export function HomeSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [hintOpen, setHintOpen] = useState(false);
  const [mode, setMode] = useState<PriceMode>("monthly");
  const [monthlyMax, setMonthlyMax] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makes = getMakes("car");
  const models = getModels(make || undefined, "car");

  const query = useMemo((): SearchQuery => {
    const next: SearchQuery = {};
    if (value.trim()) next.q = value.trim();
    if (make) next.make = make;
    if (model) next.model = model;
    if (mode === "monthly" && monthlyMax) next.monthly_max = monthlyMax;
    if (mode === "total" && maxPrice) next.max_price = maxPrice;
    return next;
  }, [value, make, model, mode, monthlyMax, maxPrice]);

  function submitSearch() {
    trackEvent(analyticsEvents.searchSubmitted, {
      q: value,
      category: "car",
      source: "home_hero_search",
    });
    router.push(
      getSearchUrl(query as Record<string, string | number | undefined>),
    );
  }

  return (
    <form
      role="search"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch();
      }}
    >
      <div className="rounded-[22px] bg-white p-4 shadow-[0_16px_36px_rgba(16,40,72,0.1)] sm:p-5">
        {filtersOpen ? (
        <div id="home-search-filters">
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">Price type</legend>
          <div
            role="tablist"
            aria-label="Price type"
            className="grid grid-cols-2 rounded-full bg-[#E7EEF4] p-1"
          >
            <PriceTab
              selected={mode === "monthly"}
              onClick={() => setMode("monthly")}
            >
              {HOME_HERO_FILTER_MONTHLY}
            </PriceTab>
            <PriceTab
              selected={mode === "total"}
              onClick={() => setMode("total")}
            >
              {HOME_HERO_FILTER_PRICE}
            </PriceTab>
          </div>
        </fieldset>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="min-w-0">
            <label htmlFor="home-search-budget" className="sr-only">
              {mode === "monthly"
                ? HOME_HERO_FILTER_MAX_MONTHLY
                : HOME_HERO_FILTER_MAX_PRICE}
            </label>
            <Select
              id="home-search-budget"
              className={cn(fieldClass, "tabular-nums")}
              value={mode === "monthly" ? monthlyMax : maxPrice}
              onChange={(event) => {
                if (mode === "monthly") {
                  setMonthlyMax(event.target.value);
                } else {
                  setMaxPrice(event.target.value);
                }
              }}
            >
              <option value="">
                {mode === "monthly" ? "Max monthly" : "Max price"}
              </option>
              {(mode === "monthly" ? MONTHLY_OPTIONS : PRICE_OPTIONS).map(
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
            <label htmlFor="home-search-make" className="sr-only">
              {HOME_HERO_FILTER_SELECT_MAKE}
            </label>
            <Select
              id="home-search-make"
              className={fieldClass}
              value={make}
              onChange={(event) => {
                setMake(event.target.value);
                setModel("");
              }}
            >
              <option value="">{HOME_HERO_FILTER_SELECT_MAKE}</option>
              {makes.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-2.5">
          <label htmlFor="home-search-model" className="sr-only">
            {HOME_HERO_FILTER_SELECT_MODEL}
          </label>
          <Select
            id="home-search-model"
            className={fieldClass}
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            <option value="">{HOME_HERO_FILTER_SELECT_MODEL}</option>
            {models.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        </div>
        ) : null}

        <div className={cn("flex items-center gap-2", filtersOpen && "mt-3")}>
          <div className="flex shrink-0 items-center gap-1 text-[0.8125rem] font-medium leading-tight text-[#5d6b7a]">
            <label htmlFor="home-search">{HOME_HERO_OR_TYPE}</label>
            <button
              type="button"
              className="grid h-4 w-4 place-items-center rounded-full border border-[#8ea0b0] text-[0.625rem] font-semibold leading-none text-[#5d6b7a]"
              aria-expanded={hintOpen}
              aria-controls="home-search-hint"
              aria-label="About keyword search"
              onClick={() => setHintOpen((open) => !open)}
            >
              i
            </button>
          </div>
          <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#D7E0E8] bg-white px-3">
            <IconSearch className="shrink-0 text-[#8b95a3]" width={16} height={16} />
            <input
              id="home-search"
              name="q"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={HOME_HERO_FILTER_SEARCH}
              autoComplete="off"
              aria-describedby={hintOpen ? "home-search-hint" : undefined}
              className="h-full w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-[#8b95a3]"
            />
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="home-search-filters"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#002852] text-white hover:bg-[#001c3d]"
            onClick={() => {
              const next = !filtersOpen;
              setFiltersOpen(next);
              if (next) {
                trackEvent(analyticsEvents.filterOpened, { category: "car" });
              }
            }}
          >
            <IconFilters className="text-white" width={20} height={20} />
            <span className="sr-only">{HOME_HERO_FILTERS}</span>
          </button>
        </div>
        {hintOpen ? (
          <p id="home-search-hint" className="mt-2 text-xs leading-snug text-muted">
            {HOME_HERO_OR_TYPE_HINT}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-3 inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-[#002852] py-1.5 pl-5 pr-1.5 text-base font-semibold text-white hover:bg-[#001c3d]"
        >
          <span>{HOME_HERO_PRIMARY}</span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#002852]">
            <IconArrow width={18} height={18} />
          </span>
        </button>
      </div>
    </form>
  );
}

function PriceTab({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={cn(
        "h-10 rounded-full px-3 text-sm font-semibold",
        selected ? "bg-[#002852] text-white" : "bg-transparent text-[#5d6b7a]",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
