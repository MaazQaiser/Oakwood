"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { IconChevron } from "@/components/ui/icons";
import {
  primaryNavigation,
  visibleGroups,
  visibleItems,
} from "@/config/navigation";
import { cn } from "@/lib/cn";

function isCurrentPath(pathname: string, href: string | null): boolean {
  if (!href) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const groups = visibleGroups(primaryNavigation);
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <nav aria-label="Primary" className="hidden min-w-0 lg:block">
      <ul className="flex flex-nowrap items-center gap-0.5">
        {groups.map((group) => (
          <NavDropdown
            key={group.id}
            label={group.label}
            href={group.href ?? null}
            items={visibleItems(group.children)}
            pathname={pathname}
            open={openId === group.id}
            onOpenChange={(next) => setOpenId(next ? group.id : null)}
          />
        ))}
      </ul>
    </nav>
  );
}

function NavDropdown({
  label,
  href,
  items,
  pathname,
  open,
  onOpenChange,
}: {
  label: string;
  href: string | null;
  items: { id: string; label: string; href: string | null }[];
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const hasMenu = items.length > 0;

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open, onOpenChange]);

  const current =
    isCurrentPath(pathname, href) ||
    items.some((item) => isCurrentPath(pathname, item.href));

  if (!hasMenu && href) {
    return (
      <li className="shrink-0">
        <Link
          href={href}
          aria-current={current ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2.5 text-label hover:bg-page 2xl:px-3",
            current ? "bg-primary-soft text-primary" : "text-ink",
          )}
        >
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className={cn(
          "inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-label hover:bg-page 2xl:px-3",
          current ? "bg-primary-soft text-primary" : "text-ink",
        )}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <IconChevron className={cn(open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          id={menuId}
          className="absolute left-0 top-full z-[var(--oak-z-dropdown)] min-w-48 rounded-2xl border border-border bg-surface p-2 shadow-md"
        >
          {href ? (
            <li>
              <Link
                href={href}
                aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-body-sm hover:bg-page",
                  isCurrentPath(pathname, href) && "bg-primary-soft text-primary",
                )}
                onClick={() => onOpenChange(false)}
              >
                View all
              </Link>
            </li>
          ) : null}
          {items.map((item) =>
            item.href ? (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-body-sm hover:bg-page",
                    isCurrentPath(pathname, item.href) && "bg-primary-soft text-primary",
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </li>
  );
}
