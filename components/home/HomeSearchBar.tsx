"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconSearch } from "@/components/ui/icons";
import { MONTHLY_OPTIONS } from "@/components/search/constants";
import { routes } from "@/config/routes";
import { formatPounds } from "@/lib/format/money";
import { getMakes, getModels } from "@/lib/vehicles/labels";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

const pillSelectClass =
  "h-12 w-full min-w-0 appearance-none border-0 bg-transparent px-4 text-body text-ink outline-none focus-visible:outline-none disabled:text-subtle";

export function HomeSearchBar() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const makes = getMakes("car");
  const models = getModels(make || undefined, "car");

  return (
    <form
      action={routes.search}
      method="get"
      role="search"
      className="mx-auto w-full max-w-3xl"
      onSubmit={() => {
        trackEvent(analyticsEvents.searchSubmitted, {
          make,
          model,
          category: "car",
        });
      }}
    >
      <div className="flex w-full flex-col gap-2 rounded-3xl bg-surface p-2 shadow-md md:flex-row md:items-center md:rounded-full md:p-1.5">
        <label className="sr-only" htmlFor="home-make">
          Make
        </label>
        <select
          id="home-make"
          name="make"
          value={make}
          onChange={(event) => {
            setMake(event.target.value);
            setModel("");
          }}
          className={pillSelectClass}
        >
          <option value="">Any make</option>
          {makes.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <span className="hidden h-8 w-px bg-border md:block" aria-hidden="true" />
        <label className="sr-only" htmlFor="home-model">
          Model
        </label>
        <select
          id="home-model"
          name="model"
          value={model}
          disabled={!make}
          onChange={(event) => setModel(event.target.value)}
          className={pillSelectClass}
        >
          <option value="">Any model</option>
          {models.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <span className="hidden h-8 w-px bg-border md:block" aria-hidden="true" />
        <label className="sr-only" htmlFor="home-monthly">
          Monthly budget
        </label>
        <select id="home-monthly" name="monthly_max" className={pillSelectClass} defaultValue="">
          <option value="">Any monthly</option>
          {MONTHLY_OPTIONS.map((amount) => (
            <option key={amount} value={amount}>
              Up to {formatPounds(amount)}/month
            </option>
          ))}
        </select>
        <Button type="submit" className="h-12 w-full shrink-0 md:h-12 md:w-12 md:px-0">
          <IconSearch className="text-white" />
          <span className="md:sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
