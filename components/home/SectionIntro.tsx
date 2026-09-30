import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionIntro({
  eyebrow,
  heading,
  children,
  headingLevel = "h2",
  align = "left",
  action,
  eyebrowVariant = "caption",
}: {
  eyebrow: string;
  heading: string;
  children?: ReactNode;
  headingLevel?: "h2" | "h1";
  align?: "left" | "center";
  action?: ReactNode;
  eyebrowVariant?: "caption" | "pill";
}) {
  const HeadingTag = headingLevel;
  const centered = align === "center";
  const pill = eyebrowVariant === "pill";

  return (
    <header
      className={cn(
        centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        action && !centered
          ? "flex w-full max-w-none flex-col gap-4 md:flex-row md:items-end md:justify-between"
          : undefined,
      )}
    >
      <div className={cn(centered ? "mx-auto max-w-3xl" : undefined)}>
        <p
          className={cn(
            pill
              ? "inline-flex items-center gap-2 rounded-full bg-[#E7F1F8] px-4 py-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-[#002852] sm:text-[0.875rem]"
              : "text-caption text-primary",
          )}
        >
          {pill ? (
            <span className="h-1.5 w-1.5 rounded-full bg-[#002852]" aria-hidden="true" />
          ) : null}
          {eyebrow}
        </p>
        <HeadingTag className={headingLevel === "h1" ? "text-display mt-3" : "text-h2 mt-3"}>
          {heading}
        </HeadingTag>
        {children ? (
          <div className="mt-4 text-body text-muted">{children}</div>
        ) : null}
      </div>
      {action ? <div className={cn(centered && "mt-5")}>{action}</div> : null}
    </header>
  );
}
