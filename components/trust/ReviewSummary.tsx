import { Alert } from "@/components/ui/Alert";
import { IconStar } from "@/components/ui/icons";
import { formatNumber } from "@/lib/format/money";
import { cn } from "@/lib/cn";
import type { ReviewFeed } from "@/types/reviews";

export function ReviewSummary({
  feed,
  variant = "inline",
}: {
  feed: ReviewFeed;
  variant?: "inline" | "prominent";
}) {
  if (feed.status !== "available" || !feed.aggregate) {
    return (
      <Alert title="Reviews" tone="info">
        {feed.notice}
      </Alert>
    );
  }

  const countLabel = `${formatNumber(feed.aggregate.count)} reviews`;
  const ratingLabel = `${feed.aggregate.rating} out of 5, based on ${countLabel}`;

  if (variant === "prominent") {
    return (
      <div className="text-center">
        <p className="flex items-center justify-center gap-2 text-oakwood">
          <span className="text-[2.5rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[3rem]">
            {feed.aggregate.rating}
          </span>
          <IconStar
            width={32}
            height={32}
            className="text-oakwood"
            aria-hidden="true"
          />
        </p>
        <p className="sr-only">{ratingLabel}</p>
        <p className="mt-3 text-body text-muted tabular-nums">Based on {countLabel}</p>
      </div>
    );
  }

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1")}>
      <span className="financial-number financial-number--sm text-ink">
        {feed.aggregate.rating} / 5
      </span>
      <span className="text-body-sm tabular-nums">{countLabel}</span>
    </p>
  );
}
