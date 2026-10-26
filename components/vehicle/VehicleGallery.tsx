"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "@/components/ui/Button";
import { IconArrow, IconPlay } from "@/components/ui/icons";
import { CompareVehicleButton } from "@/components/vehicle/CompareVehicleButton";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getVehicleGallery } from "@/lib/mock/vehicle-detail";
import { cn } from "@/lib/cn";
import { getVehicleTitle } from "@/lib/vehicles/labels";
import type { VehicleDetail } from "@/types/vehicle-detail";

function isSvg(src: string) {
  return src.endsWith(".svg");
}

const galleryControlClass =
  "h-8! w-8! min-h-8! min-w-8! bg-surface/95 p-0 shadow-sm [&_svg]:h-3.5! [&_svg]:w-3.5!";

export function VehicleGallery({
  vehicle,
  presentation = "default",
}: {
  vehicle: VehicleDetail;
  presentation?: "default" | "vdp-v2";
}) {
  const isV2 = presentation === "vdp-v2";
  const items = useMemo(() => getVehicleGallery(vehicle), [vehicle]);
  const [index, setIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
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

  const vehicleName = getVehicleTitle(vehicle);
  const imageBroken = Boolean(current && broken[index]);

  if (!current) {
    return (
      <div className="vdp-hero__gallery min-w-0">
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-page-tint px-6 text-center">
          <p className="text-body-sm text-muted">
            Images are not available for this vehicle.
          </p>
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <CompareVehicleButton
              vehicleName={vehicleName}
              stockId={vehicle.stockId}
              category={vehicle.category}
              className={galleryControlClass}
            />
            <SaveVehicleButton
              vehicleName={vehicleName}
              stockId={vehicle.stockId}
              category={vehicle.category}
              className={galleryControlClass}
            />
          </div>
        </div>
      </div>
    );
  }

  const playVideo = () => {
    setVideoPlaying(true);
    trackEvent(analyticsEvents.videoPlayed, { stockId: vehicle.stockId });
  };

  return (
    <div className="vdp-hero__gallery min-w-0">
      <div className="vdp-hero__gallery-sticky">
      <div
        className={cn(
          "relative overflow-hidden bg-page-tint",
          isV2 ? "rounded-xl" : "rounded-2xl",
        )}
        data-vdp-v2-main-image={isV2 ? "" : undefined}
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
        <div className={cn("relative", isV2 ? "aspect-[4/3]" : "aspect-[16/10]")}>
        {imageBroken ? (
          <div className="absolute inset-0 flex items-center justify-center bg-page-tint px-6 text-center">
            <p className="max-w-md text-body-sm text-muted">
              This image could not be loaded. Try another view from the gallery.
            </p>
          </div>
        ) : current.kind === "video" && videoPlaying && vehicle.video?.src ? (
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
              onError={() =>
                setBroken((currentBroken) => ({ ...currentBroken, [index]: true }))
              }
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

        {items.length > 1 ? (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-2">
            <IconButton
              label="Previous image"
              className={galleryControlClass}
              onClick={() => goTo(index - 1)}
            >
              <IconArrow className="rotate-180" />
            </IconButton>
            <p className="rounded-full bg-surface/95 px-2 py-0.5 text-ink shadow-sm">
              <span className="tabular-number text-caption font-semibold">
                {index + 1} / {items.length}
              </span>
            </p>
            <IconButton
              label="Next image"
              className={galleryControlClass}
              onClick={() => goTo(index + 1)}
            >
              <IconArrow />
            </IconButton>
          </div>
        ) : null}

        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          <CompareVehicleButton
            vehicleName={vehicleName}
            stockId={vehicle.stockId}
            category={vehicle.category}
            className={galleryControlClass}
          />
          <SaveVehicleButton
            vehicleName={vehicleName}
            stockId={vehicle.stockId}
            category={vehicle.category}
            className={galleryControlClass}
          />
        </div>
      </div>

      <ul
        className={cn(
          "flex w-full max-w-full overflow-x-auto pb-1",
          isV2 ? "vdp-v2-thumb-row mt-2 gap-2" : "mt-3 gap-2",
        )}
      >
        {items.map((item, itemIndex) => (
          <li key={`${item.kind}-${item.src}-${itemIndex}`}>
            <button
              type="button"
              aria-label={item.kind === "video" ? item.title ?? "Video" : item.alt}
              aria-current={itemIndex === index ? "true" : undefined}
              className={cn(
                "relative overflow-hidden border",
                isV2
                  ? "h-12 w-16 rounded-[6px]"
                  : "h-12 w-[4.5rem] rounded-sm md:h-[4.25rem] md:w-24",
                itemIndex === index
                  ? isV2
                    ? "border-[#0875D1] border-2"
                    : "border-primary"
                  : isV2
                    ? "border-[#DCE4ED]"
                    : "border-border",
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
      </div>
    </div>
  );
}
