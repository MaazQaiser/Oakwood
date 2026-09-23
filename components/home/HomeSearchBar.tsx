"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconSearch } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

const phrases = [
  "BMW under £300 a month",
  "Family SUV under £15,000",
  "Audi automatic",
  "Low mileage hatchback",
];

export function HomeSearchBar({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPlaceholder(phrases[0]);
      return;
    }
    if (focused || value) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        setPlaceholder(phrase.slice(0, charIndex));
        if (charIndex >= phrase.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1200);
          return;
        }
        timer = window.setTimeout(tick, 48);
        return;
      }

      charIndex -= 1;
      setPlaceholder(phrase.slice(0, Math.max(charIndex, 0)));
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timer = window.setTimeout(tick, 280);
        return;
      }
      timer = window.setTimeout(tick, 28);
    };

    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, [focused, reducedMotion, value]);

  const showGhost = !value && !focused;

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
        <div className="relative min-w-0 flex-1">
          <input
            id="home-search"
            name="q"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? "Search for a car" : ""}
            autoComplete="off"
            className="h-11 w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-[#8b95a3]"
          />
          {showGhost ? (
            <span
              className="pointer-events-none absolute inset-0 flex items-center truncate text-sm text-[#8b95a3]"
              aria-hidden="true"
            >
              {placeholder}
              {reducedMotion ? null : (
                <span className="ml-px inline-block h-4 w-px animate-pulse bg-[#8b95a3]" />
              )}
            </span>
          ) : null}
        </div>
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
