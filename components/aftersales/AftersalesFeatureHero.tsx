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
        "relative -mt-[calc(var(--oak-header-height)-0.75rem)] overflow-hidden",
        "bg-[radial-gradient(80%_70%_at_100%_0%,rgba(0,156,224,0.28)_0%,transparent_55%),linear-gradient(145deg,#001526_0%,#002852_48%,#0a3a6b_100%)]",
        "px-[var(--oak-page-x)] pt-[calc(var(--oak-header-height)+2rem)] pb-16 text-white",
        "lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:px-0 lg:pb-20",
        children ? "lg:pb-28" : null,
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-[var(--oak-width-wide)] lg:px-[var(--oak-page-x)]">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="[&_a]:text-white/75 [&_a:hover]:text-white [&_nav]:text-white/60 [&_span]:text-white">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}

        {eyebrow ? (
          <div className={cn("oak-eyebrow text-white/70", breadcrumbs?.length ? "mt-6" : "mt-0")}>
            {eyebrow}
          </div>
        ) : null}

        <h1
          className={cn(
            "max-w-3xl text-[2.2rem] font-semibold leading-[1.12em] tracking-[-0.03em] sm:text-[2.85rem]",
            eyebrow || breadcrumbs?.length ? "mt-4" : "mt-0",
          )}
        >
          {title}
        </h1>

        <div className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/80">
          {description}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={primary.href}
            className="inline-flex min-h-14 items-center gap-3 self-start rounded-[14px] bg-white py-1.5 pl-5 pr-1.5 text-[#002852] no-underline hover:bg-[#E7F1F8]"
          >
            <span className="text-button">{primary.label}</span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#E7F1F8] text-[#002852]">
              <IconArrow width={20} height={20} />
            </span>
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex min-h-14 items-center gap-3 self-start rounded-[14px] border border-white/35 bg-transparent py-1.5 pl-5 pr-1.5 text-white no-underline hover:bg-white/10"
            >
              <span className="text-button">{secondary.label}</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white/15 text-white">
                <IconArrow width={20} height={20} />
              </span>
            </Link>
          ) : null}
        </div>

        {bullets && bullets.length > 0 ? (
          <ul className="mt-8 flex list-none flex-col gap-3 p-0 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium text-white/90">
                <IconCheck className="mt-0.5 shrink-0 text-[#8EBFDF]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {pill ? (
          <p className="mt-8 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
            {pill}
          </p>
        ) : null}

        {upgradeLine ? (
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#8EBFDF]">
            {upgradeLine}
          </p>
        ) : null}

        {children ? <div className="relative z-20 mt-10 lg:mt-12 lg:mb-[-4.5rem]">{children}</div> : null}
      </div>
    </section>
  );
}
