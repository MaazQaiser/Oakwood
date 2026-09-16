"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconPlay } from "@/components/ui/icons";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleVideo({ vehicle }: { vehicle: VehicleDetail }) {
  const [playing, setPlaying] = useState(false);
  const video = vehicle.video;

  if (!video) {
    return null;
  }

  return (
    <section aria-labelledby="vehicle-video-heading">
      <h2 id="vehicle-video-heading" className="text-h3">
        See the car in more detail
      </h2>
      <p className="mt-2 text-body-sm text-muted">{video.description}</p>
      <div className="relative mt-4 overflow-hidden rounded-lg bg-primary-soft">
        <div className="relative aspect-[16/10]">
          {playing && video.src ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              poster={video.poster}
              controls
              preload="none"
              playsInline
            >
              <source src={video.src} type="video/mp4" />
            </video>
          ) : playing && !video.src ? (
            <div className="absolute inset-0 flex items-center justify-center bg-page p-6 text-center">
              <p className="max-w-md text-body-sm text-muted">
                A walkaround video is listed for this car. The player is not connected
                in this preview, so nothing is auto-played or downloaded.
              </p>
            </div>
          ) : (
            <Image
              src={video.poster}
              alt={video.title}
              fill
              sizes="(max-width: 1024px) 100vw, 75rem"
              loading="lazy"
              unoptimized={video.poster.endsWith(".svg")}
              className="object-cover"
            />
          )}
        </div>
        {!playing ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => {
                setPlaying(true);
                trackEvent(analyticsEvents.videoPlayed, {
                  stockId: vehicle.stockId,
                  location: "section",
                });
              }}
            >
              <IconPlay />
              Watch video
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
