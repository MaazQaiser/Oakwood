import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerWidth = "narrow" | "content" | "wide";

const widths: Record<ContainerWidth, string> = {
  narrow: "max-w-[var(--oak-width-narrow)]",
  content: "max-w-[var(--oak-width-content)]",
  wide: "max-w-[var(--oak-width-wide)]",
};

export function Container({
  children,
  width = "content",
  className,
}: {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--oak-page-x)]",
        widths[width],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return <Tag className={cn("space-section", className)}>{children}</Tag>;
}

export function Stack({
  children,
  gap = "4",
  className,
}: {
  children: ReactNode;
  gap?: "2" | "3" | "4" | "6" | "8";
  className?: string;
}) {
  const gaps = {
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
  };

  return (
    <div className={cn("flex flex-col", gaps[gap], className)}>{children}</div>
  );
}

export function Inline({
  children,
  gap = "3",
  className,
  wrap = true,
}: {
  children: ReactNode;
  gap?: "2" | "3" | "4" | "6";
  className?: string;
  wrap?: boolean;
}) {
  const gaps = {
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
  };

  return (
    <div
      className={cn(
        "flex items-center",
        wrap && "flex-wrap",
        gaps[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Grid({
  children,
  className,
  columns = "default",
}: {
  children: ReactNode;
  className?: string;
  columns?: "default" | "cards" | "two" | "featured" | "budget";
}) {
  const columnClass = {
    default: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    cards: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
    two: "grid-cols-1 md:grid-cols-2",
    featured: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    budget: "grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <div className={cn("grid gap-4 md:gap-6", columnClass, className)}>
      {children}
    </div>
  );
}

export function ScrollRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "-mx-[var(--oak-page-x)] overflow-x-auto overscroll-x-contain px-[var(--oak-page-x)] pb-2 [scrollbar-width:thin] md:mx-0 md:overflow-visible md:px-0 md:pb-0",
        className,
      )}
    >
      <div className="flex gap-4 md:contents">{children}</div>
    </div>
  );
}
