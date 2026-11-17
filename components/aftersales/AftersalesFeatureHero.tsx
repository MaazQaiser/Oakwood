import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { BreadcrumbItem } from "@/lib/seo";

export function AftersalesFeatureHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  bullets,
  primary,
  secondary,
  pill,
  upgradeLine,
  children,
  className,
}: {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: string;
  description: ReactNode;
  bullets?: string[];
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  pill?: string;
  upgradeLine?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative -mt-[calc(var(--oak-header-height)-0.75rem)] overflow-hidden bg-[#ECF3F8]",
        "px-[var(--oak-page-x)] pt-[calc(var(--oak-header-height)+2.5rem)] pb-14 text-ink",
        "lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:min-h-[18rem] lg:px-0 lg:pb-20",
        children ? "lg:pb-28" : null,
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-[var(--oak-width-wide)] lg:px-[var(--oak-page-x)]">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : null}

        {eyebrow ? (
          <div
            className={cn(
              "text-sm font-semibold text-primary-secondary",
              breadcrumbs?.length ? "mt-6" : "mt-0",
            )}
          >
            {eyebrow}
          </div>
        ) : null}

        <h1
          className={cn(
            "max-w-3xl text-[2.15rem] font-medium leading-[1.15em] tracking-[-0.03em] text-ink sm:text-[2.75rem]",
            eyebrow || breadcrumbs?.length ? "mt-4" : "mt-0",
          )}
        >
          {title}
        </h1>

        <div className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-[#8b95a3]">
          {description}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={primary.href}
            className="inline-flex min-h-14 items-center gap-3 self-start rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-white no-underline hover:bg-[#001c3d]"
          >
            <span className="text-button">{primary.label}</span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
              <IconArrow width={20} height={20} />
            </span>
          </Link>
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

        {bullets && bullets.length > 0 ? (
          <ul className="mt-8 flex list-none flex-col gap-3 p-0 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium text-[#3d4f63]">
                <IconCheck className="mt-0.5 shrink-0 text-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {pill ? (
          <p className="mt-8 inline-flex rounded-[14px] bg-white px-4 py-2 text-sm font-semibold text-[#002852] shadow-[0_8px_20px_rgba(16,40,72,0.06)]">
            {pill}
          </p>
        ) : null}

        {upgradeLine ? (
          <p className="mt-4 text-sm font-semibold text-primary-secondary">
            {upgradeLine}
          </p>
        ) : null}

        {children ? (
          <div className="relative z-20 mt-10 lg:mt-12 lg:mb-[-4.5rem]">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
