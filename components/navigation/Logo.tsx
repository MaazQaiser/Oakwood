import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

const COMPACT_MAX = 40;

/**
 * Mobile header: padded square mark (object-contain — never cropped).
 * Desktop: full wordmark lockup (object-contain).
 * Compact: square mark only.
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
        <>
          {/* Mobile: square mark, a step above the header icon size */}
          <img
            src="/brand/oakwood-mark.png"
            alt="Oakwood Motor Company"
            width={594}
            height={594}
            className="h-14 w-14 object-contain md:hidden"
          />
          {/* Desktop: full lockup */}
          <img
            src="/brand/oakwood-logo.png"
            alt="Oakwood Motor Company"
            width={300}
            height={55}
            className="hidden h-9 w-auto object-contain md:block"
          />
        </>
      )}
    </Link>
  );
}
