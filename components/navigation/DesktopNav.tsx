"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconChevron } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";
import { SectionMenu, sectionMenus } from "@/components/navigation/SectionMenu";
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

export function DesktopNav({ onDetailOpen }: { onDetailOpen?: (open: boolean) => void }) {
  const groups = visibleGroups(primaryNavigation);
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu(id: string) {
    clearCloseTimer();
    setOpenId(id);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpenId(null), 140);
  }

  useEffect(() => {
    onDetailOpen?.(openId !== null);
  }, [openId, onDetailOpen]);

  useEffect(() => {
    setOpenId(null);
  }, [pathname]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!openId) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenId(null);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const openGroup = groups.find((group) => group.id === openId);
  const openMenuContent = openId ? sectionMenus[openId] : undefined;

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="hidden min-w-0 flex-1 lg:block"
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!navRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpenId(null);
        }
      }}
    >
      <ul className="flex flex-nowrap items-center justify-center gap-3 xl:gap-6">
        {groups.map((group) => (
          <NavItem
            key={group.id}
            label={group.label}
            href={group.href ?? null}
            items={visibleItems(group.children)}
            pathname={pathname}
            open={openId === group.id}
            onOpen={() => openMenu(group.id)}
          />
        ))}
      </ul>
      {openGroup && openMenuContent ? (
        <div
          id="primary-section-menu"
          className="absolute inset-x-0 top-full z-[var(--oak-z-dropdown)] rounded-b-[14px] bg-[#ECF3F8] shadow-[0_18px_40px_rgba(16,40,72,0.12)]"
        >
          <Container width="wide" className="py-8">
            <SectionMenu
              menu={openMenuContent}
              pathname={pathname}
              labelledBy={`${openGroup.id}-menu-side`}
              onNavigate={() => setOpenId(null)}
            />
          </Container>
        </div>
      ) : null}
    </nav>
  );
}

function NavItem({
  label,
  href,
  items,
  pathname,
  open,
  onOpen,
}: {
  label: string;
  href: string | null;
  items: { id: string; label: string; href: string | null }[];
  pathname: string;
  open: boolean;
  onOpen: () => void;
}) {
  const current =
    isCurrentPath(pathname, href) ||
    items.some((item) => isCurrentPath(pathname, item.href));

  if (items.length === 0 && href) {
    return (
      <li className="shrink-0">
        <Link
          href={href}
          aria-current={current ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center whitespace-nowrap px-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-ink hover:text-black xl:text-[0.72rem] xl:tracking-[0.12em]",
            current && "underline decoration-ink underline-offset-8",
          )}
        >
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li className="shrink-0" onMouseEnter={onOpen}>
      <button
        type="button"
        className={cn(
          "inline-flex min-h-11 items-center gap-1 whitespace-nowrap px-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-ink hover:text-black xl:text-[0.72rem] xl:tracking-[0.12em]",
          (current || open) && "underline decoration-ink underline-offset-8",
        )}
        aria-expanded={open}
        aria-controls={open ? "primary-section-menu" : undefined}
        aria-haspopup="true"
        onClick={onOpen}
        onFocus={onOpen}
      >
        {label}
        <IconChevron className={cn("h-3 w-3 opacity-70", open && "rotate-180")} />
      </button>
    </li>
  );
}
