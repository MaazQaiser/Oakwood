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
    <label className="hidden items-center gap-2 text-body-sm lg:flex">
      <span className="text-muted">Sort</span>
      <Select
        aria-label="Sort vehicles"
        value={sort}
        className="min-h-11 w-auto min-w-56"
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
        className="flex-1 lg:hidden"
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
