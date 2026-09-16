import { Alert } from "@/components/ui/Alert";
import { formatNumber } from "@/lib/format/money";
import type { ReviewFeed } from "@/types/reviews";

export function ReviewSummary({ feed }: { feed: ReviewFeed }) {
  if (feed.status !== "available" || !feed.aggregate) {
    return (
      <Alert title="Reviews" tone="info">
        {feed.notice}
      </Alert>
    );
  }

  return (
    <p>
      <span className="financial-number financial-number--sm text-ink">
        {feed.aggregate.rating} / 5
      </span>
      <span className="ml-3 text-body-sm">
        {formatNumber(feed.aggregate.count)} reviews
      </span>
    </p>
  );
}
