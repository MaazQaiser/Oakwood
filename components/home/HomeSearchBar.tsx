"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/forms/FormControls";
import { MONTHLY_OPTIONS } from "@/components/search/constants";
import { Button } from "@/components/ui/Button";
import { IconFilters, IconSearch } from "@/components/ui/icons";
import { getSearchUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPounds } from "@/lib/format/money";
import {
  HOME_HERO_FILTERS,
  HOME_HERO_FILTER_MAX_MONTHLY,
  HOME_HERO_FILTER_SELECT_MAKE,
  HOME_HERO_FILTER_SELECT_MODEL,
  HOME_SEARCH_PLACEHOLDER,
} from "@/lib/home/copy";
import type { SearchQuery } from "@/lib/validation/search";
import { getMakes, getModels } from "@/lib/vehicles/labels";

const fieldClass =
  "min-h-9! w-full rounded-full! border-[#D9E1E8]! bg-white! px-2.5! pr-7! text-[0.6875rem]! font-medium text-ink!";

export function HomeSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [monthlyMax, setMonthlyMax] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makes = getMakes("car");
  const models = getModels(make || undefined, "car");

  const query = useMemo((): SearchQuery => {
    const next: SearchQuery = {};
    if (value.trim()) next.q = value.trim();
    if (make) next.make = make;
    if (model) next.model = model;
    if (monthlyMax) next.monthly_max = monthlyMax;
    return next;
  }, [value, make, model, monthlyMax]);

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
      <label htmlFor="home-search" className="sr-only">
        Search for a car
      </label>
      <div className="rounded-[14px] bg-white py-1.5 pl-4 pr-1.5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
        <div className="flex items-center gap-2">
          <input
            id="home-search"
            name="q"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={HOME_SEARCH_PLACEHOLDER}
            autoComplete="off"
            className="h-11 w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-[#8b95a3]"
          />
          <Button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="home-search-filters"
            className="h-11 w-11 shrink-0 rounded-[14px]! bg-[#002852]! px-0! text-white! hover:bg-[#001c3d]!"
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
          </Button>
          <Button
            type="submit"
            className="h-11 w-11 shrink-0 rounded-[14px]! bg-[#002852]! px-0! hover:bg-[#001c3d]!"
          >
            <IconSearch className="text-white" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {filtersOpen ? (
          <div
            id="home-search-filters"
            className="mt-3 grid grid-cols-3 gap-2 border-t border-border pr-2.5 pt-3"
          >
            <div className="min-w-0">
              <label htmlFor="home-search-budget" className="sr-only">
                {HOME_HERO_FILTER_MAX_MONTHLY}
              </label>
              <Select
                id="home-search-budget"
                className={cn(fieldClass, "tabular-nums")}
                value={monthlyMax}
                onChange={(event) => setMonthlyMax(event.target.value)}
              >
                <option value="">{HOME_HERO_FILTER_MAX_MONTHLY}</option>
                {MONTHLY_OPTIONS.map((amount) => (
                  <option key={amount} value={amount}>
                    {formatPounds(amount)} a month
                  </option>
                ))}
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
      </div>
    </form>
  );
}
