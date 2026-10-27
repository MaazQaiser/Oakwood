import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionIntro({
  heading,
  children,
  headingLevel = "h2",
  align = "left",
  action,
  headingClassName = "text-navy",
  bodyClassName = "text-muted",
}: {
  heading: ReactNode;
  children?: ReactNode;
  headingLevel?: "h2" | "h1";
  align?: "left" | "center";
  action?: ReactNode;
  headingClassName?: string;
  bodyClassName?: string;
}) {
  const HeadingTag = headingLevel;
  const centered = align === "center";

  return (
    <header
      className={cn(
        // Mobile: always left-aligned so headings share one starting edge.
        // Centered layouts only apply from md up.
        centered
          ? "max-w-3xl text-left md:mx-auto md:text-center"
          : "max-w-3xl text-left",
        action && !centered
          ? "flex w-full max-w-none flex-col gap-4 md:flex-row md:items-end md:justify-between"
          : undefined,
      )}
    >
      <div className={cn(centered && "md:mx-auto md:max-w-3xl")}>
        <HeadingTag
          className={cn(
            headingLevel === "h1" ? "text-display" : "text-h2",
            headingClassName,
          )}
        >
          {heading}
        </HeadingTag>
        {children ? (
          <div className={cn("mt-4 text-body", bodyClassName)}>{children}</div>
        ) : null}
      </div>
      {action ? (
        <div className={cn(centered && "mt-5 md:text-center")}>{action}</div>
      ) : null}
    </header>
  );
}
