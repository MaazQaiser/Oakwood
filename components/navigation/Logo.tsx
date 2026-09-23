import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "inline-flex min-h-11 items-center no-underline",
        compact ? "" : "py-1",
      )}
    >
      <img
        src="/brand/oakwood-logo.png"
        alt="Oakwood Motor Company"
        width={300}
        height={55}
        className="h-8 w-auto"
      />
    </Link>
  );
}
