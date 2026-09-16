import { Card } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { IconStar } from "@/components/ui/icons";
import type { Review } from "@/types/reviews";

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <p className="flex gap-1" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <IconStar
          key={index}
          className={index < clamped ? "text-primary" : "text-border-strong"}
        />
      ))}
    </p>
  );
}

export function ReviewCard({
  review,
  onSelect,
}: {
  review: Review;
  onSelect?: (id: string) => void;
}) {
  return (
    <Card as="article">
      <StarRating rating={review.rating} />
      <blockquote className="mt-4 text-body">“{review.text}”</blockquote>
      <footer className="mt-4 space-y-1">
        {review.customerName ? (
          <p className="text-label">{review.customerName}</p>
        ) : (
          <p className="text-label">Oakwood customer</p>
        )}
        <p className="text-caption text-muted">
          {[review.locationName, review.date, review.source]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {review.colleagueName ? (
          <p className="text-caption text-muted">
            Colleague: {review.colleagueName}
          </p>
        ) : null}
      </footer>
      {onSelect ? (
        <Button
          variant="text"
          className="mt-4 px-0"
          onClick={() => onSelect(review.id)}
        >
          View review
        </Button>
      ) : null}
    </Card>
  );
}
