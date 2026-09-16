"use client";

import { Chip } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { IconClose } from "@/components/ui/icons";
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
  onRemove?: () => void;
}

export function getFilterChips(
  query: SearchQuery,
  locked: LockedFilters,
  onRemove: (key: keyof SearchQuery, value?: string) => void,
): FilterChip[] {
  const chips: FilterChip[] = [];

  if (query.q) {
    chips.push({
      id: "q",
      label: query.q,
      onRemove: () => onRemove("q"),
    });
  }

  if (query.make) {
    chips.push({
      id: "make",
      label: `Make: ${getMakeName(query.make)}`,
      locked: Boolean(locked.make),
      onRemove: locked.make ? undefined : () => onRemove("make"),
    });
  }

  if (query.model) {
    chips.push({
      id: "model",
      label: getModelName(query.make, query.model) ?? query.model,
      locked: Boolean(locked.model),
      onRemove: locked.model ? undefined : () => onRemove("model"),
    });
  }

  splitFilterValues(query.body_style).forEach((value) => {
    chips.push({
      id: `body-${value}`,
      label: value,
      onRemove: () => onRemove("body_style", value),
    });
  });

  splitFilterValues(query.fuel).forEach((value) => {
    chips.push({
      id: `fuel-${value}`,
      label: value,
      onRemove: () => onRemove("fuel", value),
    });
  });

  splitFilterValues(query.transmission).forEach((value) => {
    chips.push({
      id: `transmission-${value}`,
      label: value,
      onRemove: () => onRemove("transmission", value),
    });
  });

  splitFilterValues(query.location).forEach((value) => {
    chips.push({
      id: `location-${value}`,
      label: getLocationName(value) ?? value,
      locked: locked.location === value,
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
      onRemove: () => onRemove("colour", value),
    });
  });

  if (query.min_price || query.max_price) {
    chips.push({
      id: "price",
      label: `${query.min_price ? formatPounds(Number(query.min_price)) : "Any"} — ${query.max_price ? formatPounds(Number(query.max_price)) : "Any"}`,
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
      onRemove: () => onRemove("min_year"),
    });
  }

  if (query.doors) {
    chips.push({
      id: "doors",
      label: `${query.doors} doors`,
      onRemove: () => onRemove("doors"),
    });
  }

  if (query.seats) {
    chips.push({
      id: "seats",
      label: `${query.seats} seats`,
      onRemove: () => onRemove("seats"),
    });
  }

  if (query.affordable === "1") {
    chips.push({
      id: "affordable",
      label: "Affordable to me",
      onRemove: () => onRemove("affordable"),
    });
  }

  if (query.need) {
    chips.push({
      id: "need",
      label: query.need.replace("-", " "),
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
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip key={chip.id} className="max-w-full gap-1 border-primary bg-primary-soft pr-1 text-primary">
          <span className="min-w-0 truncate">{chip.label}</span>
          {chip.onRemove ? (
            <IconButton
              label={`Remove ${chip.label} filter`}
              className="min-h-11 min-w-11 shrink-0"
              onClick={chip.onRemove}
            >
              <IconClose width={14} height={14} />
            </IconButton>
          ) : null}
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
