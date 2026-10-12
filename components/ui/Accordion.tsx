"use client";

import { useState, type ReactNode } from "react";
import { IconChevron } from "@/components/ui/icons";
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
      className={cn(
        "scroll-mt-24 border-b border-border py-1 last:border-b-0",
        className,
      )}
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        setOpen(next);
        if (next) {
          onOpen?.();
        }
      }}
    >
      <summary
        className={cn(
          "cursor-pointer list-none text-label text-ink outline-none marker:content-none [&::-webkit-details-marker]:hidden",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        <span className="flex min-h-11 items-center justify-between gap-4">
          {title}
          <IconChevron
            aria-hidden="true"
            className={cn(
              "shrink-0 text-subtle transition-transform",
              open && "rotate-180 text-ink",
            )}
          />
        </span>
      </summary>
      <div className="space-y-2 pb-4 pt-1 text-body-sm text-muted">{children}</div>
    </details>
  );
}
