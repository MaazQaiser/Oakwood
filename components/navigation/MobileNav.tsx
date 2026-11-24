"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  primaryNavigation,
  visibleGroups,
  visibleItems,
} from "@/config/navigation";
import { cn } from "@/lib/cn";

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href.startsWith("http")) {
    return false;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Menu type ~20% smaller than text-body-sm / text-label (0.875rem → 0.7rem). */
const menuFont = "text-[0.7rem] leading-snug";
const menuLabelFont = "text-[0.7rem] font-semibold leading-snug";

export function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const groups = visibleGroups(primaryNavigation);
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile">
      <ul className="flex flex-col gap-3.5">
        {groups.map((group) => (
          <li key={group.id}>
            <p className={menuLabelFont}>{group.label}</p>
            <ul className="mt-0.5">
              {group.href ? (
                <li>
                  <Link
                    href={group.href}
                    aria-current={isCurrentPath(pathname, group.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center",
                      menuFont,
                      isCurrentPath(pathname, group.href) && "text-primary",
                    )}
                    onClick={onNavigate}
                  >
                    View all
                  </Link>
                </li>
              ) : null}
              {visibleItems(group.children).map((item) =>
                item.href ? (
                  <li key={item.id}>
                    {item.external ? (
                      <a
                        href={item.href}
                        className={cn("flex min-h-10 items-center", menuFont)}
                        onClick={onNavigate}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-10 items-center",
                          menuFont,
                          isCurrentPath(pathname, item.href) && "text-primary",
                        )}
                        onClick={onNavigate}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ) : null,
              )}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
