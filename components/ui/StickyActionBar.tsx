import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StickyActionBar({
  children,
  className,
  hiddenOnDesktop = true,
}: {
  children: ReactNode;
  className?: string;
  hiddenOnDesktop?: boolean;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[var(--oak-consent-offset,0px)] z-[30] border-t border-border bg-surface px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3",
        hiddenOnDesktop && "lg:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
