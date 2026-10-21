"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMakeUrl } from "@/config/routes";
import { cn } from "@/lib/cn";

const MAKE_LOGOS: Record<string, string> = {
  audi: "/images/brand-logos/audi.png",
  bmw: "/images/brand-logos/bmw.png",
  ford: "/images/brand-logos/ford.png",
  "mercedes-benz": "/images/brand-logos/mercedes.png",
  volkswagen: "/images/brand-logos/volkswagen.png",
  toyota: "/images/brand-logos/toyota.png",
  hyundai: "/images/brand-logos/hyundai.png",
  vauxhall: "/images/brand-logos/vauxhall.png",
  nissan: "/images/brand-logos/nissan.png",
  kia: "/images/brand-logos/kia.png",
};

const VISIBLE = 5;

function MakeLogo({ slug }: { slug: string }) {
  const src = MAKE_LOGOS[slug];
  if (!src) return null;

  return (
    <span className="relative mx-auto block h-8 w-full max-w-[4.5rem]">
      <Image src={src} alt="" fill sizes="72px" className="object-contain" />
    </span>
  );
}

export function MakeCarousel({
  makes,
}: {
  makes: { slug: string; name: string }[];
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState({ max: 0, value: 0 });
  const dragging = useRef(false);

  const syncProgress = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    const max = Math.max(0, node.scrollWidth - node.clientWidth);
    setProgress({ max, value: node.scrollLeft });
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    syncProgress();
    node.addEventListener("scroll", syncProgress, { passive: true });
    const ro = new ResizeObserver(syncProgress);
    ro.observe(node);
    return () => {
      node.removeEventListener("scroll", syncProgress);
      ro.disconnect();
    };
  }, [makes, syncProgress]);

  function scrollByPage(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: node.clientWidth * direction, behavior: "smooth" });
  }

  function scrollToRatio(ratio: number) {
    const node = scroller.current;
    if (!node || progress.max <= 0) return;
    node.scrollLeft = Math.min(progress.max, Math.max(0, ratio * progress.max));
  }

  function pointerToRatio(clientX: number) {
    const el = track.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  const thumbRatio =
    progress.max > 0 ? Math.min(1, VISIBLE / makes.length) : 1;
  const thumbLeft =
    progress.max > 0
      ? (progress.value / progress.max) * (1 - thumbRatio)
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 px-6 sm:px-10 lg:px-14">
        <h2 className="text-h3 text-navy">Browse by make</h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Show previous makes"
            onClick={() => scrollByPage(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-page-tint"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M14.5 6 8.5 12l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Show next makes"
            onClick={() => scrollByPage(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-page-tint"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 px-6 sm:px-10 lg:px-14">
      <ul
        id="browse-by-make-scroller"
        ref={scroller}
        className="flex gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {makes.map((make) => (
          <li
            key={make.slug}
            className="w-[calc((100%-2rem)/5)] shrink-0"
          >
            <Link
              href={getMakeUrl(make.name)}
              aria-label={make.name}
              className="flex items-center justify-center px-1 py-3 no-underline sm:px-2"
            >
              <MakeLogo slug={make.slug} />
            </Link>
          </li>
        ))}
      </ul>
      </div>

      {/* Drag the line to move through the makes. Arrows page five at a time. */}
      <div className="mt-5 px-6 sm:px-10 lg:px-14">
        <div
          ref={track}
          role="scrollbar"
          aria-controls="browse-by-make-scroller"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.round(progress.max)}
          aria-valuenow={Math.round(progress.value)}
          aria-label="Scroll makes"
          tabIndex={0}
          className="relative h-8 cursor-pointer touch-none"
          onPointerDown={(event) => {
            dragging.current = true;
            scrollToRatio(pointerToRatio(event.clientX));
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              dragging.current = false;
            }
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return;
            scrollToRatio(pointerToRatio(event.clientX));
          }}
          onPointerUp={(event) => {
            dragging.current = false;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              scrollByPage(1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              scrollByPage(-1);
            }
          }}
        >
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#D5E3EE]" />
          <div
            className={cn(
              "absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary transition-[left] duration-75",
              dragging.current && "transition-none",
            )}
            style={{
              width: `${Math.max(thumbRatio * 100, 12)}%`,
              left: `${thumbLeft * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
