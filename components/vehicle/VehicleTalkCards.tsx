"use client";

import { getStockLocation } from "@/config/locations";
import { getBookingUrl, supportRoutes } from "@/config/routes";
import { IconMessage, IconPhone, IconPlay } from "@/components/ui/icons";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { toTelHref } from "@/lib/format/phone";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleTalkCards({ vehicle }: { vehicle: VehicleDetail }) {
  const location = getStockLocation(vehicle.locationSlug);
  const telephone = location?.telephone;
  const name = location?.name ?? vehicle.locationName;

  const cards = [
    {
      id: "drive",
      label: "Book a test drive",
      href: getBookingUrl({
        source: "vdp",
        location: location?.isShowroom ? location.slug : undefined,
      }),
      channel: "test-drive" as const,
      icon: <IconPlay width={18} height={18} />,
    },
    {
      id: "call",
      label: "Call now",
      href: telephone ? toTelHref(telephone) : supportRoutes.bookingEnquiry,
      channel: "call" as const,
      icon: <IconPhone />,
    },
    {
      id: "back",
      label: "Call me back",
      href: supportRoutes.bookingEnquiry,
      channel: "callback" as const,
      icon: <IconMessage />,
    },
  ];

  return (
    <section aria-labelledby="talk-heading" className="min-w-0">
      <h2 id="talk-heading" className="sr-only">
        Speak to Oakwood
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {cards.map((card, index) => {
          const featured = index === 0;
          return (
            <a
              key={card.id}
              href={card.href}
              className={cn(
                "group flex min-h-14 flex-row items-center gap-3 rounded-[16px] px-3 py-2.5 no-underline transition sm:px-4",
                featured
                  ? "bg-[#002852] text-white hover:bg-[#001c3d]"
                  : "bg-white text-[#002852] shadow-[0_6px_18px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4] hover:ring-[#C9D6E2]",
              )}
              onClick={() =>
                trackEvent(analyticsEvents.contactClicked, { channel: card.channel })
              }
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-[10px]",
                  featured ? "bg-white text-[#002852]" : "bg-[#ECF3F8] text-[#002852]",
                )}
              >
                {card.icon}
              </span>
              <span className="text-sm font-semibold leading-tight">{card.label}</span>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-caption text-muted">
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-success align-middle" />
        {name}
        {telephone ? (
          <>
            {" · "}
            <a href={toTelHref(telephone)} className="font-semibold text-primary">
              {telephone}
            </a>
          </>
        ) : null}
      </p>
    </section>
  );
}
