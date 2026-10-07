"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconSearch } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { HOME_SEARCH_PLACEHOLDER } from "@/lib/home/copy";

export function HomeSearchBar({ className }: { className?: string }) {
  const [value, setValue] = useState("");

  return (
    <form
      action={routes.search}
      method="get"
      role="search"
      className={className}
      onSubmit={() => {
        trackEvent(analyticsEvents.searchSubmitted, { q: value, category: "car" });
      }}
    >
      <label htmlFor="home-search" className="sr-only">
        Search for a car
      </label>
      <div className="flex items-center gap-2 rounded-[14px] bg-white py-1.5 pl-4 pr-1.5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
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
          type="submit"
          className="h-11 w-11 shrink-0 rounded-[14px]! bg-[#002852]! px-0! hover:bg-[#001c3d]!"
        >
          <IconSearch className="text-white" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
