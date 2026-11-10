import {
  IconAaBadge,
  IconGoogleReview,
  IconProofLocations,
  IconWarrantyBadge,
} from "@/components/home/HomeProofIcons";
import { cn } from "@/lib/cn";
import { HOME_PROOF_ITEMS } from "@/lib/home/copy";
import { mockReviews } from "@/lib/mock/home";

const PROOF_ICONS = {
  reviews: IconGoogleReview,
  aa: IconAaBadge,
  warranty: IconWarrantyBadge,
  locations: IconProofLocations,
} as const;

function GoogleStars({ rating }: { rating: number }) {
  return (
    <span className="mt-1.5 flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, rating - index));
        return (
          <span key={index} className="relative inline-block h-3.5 w-3.5">
            <svg viewBox="0 0 20 20" className="absolute inset-0 text-[#D0D5DD]">
              <path
                fill="currentColor"
                d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8 4.8 17.5l1-5.8L1.6 7.6l5.8-.8L10 1.5z"
              />
            </svg>
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[#FABB05]">
                <path
                  fill="currentColor"
                  d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8 4.8 17.5l1-5.8L1.6 7.6l5.8-.8L10 1.5z"
                />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

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
        const isReviews = point.id === "reviews";
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
                    ? "text-[1.35rem] md:text-[1.5rem]"
                    : "text-[0.95rem] md:text-base",
                )}
              >
                {isReviews ? mockReviews.rating.toFixed(1) : point.lead}
              </p>
              {isReviews ? <GoogleStars rating={mockReviews.rating} /> : null}
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
