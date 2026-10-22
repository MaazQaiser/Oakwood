import {
  IconAaBadge,
  IconGoogleReview,
  IconProofLocations,
  IconWarrantyBadge,
} from "@/components/home/HomeProofIcons";
import { cn } from "@/lib/cn";
import { HOME_PROOF_ITEMS } from "@/lib/home/copy";

const PROOF_ICONS = {
  reviews: IconGoogleReview,
  aa: IconAaBadge,
  warranty: IconWarrantyBadge,
  locations: IconProofLocations,
} as const;

export function HomeProofStrip({ className }: { className?: string }) {
  return (
    <ul
      aria-label="Oakwood at a glance"
      className={cn(
        "my-4 grid w-full grid-cols-2 gap-3 md:my-6 md:grid-cols-4 md:gap-4",
        className,
      )}
    >
      {HOME_PROOF_ITEMS.map((point) => {
        const Icon = PROOF_ICONS[point.id];
        return (
          <li
            key={point.id}
            className="flex min-w-0 flex-col items-start gap-4 rounded-[20px] bg-white px-3.5 py-4 shadow-[0_10px_24px_rgba(16,40,72,0.06)] md:gap-5 md:px-4 md:py-5"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center md:h-11 md:w-11">
              <Icon />
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "m-0 font-semibold leading-tight tracking-[-0.02em] text-primary tabular-nums",
                  point.accent
                    ? "text-[1.15rem] md:text-[1.25rem]"
                    : "text-[0.95rem] md:text-base",
                )}
              >
                {point.lead}
              </p>
              <p className="m-0 mt-1 text-[0.7rem] leading-snug text-secondary md:text-xs">
                {point.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
