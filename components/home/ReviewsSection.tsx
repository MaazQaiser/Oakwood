"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { routes } from "@/config/routes";

const videoReviews = [
  {
    id: "driving-away",
    title: "Driving away",
    place: "Bury",
    poster: "/images/hero/open-sky.png",
    alt: "A smiling customer beside a car under an open sky",
  },
  {
    id: "showroom-handover",
    title: "Showroom handover",
    place: "Bury",
    poster: "/images/hero/showroom-customer.png",
    alt: "A customer with a car in the showroom",
  },
] as const;

type VideoReview = (typeof videoReviews)[number];

export function ReviewsSection() {
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
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Customer reviews"
          heading="Video reviews from Oakwood customers."
        >
          Watch customers on collection day, from the showroom to driving away.
        </SectionIntro>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {videoReviews.map((review) => (
            <article key={review.id} className="overflow-hidden rounded-[28px] bg-[#14325c]">
              <button
                type="button"
                className="group relative block aspect-[16/10] w-full cursor-pointer"
                onClick={() => setActive(review)}
              >
                <Image
                  src={review.poster}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 36rem"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#002852]/70 via-transparent to-transparent" />
                <span className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#002852] shadow-[0_10px_24px_rgba(0,40,82,0.28)]">
                  <PlayIcon />
                </span>
                <span className="absolute right-5 bottom-5 left-5 text-left text-white">
                  <span className="block text-lg font-semibold">{review.title}</span>
                  <span className="mt-1 block text-sm text-white/80">{review.place}</span>
                </span>
                <span className="sr-only">Play video review: {review.title}</span>
              </button>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center">
          <Link href={routes.ourOnlineReviews} className="text-label text-primary">
            Read all reviews →
          </Link>
        </p>
      </Container>

      {active ? (
        <div
          className="fixed inset-0 z-[var(--oak-z-modal)] grid place-items-center bg-[#002852]/72 p-4"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-[#002852]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image src={active.poster} alt={active.alt} fill sizes="48rem" className="object-cover" />
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
                className="min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-[#002852]"
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
