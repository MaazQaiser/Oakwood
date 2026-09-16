"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  financeCta,
  primaryNavigation,
  visibleGroups,
  visibleItems,
} from "@/config/navigation";
import { cn } from "@/lib/cn";

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const groups = visibleGroups(primaryNavigation);
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile">
      <div className="mb-6" onClick={onNavigate}>
        <Button href={financeCta.href} className="w-full">
          {financeCta.anonymousLabel}
        </Button>
      </div>
      <ul className="flex flex-col gap-4">
        {groups.map((group) => (
          <li key={group.id}>
            <p className="text-label">{group.label}</p>
            <ul className="mt-1">
              {group.href ? (
                <li>
                  <Link
                    href={group.href}
                    aria-current={isCurrentPath(pathname, group.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center text-body-sm",
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
                    <Link
                      href={item.href}
                      aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center text-body-sm",
                        isCurrentPath(pathname, item.href) && "text-primary",
                      )}
                      onClick={onNavigate}
                    >
                      {item.label}
                    </Link>
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
