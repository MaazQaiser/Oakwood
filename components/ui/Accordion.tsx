"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Accordion({
  title,
  children,
  defaultOpen = false,
  id,
  className,
  onOpen,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      id={id}
      className={cn("scroll-mt-24 border-b border-border py-3", className)}
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        setOpen(next);
        if (next) {
          onOpen?.();
        }
      }}
    >
      <summary className="cursor-pointer list-none text-label outline-none marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex min-h-11 items-center justify-between gap-4">
          {title}
          <span aria-hidden="true" className="text-subtle">
            {open ? "–" : "+"}
          </span>
        </span>
      </summary>
      <div className="space-y-2 pb-3 pt-1 text-body-sm text-muted">{children}</div>
    </details>
  );
}
