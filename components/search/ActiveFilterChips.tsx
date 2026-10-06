"use client";

import { Chip } from "@/components/ui/Badge";
import { IconClose } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { formatPounds } from "@/lib/format/money";
import type { LockedFilters, SearchQuery } from "@/lib/validation/search";
import { splitFilterValues } from "@/lib/validation/search";
import {
  getLocationName,
  getMakeName,
  getModelName,
} from "@/lib/vehicles/labels";

export interface FilterChip {
  id: string;
  label: string;
  locked?: boolean;
  relaxed?: boolean;
  onRemove?: () => void;
}

function isRelaxed(
  relaxedKeys: Array<keyof SearchQuery>,
  keys: Array<keyof SearchQuery>,
) {
  return keys.some((key) => relaxedKeys.includes(key));
}

export function getFilterChips(
  query: SearchQuery,
  locked: LockedFilters,
  onRemove: (key: keyof SearchQuery, value?: string) => void,
  relaxedKeys: Array<keyof SearchQuery> = [],
): FilterChip[] {
  const chips: FilterChip[] = [];
  const structured =
    Boolean(query.make) ||
    Boolean(query.model) ||
    Boolean(query.colour) ||
    Boolean(query.fuel) ||
    Boolean(query.transmission) ||
    Boolean(query.body_style) ||
    Boolean(query.max_price) ||
    Boolean(query.monthly_max ?? query.monthly);

  if (query.q && !structured) {
    chips.push({
      id: "q",
      label: query.q,
      onRemove: () => onRemove("q"),
    });
  }

  const activeMake = query.make ?? locked.make;
  if (activeMake) {
    chips.push({
      id: "make",
      label: getMakeName(activeMake) ?? activeMake,
      locked: Boolean(locked.make),
      relaxed: isRelaxed(relaxedKeys, ["make"]),
      onRemove: locked.make ? undefined : () => onRemove("make"),
    });
  }

  if (query.model) {
    const modelName =
      getModelName(activeMake, query.model) ?? query.model;
    chips.push({
      id: "model",
      label: modelName,
      locked: Boolean(locked.model),
      relaxed: isRelaxed(relaxedKeys, ["model"]),
      onRemove: locked.model ? undefined : () => onRemove("model"),
    });
  }

  splitFilterValues(query.body_style).forEach((value) => {
    chips.push({
      id: `body-${value}`,
      label: value,
      relaxed: isRelaxed(relaxedKeys, ["body_style"]),
      onRemove: () => onRemove("body_style", value),
    });
  });

  splitFilterValues(query.fuel).forEach((value) => {
    chips.push({
      id: `fuel-${value}`,
      label: value,
      relaxed: isRelaxed(relaxedKeys, ["fuel"]),
      onRemove: () => onRemove("fuel", value),
    });
  });

  splitFilterValues(query.transmission).forEach((value) => {
    chips.push({
      id: `transmission-${value}`,
      label: value,
      relaxed: isRelaxed(relaxedKeys, ["transmission"]),
      onRemove: () => onRemove("transmission", value),
    });
  });

  splitFilterValues(query.location).forEach((value) => {
    chips.push({
      id: `location-${value}`,
      label: getLocationName(value) ?? value,
      locked: locked.location === value,
      relaxed: isRelaxed(relaxedKeys, ["location"]),
      onRemove:
        locked.location === value
          ? undefined
          : () => onRemove("location", value),
    });
  });

  splitFilterValues(query.colour).forEach((value) => {
    chips.push({
      id: `colour-${value}`,
      label: value,
      relaxed: isRelaxed(relaxedKeys, ["colour"]),
      onRemove: () => onRemove("colour", value),
    });
  });

  if (query.min_price || query.max_price) {
    chips.push({
      id: "price",
      label: `${query.min_price ? formatPounds(Number(query.min_price)) : "Any"} — ${query.max_price ? formatPounds(Number(query.max_price)) : "Any"}`,
      relaxed: isRelaxed(relaxedKeys, ["min_price", "max_price"]),
      onRemove: () => {
        onRemove("min_price");
        onRemove("max_price");
      },
    });
  }

  const monthlyMin = query.monthly_min;
  const monthlyMax = query.monthly_max ?? query.monthly;
  if (monthlyMin || monthlyMax) {
    chips.push({
      id: "monthly",
      label: `${monthlyMin ? formatPounds(Number(monthlyMin)) : "Any"}–${monthlyMax ? formatPounds(Number(monthlyMax)) : "Any"}/month`,
      relaxed: isRelaxed(relaxedKeys, ["monthly_min", "monthly_max", "monthly"]),
      onRemove: () => {
        onRemove("monthly_min");
        onRemove("monthly_max");
        onRemove("monthly");
      },
    });
  }

  if (query.min_mileage || query.max_mileage) {
    chips.push({
      id: "mileage",
      label: `${query.min_mileage ?? "0"} — ${query.max_mileage ?? "any"} miles`,
      relaxed: isRelaxed(relaxedKeys, ["min_mileage", "max_mileage"]),
      onRemove: () => {
        onRemove("min_mileage");
        onRemove("max_mileage");
      },
    });
  }

  if (query.min_year) {
    chips.push({
      id: "year",
      label: `From ${query.min_year}`,
      relaxed: isRelaxed(relaxedKeys, ["min_year", "max_year"]),
      onRemove: () => onRemove("min_year"),
    });
  }

  if (query.doors) {
    chips.push({
      id: "doors",
      label: `${query.doors} doors`,
      relaxed: isRelaxed(relaxedKeys, ["doors"]),
      onRemove: () => onRemove("doors"),
    });
  }

  if (query.seats) {
    chips.push({
      id: "seats",
      label: `${query.seats} seats`,
      relaxed: isRelaxed(relaxedKeys, ["seats"]),
      onRemove: () => onRemove("seats"),
    });
  }

  if (query.affordable === "1") {
    chips.push({
      id: "affordable",
      label: "Affordable to me",
      relaxed: isRelaxed(relaxedKeys, ["affordable"]),
      onRemove: () => onRemove("affordable"),
    });
  }

  if (query.need) {
    chips.push({
      id: "need",
      label: query.need.replace("-", " "),
      relaxed: isRelaxed(relaxedKeys, ["need"]),
      onRemove: () => onRemove("need"),
    });
  }

  return chips;
}

export function ActiveFilterChips({
  chips,
  onClearAll,
}: {
  chips: FilterChip[];
  onClearAll: () => void;
}) {
  const canClear = chips.some((chip) => Boolean(chip.onRemove));

  if (chips.length === 0 || !canClear) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          className={cn(
            "max-w-full gap-0.5 py-1 pl-3",
            chip.relaxed
              ? "border-dashed border-border bg-transparent text-muted"
              : "border-primary bg-primary-soft text-primary",
          )}
        >
          <span className="min-w-0 truncate text-body-sm">{chip.label}</span>
          {chip.onRemove ? (
            <button
              type="button"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-primary hover:bg-white/50"
              aria-label={
                chip.relaxed
                  ? `Remove ${chip.label} from search. Not applied to these results.`
                  : `Remove ${chip.label} filter`
              }
              onClick={chip.onRemove}
            >
              <IconClose width={14} height={14} />
            </button>
          ) : (
            <span className="w-1 shrink-0" aria-hidden />
          )}
        </Chip>
      ))}
      <button
        type="button"
        className="min-h-11 px-2 text-body-sm text-primary"
        onClick={onClearAll}
      >
        Clear all
      </button>
    </div>
  );
}
