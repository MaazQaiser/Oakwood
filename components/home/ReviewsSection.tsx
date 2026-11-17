"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { IconChevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import {
  HOME_BATCH3_REVIEWS,
  HOME_HANDOVER_PHOTOS,
  HOME_REVIEWS_SUBTITLE,
  HOME_REVIEWS_TITLE,
  REVIEW_SOURCE_ICON,
  type HomepageReview,
} from "@/lib/home/reviews-batch3";

export function ReviewsSection() {
  const reviewTrackRef = useRef<HTMLDivElement>(null);
  const photoTrackRef = useRef<HTMLDivElement>(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      if (width >= 1024) setPerView(3);
      else if (width >= 768) setPerView(2);
      else setPerView(1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const reviewPageCount = Math.max(1, HOME_BATCH3_REVIEWS.length - perView + 1);

  useEffect(() => {
    if (paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % HOME_HANDOVER_PHOTOS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const track = photoTrackRef.current;
    if (!track) return;
    const child = track.children[photoIndex] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, [photoIndex]);

  function scrollReviews(delta: number) {
    const track = reviewTrackRef.current;
    if (!track) return;
    const next = Math.min(reviewPageCount - 1, Math.max(0, reviewPage + delta));
    setReviewPage(next);
    const child = track.children[next] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  }

  function onReviewScroll() {
    const track = reviewTrackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    if (!children.length) return;
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;
    children.forEach((child, index) => {
      const dist = Math.abs(child.offsetLeft - track.scrollLeft);
      if (dist < best) {
        best = dist;
        closest = index;
      }
    });
    setReviewPage(Math.min(reviewPageCount - 1, closest));
  }

  function onPhotoScroll() {
    const track = photoTrackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;
    children.forEach((child, index) => {
      const dist = Math.abs(child.offsetLeft - track.scrollLeft);
      if (dist < best) {
        best = dist;
        closest = index;
      }
    });
    setPhotoIndex(closest);
  }

  return (
    <Section
      id="reviews"
      aria-label="Reviews"
      className="relative overflow-hidden bg-[#ECF3F8] py-12! sm:py-14! lg:py-16!"
    >
      <Container className="relative">
        <SectionIntro heading={HOME_REVIEWS_TITLE}>
          {HOME_REVIEWS_SUBTITLE}
        </SectionIntro>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-end gap-2">
              <CarouselButton
                label="Previous reviews"
                direction="prev"
                disabled={reviewPage === 0}
                onClick={() => scrollReviews(-1)}
              />
              <CarouselButton
                label="Next reviews"
                direction="next"
                disabled={reviewPage >= reviewPageCount - 1}
                onClick={() => scrollReviews(1)}
              />
            </div>

            <div
              ref={reviewTrackRef}
              onScroll={onReviewScroll}
              className={cn(
                "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3",
                "[scrollbar-width:thin] [scrollbar-color:#8EBFDF_#ECF3F8]",
                "[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#8EBFDF] [&::-webkit-scrollbar-track]:bg-[#D7E6F2]",
              )}
            >
              {HOME_BATCH3_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className={cn(
                    "snap-start shrink-0",
                    perView === 1 && "w-[88%]",
                    perView === 2 && "w-[calc((100%-1rem)/2)]",
                    perView === 3 && "w-[calc((100%-2rem)/3)]",
                  )}
                >
                  <ReviewQuoteCard review={review} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-start gap-2">
              {Array.from({ length: reviewPageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show reviews starting at ${index + 1}`}
                  aria-current={index === reviewPage}
                  onClick={() => {
                    setReviewPage(index);
                    const track = reviewTrackRef.current;
                    const child = track?.children[index] as HTMLElement | undefined;
                    if (track && child) {
                      track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "h-2.5 rounded-full transition-[width,background-color] duration-[var(--oak-motion-base)]",
                    index === reviewPage
                      ? "w-7 bg-[#002852]"
                      : "w-2.5 bg-[#D7E6F2] hover:bg-[#8EBFDF]",
                  )}
                />
              ))}
            </div>
          </div>

          <aside
            aria-label="Customer handovers"
            className="min-w-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <p className="oak-eyebrow mb-4">Recent handovers</p>
            <div
              ref={photoTrackRef}
              onScroll={onPhotoScroll}
              className={cn(
                "flex snap-x snap-mandatory gap-3 overflow-x-auto",
                "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {HOME_HANDOVER_PHOTOS.map((photo) => (
                <figure
                  key={photo.id}
                  className="relative aspect-[4/5] w-full shrink-0 snap-start overflow-hidden rounded-[24px] bg-[#ECF3F8] shadow-[0_18px_40px_rgba(0,40,82,0.08)] lg:aspect-[5/6]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 88vw, 28vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-1.5 lg:justify-start">
              {HOME_HANDOVER_PHOTOS.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  aria-label={`Show handover photo ${index + 1}`}
                  aria-current={index === photoIndex}
                  onClick={() => setPhotoIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-[var(--oak-motion-fast)]",
                    index === photoIndex ? "bg-[#002852]" : "bg-[#D7E6F2]",
                  )}
                />
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function ReviewQuoteCard({ review }: { review: HomepageReview }) {
  const icon = REVIEW_SOURCE_ICON[review.source];

  return (
    <article className="relative flex h-full flex-col rounded-[22px] bg-white p-5 shadow-[0_14px_34px_rgba(0,40,82,0.08)] sm:p-6">
      <Image
        src={icon.src}
        alt={icon.label}
        width={22}
        height={22}
        className="absolute top-5 right-5"
      />
      <blockquote className="pr-8 text-[0.98rem] leading-relaxed text-[#002852]">
        “{review.text}”
      </blockquote>
      <footer className="mt-4">
        <p className="text-sm font-semibold text-[#002852]">{review.reviewer}</p>
        <p className="mt-0.5 text-caption text-secondary">{icon.label} review</p>
      </footer>
    </article>
  );
}

function CarouselButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: "prev" | "next";
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border border-[#D7E6F2] bg-white text-[#002852] transition-[background-color,opacity] duration-[var(--oak-motion-fast)]",
        disabled ? "cursor-not-allowed opacity-40" : "hover:bg-[#ECF3F8]",
      )}
    >
      <IconChevron
        width={18}
        height={18}
        className={direction === "prev" ? "rotate-90" : "-rotate-90"}
      />
    </button>
  );
}
