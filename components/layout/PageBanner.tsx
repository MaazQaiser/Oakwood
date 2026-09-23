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
  eyebrow,
  title,
  description,
  breadcrumbs,
  primary,
  secondary,
  actions,
  children,
  width = "wide",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  actions?: ReactNode;
  children?: ReactNode;
  width?: keyof typeof widthClass;
}) {
  const scoped = useContext(PageBannerCrumbs);
  const crumbs = breadcrumbs ?? scoped;

  return (
    <section className="relative -mt-[calc(var(--oak-header-height)-0.75rem)] mx-3 overflow-hidden rounded-[32px] bg-[#ECF3F8] px-[var(--oak-page-x)] pb-10 pt-[calc(var(--oak-header-height)+1.75rem)] sm:mx-4 lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-6 lg:pb-12">
      <div className={cn("mx-auto w-full", widthClass[width])}>
        {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}
        {eyebrow ? (
          <p className={cn("text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#002852]", crumbs?.length ? "mt-5" : undefined)}>
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-[2.15rem] font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.75rem]">
          {title}
        </h1>
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
                className="inline-flex h-14 items-center self-start rounded-[14px] bg-white px-5 text-button text-[#002852] no-underline hover:bg-[#E7F1F8]"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
