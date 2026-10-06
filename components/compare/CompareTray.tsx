"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconChevron } from "@/components/ui/icons";
import { getCompareUrl, routes } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { compareCopy } from "@/lib/compare/copy";
import { cn } from "@/lib/cn";

export function CompareTray({
  variant,
}: {
  variant: "header" | "mobile";
}) {
  const pathname = usePathname();
  const { count, stockIds, ready } = useCompare();
  const hidden =
    !ready ||
    count === 0 ||
    pathname === routes.compare ||
    pathname === routes.home;
  const href = getCompareUrl(stockIds);

  useEffect(() => {
    if (variant !== "mobile") {
      return;
    }
    const root = document.documentElement;
    if (hidden) {
      root.style.setProperty("--oak-compare-offset", "0px");
      return;
    }
    root.style.setProperty(
      "--oak-compare-offset",
      "calc(3.5rem + env(safe-area-inset-bottom))",
    );
    return () => {
      root.style.setProperty("--oak-compare-offset", "0px");
    };
  }, [hidden, variant]);

  if (hidden) {
    return null;
  }

  function onClick() {
    trackEvent(analyticsEvents.compareTrayClicked, { count });
  }

  if (variant === "header") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="hidden h-10 max-w-[12rem] items-center rounded-[14px] bg-primary px-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white tabular-nums no-underline hover:bg-primary-hover lg:inline-flex"
      >
        {compareCopy.trayLabel(count)}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-[32] border-t border-border bg-page-tint px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden",
        "bottom-[var(--oak-consent-offset,0px)]",
      )}
    >
      <Link
        href={href}
        onClick={onClick}
        className="mx-auto flex h-11 max-w-[var(--oak-width-wide)] items-center justify-between rounded-[14px] bg-primary px-4 text-sm font-semibold text-white tabular-nums no-underline hover:bg-primary-hover"
      >
        <span>{compareCopy.trayMobile(count)}</span>
        <IconChevron className="-rotate-90" />
      </Link>
    </div>
  );
}
