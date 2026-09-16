import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "inline-flex min-h-11 items-center text-ink no-underline",
        compact ? "" : "py-1",
      )}
    >
      <span className="text-h6">
        Oakwood
      </span>
      <span className="sr-only"> Motor Company</span>
    </Link>
  );
}
