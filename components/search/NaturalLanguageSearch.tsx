"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/FormControls";
import { IconSearch } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { getVanSearchEvents } from "@/features/vans/analytics";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { VehicleCategory } from "@/types/vehicle";

export function NaturalLanguageSearch({
  action = routes.search,
  defaultValue,
  hint = "Try “BMW automatic under £300 a month” or “Family SUV under £15,000”.",
  category = "car",
}: {
  action?: string;
  defaultValue?: string;
  hint?: string;
  category?: VehicleCategory;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const inputId = category === "van" ? "van-search" : "vehicle-search";

  return (
    <form
      action={action}
      method="get"
      role="search"
      className="mt-6"
      onSubmit={() => {
        trackEvent(analyticsEvents.searchSubmitted, { q: value, category });
        const vanEvents = getVanSearchEvents(category);
        if (vanEvents) {
          trackEvent(vanEvents.searchStarted, { q: value });
        }
      }}
    >
      <div className="flex flex-col gap-2 rounded-3xl bg-surface p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full sm:p-1.5">
        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <label htmlFor={inputId} className="sr-only">
            What are you looking for?
          </label>
          <SearchInput
            id={inputId}
            name="q"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="What are you looking for?"
            className="h-12 rounded-full border-0 pl-11 shadow-none"
            autoComplete="off"
          />
        </div>
        <Button type="submit" className="h-12 sm:min-w-28">
          Search
        </Button>
      </div>
      <p className="mt-2 text-caption text-muted">{hint}</p>
    </form>
  );
}
