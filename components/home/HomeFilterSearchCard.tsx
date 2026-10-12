"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select } from "@/components/forms/FormControls";
import { MONTHLY_OPTIONS, PRICE_OPTIONS } from "@/components/search/constants";
import { Button } from "@/components/ui/Button";
import { IconSearch } from "@/components/ui/icons";
import { getSearchUrl, routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatNumber, formatPounds } from "@/lib/format/money";
import {
  HOME_HERO_CHIP_AUTOMATIC,
  HOME_HERO_CHIP_SEVEN,
  HOME_HERO_CHIP_SUV,
  HOME_HERO_CHIP_UNDER_10K,
  HOME_HERO_FILTER_HEADING,
  HOME_HERO_FILTER_MAX_MONTHLY,
  HOME_HERO_FILTER_MAX_PRICE,
  HOME_HERO_FILTER_MONTHLY,
  HOME_HERO_FILTER_PRICE,
  HOME_HERO_FILTER_SEARCH,
  HOME_HERO_FILTER_SELECT_MAKE,
  HOME_HERO_FILTER_SELECT_MODEL,
  HOME_HERO_PX_QUOTE,
} from "@/lib/home/copy";
import { getMakes, getModels } from "@/lib/vehicles/labels";
import { listVehicles } from "@/lib/vehicles/query";
import { filterVehicles } from "@/lib/vehicles/search";
import type { SearchQuery } from "@/lib/validation/search";

type PriceMode = "monthly" | "total";

const fieldClass = "min-h-10! w-full rounded-[12px]! px-3 text-[0.8125rem]!";

export function HomeFilterSearchCard({ className }: { className?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<PriceMode>("monthly");
  const [queryText, setQueryText] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [monthlyMax, setMonthlyMax] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [bodyStyle, setBodyStyle] = useState("");
  const [transmission, setTransmission] = useState("");
  const [seats, setSeats] = useState("");

  const makes = getMakes("car");
  const models = make ? getModels(make, "car") : [];
  const under10k = maxPrice === "10000";

  const query = useMemo((): SearchQuery => {
    const next: SearchQuery = {};
    if (queryText.trim()) next.q = queryText.trim();
    if (make) next.make = make;
    if (model) next.model = model;
    if (bodyStyle) next.body_style = bodyStyle;
    if (transmission) next.transmission = transmission;
    if (seats) next.seats = seats;
    if (mode === "total" && maxPrice) next.max_price = maxPrice;
    if (mode === "monthly" && monthlyMax) next.monthly_max = monthlyMax;
    return next;
  }, [
    queryText,
    make,
    model,
    bodyStyle,
    transmission,
    seats,
    mode,
    maxPrice,
    monthlyMax,
  ]);

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
      <h1 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-ink">
        {HOME_HERO_FILTER_HEADING}
      </h1>

      <form
        className="mt-5 flex flex-col gap-3"
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

        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip
            label={HOME_HERO_CHIP_UNDER_10K}
            pressed={under10k}
            onClick={() => {
              if (under10k) {
                setMaxPrice("");
                return;
              }
              setMode("total");
              setMaxPrice("10000");
            }}
          />
          <Chip
            label={HOME_HERO_CHIP_SUV}
            pressed={bodyStyle === "SUV"}
            onClick={() => setBodyStyle(bodyStyle === "SUV" ? "" : "SUV")}
          />
          <Chip
            label={HOME_HERO_CHIP_AUTOMATIC}
            pressed={transmission === "Automatic"}
            onClick={() =>
              setTransmission(transmission === "Automatic" ? "" : "Automatic")
            }
          />
          <Chip
            label={HOME_HERO_CHIP_SEVEN}
            pressed={seats === "7"}
            onClick={() => setSeats(seats === "7" ? "" : "7")}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
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
                {mode === "monthly"
                  ? HOME_HERO_FILTER_MAX_MONTHLY
                  : HOME_HERO_FILTER_MAX_PRICE}
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
              <option value="">{HOME_HERO_FILTER_SELECT_MAKE}</option>
              {makes.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

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
          <option value="">{HOME_HERO_FILTER_SELECT_MODEL}</option>
          {models.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </Select>

        <Button type="submit" className="btn-compact w-full tabular-nums">
          Search {formatNumber(matchCount)} cars
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center">
        <Link
          href={routes.partExchange}
          className="text-sm font-semibold text-primary-secondary no-underline hover:underline"
        >
          {HOME_HERO_PX_QUOTE}
        </Link>
      </div>
    </div>
  );
}

function Chip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        pressed
          ? "border-primary bg-primary text-white"
          : "border-border-input bg-white text-ink",
      )}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
