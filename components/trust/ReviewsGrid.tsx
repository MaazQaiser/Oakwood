"use client";

import { Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { ReviewCard } from "@/components/trust/ReviewCard";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { Review } from "@/types/reviews";

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        className="mt-8"
        title="No reviews to show yet."
        actions={
          <>
            <Button href={routes.usedCars}>Browse cars</Button>
            <Button href={routes.contact} variant="secondary">
              Contact Oakwood
            </Button>
          </>
        }
      >
        Reviews will appear here when they are published. You can still browse
        cars or get in touch.
      </EmptyState>
    );
  }

  return (
    <Grid columns="default" className="mt-8">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onSelect={(id) =>
            trackEvent(analyticsEvents.reviewClicked, { reviewId: id })
          }
        />
      ))}
    </Grid>
  );
}
