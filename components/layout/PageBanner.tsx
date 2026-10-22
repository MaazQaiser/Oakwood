"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { IconArrow } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { BreadcrumbItem } from "@/lib/seo";

const PageBannerCrumbs = createContext<BreadcrumbItem[] | undefined>(undefined);

export function PageBannerScope({
  breadcrumbs,
  children,
}: {
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
}) {
  return <PageBannerCrumbs.Provider value={breadcrumbs}>{children}</PageBannerCrumbs.Provider>;
}

const widthClass = {
  narrow: "max-w-[var(--oak-width-narrow)]",
  content: "max-w-[var(--oak-width-content)]",
  wide: "max-w-[var(--oak-width-wide)]",
} as const;

export function PageBanner({
  title,
  description,
  breadcrumbs,
  primary,
  secondary,
  actions,
  children,
  width = "wide",
  hideTitle = false,
}: {
  title: string;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  actions?: ReactNode;
  children?: ReactNode;
  width?: keyof typeof widthClass;
  hideTitle?: boolean;
}) {
  const scoped = useContext(PageBannerCrumbs);
  const crumbs = breadcrumbs ?? scoped;

  return (
    <section
      className={cn(
        "relative -mt-[calc(var(--oak-header-height)-0.75rem)] overflow-hidden bg-[#ECF3F8] px-6 pt-[calc(var(--oak-header-height)+1.75rem)] lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-[var(--oak-page-x)] lg:rounded-[32px] lg:px-[var(--oak-page-x)]",
        hideTitle ? "pb-6 lg:pb-7" : "pb-10 lg:pb-12",
      )}
    >
      <div className={cn("mx-auto w-full", widthClass[width])}>
        {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}
        {hideTitle ? (
          <h1 className="sr-only">{title}</h1>
        ) : (
          <h1
            className={cn(
              "max-w-3xl text-[2.15rem] font-medium leading-[1.15em] tracking-[-0.03em] text-ink sm:text-[2.75rem]",
              crumbs?.length ? "mt-5" : "mt-0",
            )}
          >
            {title}
          </h1>
        )}
        {description ? (
          <div className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#8b95a3]">{description}</div>
        ) : null}
        {actions ? <div className="mt-8">{actions}</div> : null}
        {!actions && (primary || secondary) ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {primary ? (
              <Link
                href={primary.href}
                className="inline-flex min-h-14 items-center gap-3 self-start rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-white no-underline hover:bg-[#001c3d]"
              >
                <span className="text-button">{primary.label}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
                  <IconArrow width={20} height={20} />
                </span>
              </Link>
            ) : null}
            {secondary ? (
              <Link
                href={secondary.href}
                className="inline-flex min-h-14 items-center gap-3 self-start rounded-[14px] bg-white py-1.5 pl-5 pr-1.5 text-[#002852] no-underline hover:bg-[#E7F1F8]"
              >
                <span className="text-button">{secondary.label}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#E7F1F8] text-[#002852]">
                  <IconArrow width={20} height={20} />
                </span>
              </Link>
            ) : null}
          </div>
        ) : null}
        {children ? (
          <div className={hideTitle ? "mt-4" : "mt-8"}>{children}</div>
        ) : null}
      </div>
    </section>
  );
}
