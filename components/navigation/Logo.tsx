import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

const COMPACT_MAX = 40;

/**
 * Header: the full wordmark on every screen. Compact slots keep the square mark.
 */
export function Logo({
  compact = false,
  height,
  className,
}: {
  compact?: boolean;
  height?: number;
  className?: string;
}) {
  const compactOnly = compact || (height !== undefined && height <= COMPACT_MAX);
  const sizedLockup = height !== undefined && height > COMPACT_MAX;

  return (
    <Link
      href={routes.home}
      className={cn(
        "inline-flex shrink-0 items-center overflow-visible no-underline",
        className,
      )}
    >
      {compactOnly ? (
        <img
          src="/brand/oakwood-mark.png"
          alt="Oakwood Motor Company"
          width={594}
          height={594}
          className="object-contain"
          style={{
            height: height ?? 56,
            width: height ?? 56,
          }}
        />
      ) : sizedLockup ? (
        <img
          src="/brand/oakwood-logo.png"
          alt="Oakwood Motor Company"
          width={300}
          height={55}
          className="h-auto w-auto object-contain"
          style={{ height }}
        />
      ) : (
        <img
          src="/brand/oakwood-logo.png"
          alt="Oakwood Motor Company"
          width={300}
          height={55}
          className="h-auto max-h-9 w-auto max-w-full object-contain object-left"
        />
      )}
    </Link>
  );
}
