import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

export function StatusDisclosureLink({
  children = "Status disclosure",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={routes.statusDisclosure}
      className={cn(
        "text-primary underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </a>
  );
}
