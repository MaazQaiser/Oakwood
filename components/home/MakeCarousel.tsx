"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
      <Image src={src} alt="" fill sizes="72px" draggable={false} className="object-contain" />
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
  const [barDragging, setBarDragging] = useState(false);
  const suppressClick = useRef(false);

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

  function maxScroll() {
    const node = scroller.current;
    if (!node) return 0;
    return Math.max(0, node.scrollWidth - node.clientWidth);
  }

  function setScroll(left: number) {
    const node = scroller.current;
    if (!node) return;
    const max = maxScroll();
    node.style.scrollBehavior = "auto";
    node.scrollLeft = Math.min(max, Math.max(0, left));
  }

  function scrollByPage(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    node.style.scrollBehavior = "";
    node.scrollBy({ left: node.clientWidth * direction, behavior: "smooth" });
  }

  function trackDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    const max = maxScroll();
    const rect = track.current?.getBoundingClientRect();
    const width = rect?.width ?? 1;
    const travel = Math.max(1, width * (1 - Math.min(1, VISIBLE / Math.max(makes.length, 1))));
    const onThumb = event.target instanceof HTMLElement && event.target.dataset.thumb === "true";
    const origin = onThumb
      ? (scroller.current?.scrollLeft ?? 0)
      : Math.min(1, Math.max(0, (event.clientX - (rect?.left ?? 0) - (width - travel) / 2) / travel)) * max;
    if (!onThumb) setScroll(origin);
    const startX = event.clientX;
    setBarDragging(true);
    const move = (ev: PointerEvent) => {
      setScroll(origin + ((ev.clientX - startX) / travel) * max);
    };
    const up = () => {
      setBarDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Window listeners still follow the pointer if capture is unavailable.
    }
  }

  function logoDrag(event: ReactPointerEvent<HTMLUListElement>) {
    if (event.button !== 0 || event.pointerType !== "mouse") return;
    const node = scroller.current;
    if (!node) return;
    const startX = event.clientX;
    const origin = node.scrollLeft;
    let moved = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      setScroll(origin - dx);
    };
    const up = () => {
      if (moved) suppressClick.current = true;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    try {
      node.setPointerCapture(event.pointerId);
    } catch {
      // Window listeners still follow the pointer if capture is unavailable.
    }
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
        onPointerDown={logoDrag}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          suppressClick.current = false;
          event.preventDefault();
          event.stopPropagation();
        }}
        className="flex cursor-grab touch-pan-y gap-2 overflow-x-auto pb-1 select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {makes.map((make) => (
          <li
            key={make.slug}
            className="w-[calc((100%-2rem)/5)] shrink-0"
          >
            <Link
              href={getMakeUrl(make.name)}
              aria-label={make.name}
              draggable={false}
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
          className={cn("relative h-8 touch-none select-none", barDragging ? "cursor-grabbing" : "cursor-grab")}
          onPointerDown={trackDrag}
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
            data-thumb="true"
            className={cn(
              "absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary",
              barDragging ? "transition-none" : "transition-[left] duration-75",
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
