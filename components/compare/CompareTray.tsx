"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { IconButton } from "@/components/ui/Button";
import { IconClose, IconHeart } from "@/components/ui/icons";
import { getCompareUrl, routes } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { resolveCompareVehicles } from "@/lib/compare/catalog";
import { COMPARE_MAX, COMPARE_MIN_FOR_TABLE, compareCopy } from "@/lib/compare/copy";
import { cn } from "@/lib/cn";

export function CompareTray({
  variant,
}: {
  variant: "header" | "mobile";
}) {
  const trayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { count, stockIds, ready, remove } = useCompare();
  const hidden =
    !ready ||
    count === 0 ||
    pathname === routes.compare ||
    pathname.startsWith(`${routes.deal}/`);
  const vehicles = resolveCompareVehicles(stockIds);
  const canCompare = count >= COMPARE_MIN_FOR_TABLE;
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
    const tray = trayRef.current;
    const apply = () => {
      const height = tray?.offsetHeight ?? 0;
      root.style.setProperty("--oak-compare-offset", height > 0 ? `${height}px` : "0px");
    };
    apply();
    const observer = tray ? new ResizeObserver(apply) : null;
    if (tray) {
      observer?.observe(tray);
    }
    return () => {
      observer?.disconnect();
      root.style.setProperty("--oak-compare-offset", "0px");
    };
  }, [hidden, variant, count]);

  if (hidden) {
    return null;
  }

  function onCompareClick() {
    trackEvent(analyticsEvents.compareTrayClicked, { count });
  }

  if (variant === "header") {
    return (
      <div className="hidden items-center gap-2 lg:flex">
        <div className="flex items-center -space-x-2">
          {vehicles.slice(0, COMPARE_MAX).map((vehicle) => (
            <div
              key={vehicle.stockId}
              className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-page bg-page-tint"
              title={`${vehicle.make} ${vehicle.model}`}
            >
              <Image
                src={vehicle.image ?? "/images/vehicle-placeholder.svg"}
                alt=""
                fill
                sizes="36px"
                unoptimized={(vehicle.image ?? "").endsWith(".svg")}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {canCompare ? (
          <Link
            href={href}
            onClick={onCompareClick}
            className="inline-flex h-10 max-w-[13rem] items-center gap-2 rounded-[14px] bg-primary px-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white tabular-nums no-underline hover:bg-primary-hover"
          >
            <IconHeart filled className="text-white" width={16} height={16} />
            {compareCopy.trayLabel(count)}
          </Link>
        ) : (
          <span
            className="inline-flex h-10 items-center rounded-[14px] bg-page-tint px-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary tabular-nums"
            title={compareCopy.compareDisabled}
          >
            {compareCopy.trayLabel(count)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={trayRef}
      className={cn(
        "fixed inset-x-0 z-[28] border-t border-border bg-surface px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden",
        "bottom-[var(--oak-consent-offset,0px)]",
      )}
      role="region"
      aria-label={compareCopy.trayLabel(count)}
    >
      <div className="mx-auto flex max-w-[var(--oak-width-wide)] flex-col gap-2">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.stockId}
              className="flex shrink-0 items-center gap-2 rounded-full bg-page-tint py-1 pl-1 pr-2"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-page">
                <Image
                  src={vehicle.image ?? "/images/vehicle-placeholder.svg"}
                  alt=""
                  fill
                  sizes="32px"
                  unoptimized={(vehicle.image ?? "").endsWith(".svg")}
                  className="object-cover"
                />
              </div>
              <span className="max-w-[5.5rem] truncate text-caption font-semibold text-ink">
                {vehicle.make} {vehicle.model}
              </span>
              <IconButton
                label={`${compareCopy.remove}: ${vehicle.make} ${vehicle.model}`}
                className="min-h-8! min-w-8! text-muted"
                onClick={() => remove(vehicle.stockId)}
              >
                <IconClose width={14} height={14} />
              </IconButton>
            </div>
          ))}
        </div>
        {canCompare ? (
          <Link
            href={href}
            onClick={onCompareClick}
            className="flex h-11 items-center justify-between rounded-[14px] bg-primary px-4 text-sm font-semibold text-white tabular-nums no-underline hover:bg-primary-hover"
          >
            <span>{compareCopy.trayMobile(count)}</span>
            <span className="text-caption font-medium text-white/85">
              {compareCopy.trayHint(count)}
            </span>
          </Link>
        ) : (
          <p className="flex h-11 items-center justify-between rounded-[14px] bg-page-tint px-4 text-sm font-semibold text-ink tabular-nums">
            <span>{compareCopy.trayMobile(count)}</span>
            <span className="text-caption font-medium text-muted">
              {compareCopy.trayHint(count)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
