import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionIntro({
  eyebrow,
  heading,
  children,
  headingLevel = "h2",
  align = "left",
  action,
}: {
  eyebrow: string;
  heading: string;
  children?: ReactNode;
  headingLevel?: "h2" | "h1";
  align?: "left" | "center";
  action?: ReactNode;
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
        <p className="text-caption text-primary">{eyebrow}</p>
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
