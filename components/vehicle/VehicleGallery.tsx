"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "@/components/ui/Button";
import { IconArrow, IconClose, IconPlay, IconSearch } from "@/components/ui/icons";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getVehicleGallery } from "@/lib/mock/vehicle-detail";
import { cn } from "@/lib/cn";
import type { VehicleDetail } from "@/types/vehicle-detail";

function isSvg(src: string) {
  return src.endsWith(".svg");
}

export function VehicleGallery({ vehicle }: { vehicle: VehicleDetail }) {
  const items = useMemo(() => getVehicleGallery(vehicle), [vehicle]);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const touchStart = useRef<number | null>(null);
  const current = items[index];

  const goTo = useCallback(
    (next: number) => {
      if (items.length === 0) {
        return;
      }
      const wrapped = (next + items.length) % items.length;
      setIndex(wrapped);
      setVideoPlaying(false);
      const item = items[wrapped];
      if (item?.kind === "image") {
        trackEvent(analyticsEvents.galleryImageViewed, {
          stockId: vehicle.stockId,
          index: wrapped,
        });
      }
    },
    [items, vehicle.stockId],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightbox(false);
      }
      if (event.key === "ArrowRight") {
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft") {
        goTo(index - 1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  if (!current) {
    return null;
  }

  const playVideo = () => {
    setVideoPlaying(true);
    trackEvent(analyticsEvents.videoPlayed, { stockId: vehicle.stockId });
  };

  return (
    <div className="vdp-hero__gallery min-w-0">
      <div className="vdp-hero__gallery-sticky">
      <div
        className="relative overflow-hidden rounded-lg bg-primary-soft"
        onTouchStart={(event) => {
          touchStart.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          const end = event.changedTouches[0]?.clientX;
          if (start == null || end == null) {
            return;
          }
          const delta = start - end;
          if (delta > 40) {
            goTo(index + 1);
          } else if (delta < -40) {
            goTo(index - 1);
          }
        }}
      >
        <div className="relative aspect-[16/10]">
        {current.kind === "video" && videoPlaying && vehicle.video?.src ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              poster={current.poster}
              controls
              preload="none"
              playsInline
            >
              <source src={vehicle.video.src} type="video/mp4" />
            </video>
          ) : current.kind === "video" && videoPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-page p-6 text-center">
              <p className="max-w-md text-body-sm text-muted">
                A walkaround video is listed for this car. The player is not connected
                in this preview, so nothing is auto-played or downloaded.
              </p>
            </div>
          ) : (
            <Image
              src={current.kind === "video" ? (current.poster ?? current.src) : current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              unoptimized={isSvg(current.kind === "video" ? (current.poster ?? current.src) : current.src)}
              className="object-cover"
            />
          )}
        </div>

        {current.kind === "video" && !videoPlaying ? (
          <button
            type="button"
            onClick={playVideo}
            className="absolute inset-0 flex items-center justify-center bg-[rgb(31_27_22/0.28)] text-white"
          >
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 py-2 text-button text-ink">
              <IconPlay />
              Watch video
            </span>
          </button>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
          <IconButton
            label="Previous image"
            className="bg-surface/95 shadow-sm"
            onClick={() => goTo(index - 1)}
          >
            <IconArrow className="rotate-180" />
          </IconButton>
          <p className="rounded-full bg-surface/95 px-3 py-1 text-caption text-ink shadow-sm">
            <span className="financial-number financial-number--sm text-body-sm">
              {index + 1} / {items.length}
            </span>
          </p>
          <IconButton
            label="Next image"
            className="bg-surface/95 shadow-sm"
            onClick={() => goTo(index + 1)}
          >
            <IconArrow />
          </IconButton>
        </div>

        {current.kind === "image" ? (
          <IconButton
            label="Zoom"
            className="absolute right-3 top-3 bg-surface/95 shadow-sm"
            onClick={() => setLightbox(true)}
          >
            <IconSearch />
          </IconButton>
        ) : null}
      </div>

      <ul className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto pb-1">
        {items.map((item, itemIndex) => (
          <li key={`${item.kind}-${item.src}-${itemIndex}`}>
            <button
              type="button"
              aria-label={item.kind === "video" ? item.title ?? "Video" : item.alt}
              aria-current={itemIndex === index ? "true" : undefined}
              className={cn(
                "relative h-11 w-16 overflow-hidden rounded-md border md:h-16 md:w-24",
                itemIndex === index ? "border-primary" : "border-border",
              )}
              onClick={() => goTo(itemIndex)}
            >
              <Image
                src={item.kind === "video" ? (item.poster ?? item.src) : item.src}
                alt=""
                fill
                sizes="96px"
                loading="lazy"
                unoptimized={isSvg(item.kind === "video" ? (item.poster ?? item.src) : item.src)}
                className="object-cover"
              />
              {item.kind === "video" ? (
                <span className="absolute inset-0 flex items-center justify-center bg-[rgb(31_27_22/0.28)] text-white">
                  <IconPlay />
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {lightbox && current.kind === "image" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
        >
          <IconButton
            label="Close"
            className="absolute right-3 top-3 text-white hover:bg-white/10"
            onClick={() => setLightbox(false)}
          >
            <IconClose />
          </IconButton>
          <div className="relative h-full w-full">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              unoptimized={isSvg(current.src)}
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
