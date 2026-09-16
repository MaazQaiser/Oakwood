"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <span
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex"
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-[var(--oak-z-dropdown)] mb-2 -translate-x-1/2",
          "whitespace-nowrap rounded-md bg-ink px-2 py-1 text-caption text-white shadow-sm",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {label}
      </span>
    </span>
  );
}
