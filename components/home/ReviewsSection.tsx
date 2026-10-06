"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Container, Section } from "@/components/layout/Container";
import { OakwoodPhotoSlot } from "@/components/media/OakwoodPhotoSlot";
import { SectionIntro } from "@/components/home/SectionIntro";
import { ReviewSummary } from "@/components/trust/ReviewSummary";
import { ReviewsGrid } from "@/components/trust/ReviewsGrid";
import { routes } from "@/config/routes";
import { HOME_REVIEW_IMAGES } from "@/lib/home/photography";
import type { OakwoodImageSlot } from "@/lib/media/oakwood";
import { getReviewFeed } from "@/lib/reviews/provider";
import { reviewsCopy } from "@/lib/trust/content";

const videoReviews = [
  {
    id: "driving-away",
    title: "Driving away",
    place: "Bury",
    poster: HOME_REVIEW_IMAGES["driving-away"],
  },
  {
    id: "showroom-handover",
    title: "Showroom handover",
    place: "Bury",
    poster: HOME_REVIEW_IMAGES["showroom-handover"],
  },
] as const;

type VideoReview = {
  id: string;
  title: string;
  place: string;
  poster: OakwoodImageSlot;
};

export function ReviewsSection() {
  const feed = getReviewFeed();
  const [active, setActive] = useState<VideoReview | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active]);

  return (
    <Section id="reviews" aria-label="Reviews">
      <Container>
        <SectionIntro align="center" heading={`${reviewsCopy.title}.`}>
          {reviewsCopy.description}
        </SectionIntro>

        <div className="mt-8">
          <ReviewSummary feed={feed} variant="prominent" />
        </div>

        {feed.items.length > 0 ? <ReviewsGrid reviews={feed.items} /> : null}

        <div className="mt-10">
          <h3 className="text-h4 text-oakwood">Video reviews</h3>
          <p className="mt-2 max-w-2xl text-body-sm text-muted">
            Watch customers on collection day, from the showroom to driving away.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {videoReviews.map((review) => (
              <article
                key={review.id}
                className="overflow-hidden rounded-[28px] bg-primary"
              >
                <button
                  type="button"
                  className="group relative block aspect-[16/10] max-h-52 w-full cursor-pointer sm:max-h-64"
                  onClick={() => setActive(review)}
                >
                  <OakwoodPhotoSlot
                    slot={review.poster}
                    fill
                    caption="start"
                    sizes="(max-width: 640px) 100vw, 36rem"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <span className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-primary shadow-[0_10px_24px_rgba(0,97,162,0.28)]">
                    <PlayIcon />
                  </span>
                  <span className="absolute right-5 bottom-5 left-5 text-left text-white">
                    <span className="block text-lg font-semibold">
                      {review.title}
                    </span>
                    <span className="mt-1 block text-sm text-white/80">
                      {review.place}
                    </span>
                  </span>
                  <span className="sr-only">
                    Play video review: {review.title}
                  </span>
                </button>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link href={routes.ourOnlineReviews} className="text-label text-primary-secondary">
            Read all reviews →
          </Link>
        </p>
      </Container>

      {active ? (
        <div
          className="fixed inset-0 z-[var(--oak-z-modal)] grid place-items-center bg-ink/72 p-4"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-primary"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video">
              <OakwoodPhotoSlot slot={active.poster} fill sizes="48rem" />
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
              <div>
                <h3 id={titleId} className="text-lg font-semibold">
                  {active.title}
                </h3>
                <p className="text-sm text-white/75">{active.place}</p>
              </div>
              <button
                type="button"
                className="min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-primary"
                onClick={() => setActive(null)}
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}
