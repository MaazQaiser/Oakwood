import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionIntro({
  heading,
  children,
  headingLevel = "h2",
  align = "left",
  action,
  headingClassName = "text-oakwood",
  bodyClassName = "text-muted",
}: {
  heading: string;
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
        centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        action && !centered
          ? "flex w-full max-w-none flex-col gap-4 md:flex-row md:items-end md:justify-between"
          : undefined,
      )}
    >
      <div className={cn(centered ? "mx-auto max-w-3xl" : undefined)}>
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
      {action ? <div className={cn(centered && "mt-5")}>{action}</div> : null}
    </header>
  );
}
