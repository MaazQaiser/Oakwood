"use client";

import { cn } from "@/lib/cn";

export function ApplyStepper({
  label,
  time,
  segments,
}: {
  label: string;
  time?: string;
  segments: { id: string; fill: number }[];
}) {
  return (
    <nav aria-label="Application progress" className="relative z-20 bg-page pb-3">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-label">{label}</p>
        {time ? <p className="text-caption text-muted">{time}</p> : null}
      </div>
      <ol className="mt-3 flex gap-1.5">
        {segments.map((segment) => (
          <li
            key={segment.id}
            aria-hidden="true"
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${Math.round(Math.min(1, Math.max(0, segment.fill)) * 100)}%` }}
            />
          </li>
        ))}
      </ol>
      <p className="sr-only">
        {label}
        {time ? `. ${time}` : ""}
      </p>
    </nav>
  );
}

export function ApplyChoiceList({
  name,
  labelledBy,
  options,
  value,
  onSelect,
}: {
  name: string;
  labelledBy?: string;
  options: { value: string; label: string; quiet?: boolean }[];
  value?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-col gap-3">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            name={name}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex min-h-14 w-full items-center rounded-xl border px-4 py-3 text-left text-body",
              option.quiet && "text-body-sm",
              selected
                ? "border-primary bg-primary-soft text-ink"
                : option.quiet
                  ? "border-dashed border-border-strong bg-transparent text-muted hover:border-primary hover:text-ink"
                  : "border-border bg-surface hover:border-border-strong",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
