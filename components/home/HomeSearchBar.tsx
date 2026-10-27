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
  HOME_HERO_PRIMARY,
} from "@/lib/home/copy";
import type { SearchQuery } from "@/lib/validation/search";
import { getMakes, getModels } from "@/lib/vehicles/labels";

const fieldClass =
  "min-h-12! w-full min-w-0 rounded-2xl! border-[#D7E0E8]! bg-white! px-3! py-2.5! pr-9! text-sm! leading-normal! font-medium text-ink!";

type PriceMode = "monthly" | "total";

export function HomeSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
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
              shortLabel="Monthly"
              longLabel={HOME_HERO_FILTER_MONTHLY}
            />
            <PriceTab
              selected={mode === "total"}
              onClick={() => setMode("total")}
              shortLabel="Total"
              longLabel={HOME_HERO_FILTER_PRICE}
            />
          </div>
        </fieldset>

        <div className="mt-3 grid grid-cols-3 gap-2">
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
                {mode === "monthly" ? "Budget" : "Max price"}
              </option>
              {(mode === "monthly" ? MONTHLY_OPTIONS : PRICE_OPTIONS).map(
                (amount) => (
                  <option key={amount} value={amount}>
                    {mode === "monthly"
                      ? `${formatPounds(amount)}/mo`
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
              <option value="">Make</option>
              {makes.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-0">
            <label htmlFor="home-search-model" className="sr-only">
              {HOME_HERO_FILTER_SELECT_MODEL}
            </label>
            <Select
              id="home-search-model"
              className={fieldClass}
              value={model}
              onChange={(event) => setModel(event.target.value)}
            >
              <option value="">Model</option>
              {models.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        </div>
        ) : null}

        <div className={cn("flex items-center gap-2", filtersOpen && "mt-3")}>
          <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#D7E0E8] bg-white px-3">
            <IconSearch className="shrink-0 text-[#8b95a3]" width={16} height={16} />
            <label htmlFor="home-search" className="sr-only">
              {HOME_HERO_FILTER_SEARCH}
            </label>
            <input
              id="home-search"
              name="q"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={HOME_HERO_FILTER_SEARCH}
              autoComplete="off"
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
  shortLabel,
  longLabel,
}: {
  selected: boolean;
  onClick: () => void;
  shortLabel: string;
  longLabel: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-label={longLabel}
      className={cn(
        "flex min-h-11 items-center justify-center rounded-full px-2 text-center text-xs leading-snug font-semibold sm:min-h-10 sm:px-3",
        selected ? "bg-[#002852] text-white" : "bg-transparent text-[#5d6b7a]",
      )}
      onClick={onClick}
    >
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{longLabel}</span>
    </button>
  );
}
