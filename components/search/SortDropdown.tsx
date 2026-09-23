"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Dialogs";
import { Radio, Select } from "@/components/forms/FormControls";
import { SORT_OPTIONS } from "@/components/search/constants";
import { IconChevron } from "@/components/ui/icons";
import type { SearchSort } from "@/lib/validation/search";
import { getSearchSort, type SearchQuery } from "@/lib/validation/search";
import { useState } from "react";

export function SortDropdown({
  query,
  onChange,
  newestLabel = "Newest cars",
}: {
  query: SearchQuery;
  onChange: (sort: SearchSort) => void;
  newestLabel?: string;
}) {
  const sort = getSearchSort(query);
  const options = SORT_OPTIONS.map((option) =>
    option.value === "newest" ? { ...option, label: newestLabel } : option,
  );

  return (
    <label className="relative hidden h-11 items-center lg:flex">
      <span className="pointer-events-none absolute left-4 text-sm text-[#667085]">
        Sort
      </span>
      <Select
        aria-label="Sort vehicles"
        value={sort}
        className="h-11! min-h-11! w-[22rem]! appearance-none rounded-[14px]! border border-[#d0d5dd] bg-white py-0 pr-10 pl-[3.4rem] text-sm! font-medium text-[#101828]"
        onChange={(event) => onChange(event.target.value as SearchSort)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}

export function MobileSortButton({
  query,
  onChange,
  newestLabel = "Newest cars",
}: {
  query: SearchQuery;
  onChange: (sort: SearchSort) => void;
  newestLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const sort = getSearchSort(query);
  const options = SORT_OPTIONS.map((option) =>
    option.value === "newest" ? { ...option, label: newestLabel } : option,
  );
  const current = options.find((option) => option.value === sort);

  return (
    <>
      <Button
        variant="secondary"
        className="h-11! min-h-11! flex-1 rounded-[14px]! px-4! lg:hidden"
        onClick={() => setOpen(true)}
      >
        Sort
        <IconChevron />
        <span className="sr-only">{current?.label}</span>
      </Button>
      <Modal open={open} title="Sort" onClose={() => setOpen(false)}>
        <fieldset>
          <legend className="sr-only">Sort vehicles</legend>
          {options.map((option) => (
            <Radio
              key={option.value}
              name="sort"
              label={option.label}
              value={option.value}
              checked={sort === option.value}
              onChange={() => {
                onChange(option.value);
                setOpen(false);
              }}
            />
          ))}
        </fieldset>
      </Modal>
    </>
  );
}
