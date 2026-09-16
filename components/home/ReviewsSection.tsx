import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { ReviewSummary } from "@/components/trust/ReviewSummary";
import { getReviewFeed } from "@/lib/reviews/provider";
import { routes } from "@/config/routes";

export function ReviewsSection() {
  const feed = getReviewFeed();

  return (
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Customer reviews"
          heading="Reviews from Oakwood customers."
        >
          Ratings and comments will appear here when the review provider is
          connected, including mixed scores where they exist.
        </SectionIntro>
        <div className="mx-auto mt-8 max-w-xl">
          <ReviewSummary feed={feed} />
        </div>
        <p className="mt-6 text-center">
          <Link href={routes.ourOnlineReviews} className="text-label text-primary">
            Read all reviews →
          </Link>
        </p>
      </Container>
    </Section>
  );
}
