import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return children;
}

export { SkipLink } from "@/components/layout/SkipLink";
export { SiteHeader } from "@/components/layout/SiteHeader";
export { SiteFooter } from "@/components/layout/SiteFooter";
