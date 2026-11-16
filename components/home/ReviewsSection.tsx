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

const VISIBLE = 3;

export function ReviewsSection() {
  const [start, setStart] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxStart = Math.max(0, HOME_BATCH3_REVIEWS.length - VISIBLE);
  const pageCount = maxStart + 1;

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % HOME_HANDOVER_PHOTOS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  function go(delta: number) {
    setStart((current) => Math.min(maxStart, Math.max(0, current + delta)));
  }

  const visibleReviews = HOME_BATCH3_REVIEWS.slice(start, start + VISIBLE);
  const primaryPhoto = HOME_HANDOVER_PHOTOS[photoIndex] ?? HOME_HANDOVER_PHOTOS[0];
  const secondaryPhoto =
    HOME_HANDOVER_PHOTOS[(photoIndex + 1) % HOME_HANDOVER_PHOTOS.length] ??
    HOME_HANDOVER_PHOTOS[1];

  return (
    <Section
      id="reviews"
      aria-label="Reviews"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F4F8FC_0%,#FFFFFF_55%)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_15%_0%,_rgba(142,191,223,0.28),_transparent_60%)]"
      />
      <Container className="relative">
        <SectionIntro heading={HOME_REVIEWS_TITLE}>
          {HOME_REVIEWS_SUBTITLE}
        </SectionIntro>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:items-stretch lg:gap-10">
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="oak-eyebrow">Customer reviews</p>
              <div className="flex items-center gap-2">
                <CarouselButton
                  label="Previous reviews"
                  direction="prev"
                  disabled={start === 0}
                  onClick={() => go(-1)}
                />
                <CarouselButton
                  label="Next reviews"
                  direction="next"
                  disabled={start >= maxStart}
                  onClick={() => go(1)}
                />
              </div>
            </div>

            <div ref={trackRef} className="flex flex-col gap-4">
              {visibleReviews.map((review) => (
                <ReviewQuoteCard key={`${review.id}-${start}`} review={review} />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-start gap-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show reviews starting at ${index + 1}`}
                  aria-current={index === start}
                  onClick={() => setStart(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-[width,background-color] duration-[var(--oak-motion-base)]",
                    index === start ? "w-7 bg-[#002852]" : "w-2.5 bg-[#D7E6F2] hover:bg-[#8EBFDF]",
                  )}
                />
              ))}
            </div>
          </div>

          <aside aria-label="Customer handovers" className="min-w-0">
            <p className="oak-eyebrow mb-4">Recent handovers</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#ECF3F8] shadow-[0_18px_40px_rgba(0,40,82,0.08)] lg:aspect-[5/6]">
                <Image
                  key={primaryPhoto.id}
                  src={primaryPhoto.src}
                  alt={primaryPhoto.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 28vw"
                  className="object-cover transition-opacity duration-[var(--oak-motion-slow)]"
                  priority={false}
                />
              </figure>
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#ECF3F8] shadow-[0_18px_40px_rgba(0,40,82,0.08)] sm:aspect-[4/5] lg:aspect-[16/11]">
                <Image
                  key={secondaryPhoto.id}
                  src={secondaryPhoto.src}
                  alt={secondaryPhoto.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 28vw"
                  className="object-cover"
                />
              </figure>
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
    <article className="relative flex flex-col rounded-[22px] bg-white p-5 shadow-[0_14px_34px_rgba(0,40,82,0.08)] sm:p-6">
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
