import { cn } from "@/lib/cn";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90]",
        "focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-md",
      )}
    >
      Skip to content
    </a>
  );
}
