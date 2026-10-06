import Link from "next/link";
import { routes } from "@/config/routes";

const COMPACT_MAX = 40;

/**
 * Lockup follows rendered height.
 * 40px and under: compact mark.
 * Above 40px: full lockup.
 * Above 80px: the supplied asset already stacks the descriptor under the wordmark.
 * With no height, the header uses the compact mark below 48rem and the full lockup above it.
 */
export function Logo({
  compact = false,
  height,
}: {
  compact?: boolean;
  height?: number;
}) {
  const compactOnly = compact || (height !== undefined && height <= COMPACT_MAX);
  const sized = height !== undefined && height > COMPACT_MAX;

  return (
    <Link href={routes.home} className="inline-flex items-center no-underline">
      <img
        src="/brand/oakwood-logo.png"
        alt="Oakwood Motor Company"
        width={300}
        height={55}
        className={
          compactOnly
            ? "h-9 w-11 object-cover object-left"
            : sized
              ? "w-auto"
              : "h-9 w-11 object-cover object-left md:h-12 md:w-auto md:object-contain"
        }
        style={sized ? { height } : undefined}
      />
    </Link>
  );
}
