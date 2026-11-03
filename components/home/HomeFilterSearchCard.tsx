"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/forms/FormControls";
import { MONTHLY_OPTIONS, PRICE_OPTIONS } from "@/components/search/constants";
import { Button } from "@/components/ui/Button";
import { IconSearch } from "@/components/ui/icons";
import { getSearchUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatNumber, formatPounds } from "@/lib/format/money";
import {
  HOME_HERO_FILTER_HEADING,
  HOME_HERO_FILTER_MAX_MONTHLY,
  HOME_HERO_FILTER_MAX_PRICE,
  HOME_HERO_FILTER_MONTHLY,
  HOME_HERO_FILTER_PRICE,
  HOME_HERO_FILTER_SEARCH,
  HOME_HERO_FILTER_SELECT_MAKE,
  HOME_HERO_FILTER_SELECT_MODEL,
} from "@/lib/home/copy";
import { getMakes, getModels } from "@/lib/vehicles/labels";
import { listVehicles } from "@/lib/vehicles/query";
import { filterVehicles } from "@/lib/vehicles/search";
import type { SearchQuery } from "@/lib/validation/search";

type PriceMode = "monthly" | "total";

const fieldClass = "min-h-10! w-full rounded-[12px]! px-3 text-[0.8125rem]!";

export function HomeFilterSearchCard({
  className,
  hideHeading = false,
}: {
  className?: string;
  hideHeading?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<PriceMode>("monthly");
  const [queryText, setQueryText] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [monthlyMax, setMonthlyMax] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makes = getMakes("car");
  const models = make ? getModels(make, "car") : [];

  const query = useMemo((): SearchQuery => {
    const next: SearchQuery = {};
    if (queryText.trim()) next.q = queryText.trim();
    if (make) next.make = make;
    if (model) next.model = model;
    if (mode === "total" && maxPrice) next.max_price = maxPrice;
    if (mode === "monthly" && monthlyMax) next.monthly_max = monthlyMax;
    return next;
  }, [queryText, make, model, mode, maxPrice, monthlyMax]);

  const matchCount = useMemo(
    () => filterVehicles(listVehicles("car"), query).length,
    [query],
  );

  function submitSearch() {
    trackEvent(analyticsEvents.searchSubmitted, {
      category: "car",
      mode,
      source: "home_filter_hero",
    });
    router.push(
      getSearchUrl(query as Record<string, string | number | undefined>),
    );
  }

  return (
    <div
      className={cn(
        "w-full max-w-[26rem] rounded-[28px] bg-white p-5 shadow-[0_18px_40px_rgba(0,16,40,0.18)] sm:p-6",
        className,
      )}
    >
      {hideHeading ? null : (
        <h1 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-ink">
          {HOME_HERO_FILTER_HEADING}
        </h1>
      )}

      <form
        className={cn("flex flex-col gap-3", hideHeading ? "mt-0" : "mt-5")}
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">Price type</legend>
          <div className="grid grid-cols-2 rounded-full bg-page-tint p-0.5">
            <button
              type="button"
              className={cn(
                "min-h-9 rounded-full text-xs font-semibold",
                mode === "monthly"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary-secondary",
              )}
              aria-pressed={mode === "monthly"}
              onClick={() => setMode("monthly")}
            >
              {HOME_HERO_FILTER_MONTHLY}
            </button>
            <button
              type="button"
              className={cn(
                "min-h-9 rounded-full text-xs font-semibold",
                mode === "total"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary-secondary",
              )}
              aria-pressed={mode === "total"}
              onClick={() => setMode("total")}
            >
              {HOME_HERO_FILTER_PRICE}
            </button>
          </div>
        </fieldset>

        <div className="grid grid-cols-3 gap-2">
          <div className="min-w-0">
            <label htmlFor="home-filter-budget" className="sr-only">
              {mode === "monthly"
                ? HOME_HERO_FILTER_MAX_MONTHLY
                : HOME_HERO_FILTER_MAX_PRICE}
            </label>
            <Select
              id="home-filter-budget"
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
            <label htmlFor="home-filter-make" className="sr-only">
              {HOME_HERO_FILTER_SELECT_MAKE}
            </label>
            <Select
              id="home-filter-make"
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
            <label htmlFor="home-filter-model" className="sr-only">
              {HOME_HERO_FILTER_SELECT_MODEL}
            </label>
            <Select
              id="home-filter-model"
              className={cn(
                fieldClass,
                "disabled:bg-page-tint! disabled:text-muted",
              )}
              value={model}
              disabled={!make}
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

        <label htmlFor="home-filter-search" className="sr-only">
          {HOME_HERO_FILTER_SEARCH}
        </label>
        <div className={cn(fieldClass, "flex items-center gap-2 border border-border-input bg-surface")}>
          <IconSearch className="shrink-0 text-subtle" width={16} height={16} />
          <input
            id="home-filter-search"
            value={queryText}
            onChange={(event) => setQueryText(event.target.value)}
            placeholder={HOME_HERO_FILTER_SEARCH}
            autoComplete="off"
            className="h-9 w-full border-0 bg-transparent text-[0.8125rem] outline-none placeholder:text-subtle"
          />
        </div>

        <Button type="submit" className="btn-compact w-full tabular-nums">
          Search {formatNumber(matchCount)} cars
        </Button>
      </form>
    </div>
  );
}
